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
    
    // Check status
    // status: authorized, paused, cancelled
    const status = subscription.status
    const userId = subscription.external_reference
    
    if (!userId) {
        console.error("No user ID found in subscription:", id)
        return
    }

    // Map status to our DB status
    // Our DB: "active" | "canceled" | "trialing" | "past_due"
    // MP: pending, authorized, paused, cancelled, rejected
    
    let dbStatus = "active"
    if (status === "pending") dbStatus = "trialing" // If future start date
    if (status === "authorized") dbStatus = "active"
    if (status === "paused") dbStatus = "past_due"
    if (status === "cancelled") dbStatus = "canceled"
    if (status === "rejected") dbStatus = "canceled"

    // Verify if it's a trial
    // If startDate is in future, maybe 'trialing'
    // But 'authorized' usually means it's good to go.
    
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        mercadoPagoSubscriptionId: id,
        mercadoPagoCustomerId: subscription.payer_id?.toString(),
        plan: "pro",
        status: dbStatus,
        mercadoPagoCurrentPeriodEnd: subscription.next_payment_date ? new Date(subscription.next_payment_date) : undefined
      },
      update: {
        mercadoPagoSubscriptionId: id,
        mercadoPagoCustomerId: subscription.payer_id?.toString(),
        plan: "pro",
        status: dbStatus,
        mercadoPagoCurrentPeriodEnd: subscription.next_payment_date ? new Date(subscription.next_payment_date) : undefined
      }
    })

  } catch (error) {
    console.error("Error handling preapproval:", error)
    throw error
  }
}
