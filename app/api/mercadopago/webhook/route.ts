import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/db"
import { preapproval } from "@/lib/mercadopago"

export async function POST(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams
    const topic = searchParams.get("topic") || searchParams.get("type")
    const id = searchParams.get("id") || searchParams.get("data.id")

    if (!topic || !id) {
       // Also check body for notification format
       const body = await req.json().catch(() => ({}))
       if (body.type === "subscription_preapproval") {
           // Handle body format
           await handlePreapproval(body.data.id)
           return NextResponse.json({ ok: true })
       }
       return NextResponse.json({ ok: true }) // Return 200 to avoid retries if not relevant
    }

    console.log(`MercadoPago Webhook Received: Topic=${topic}, ID=${id}`)

    if (topic === "preapproval") {
      await handlePreapproval(id)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("MercadoPago Webhook Error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

async function handlePreapproval(id: string) {
  try {
    const subscription = await preapproval.get({ id })
    console.log("MP Subscription Data:", JSON.stringify(subscription, null, 2))
    
    // Check status
    // status: authorized, paused, cancelled
    const status = subscription.status
    const userId = subscription.external_reference
    
    if (!userId) {
        console.error("No user ID found in subscription external_reference:", id)
        // Tentativa de backup via metadata ou payer_email se necessário, mas o external_reference é o ideal
        return
    }

    // Map status to our DB status
    // Our DB: "active" | "canceled" | "trialing" | "past_due"
    // MP: pending, authorized, paused, cancelled, rejected
    
    let dbStatus = "active"
    if (status === "pending") dbStatus = "trialing"
    if (status === "authorized") dbStatus = "active"
    if (status === "paused") dbStatus = "past_due"
    if (status === "cancelled") dbStatus = "canceled"
    if (status === "rejected") dbStatus = "canceled"

    console.log(`Updating DB for user ${userId} to status ${dbStatus}`)
    
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        mercadoPagoSubscriptionId: id,
        mercadoPagoCustomerId: subscription.payer_id?.toString(),
        mercadoPagoPlanId: subscription.preapproval_plan_id,
        plan: "pro",
        status: dbStatus,
        mercadoPagoCurrentPeriodEnd: subscription.next_payment_date ? new Date(subscription.next_payment_date) : undefined
      },
      update: {
        mercadoPagoSubscriptionId: id,
        mercadoPagoCustomerId: subscription.payer_id?.toString(),
        mercadoPagoPlanId: subscription.preapproval_plan_id,
        plan: "pro",
        status: dbStatus,
        mercadoPagoCurrentPeriodEnd: subscription.next_payment_date ? new Date(subscription.next_payment_date) : undefined
      }
    })

    console.log(`Successfully updated subscription for user ${userId}`)

  } catch (error) {
    console.error("Error handling preapproval:", error)
    throw error
  }
}
