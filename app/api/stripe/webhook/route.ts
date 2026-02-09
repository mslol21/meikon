import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (!userId) {
          throw new Error("No userId in metadata")
        }

        // Update subscription with Stripe customer ID
        await prisma.subscription.update({
          where: { userId },
          data: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            status: "trialing",
            plan: "pro",
          },
        })
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) {
          // Try to find by customer ID
          const existingSub = await prisma.subscription.findUnique({
            where: { stripeCustomerId: subscription.customer as string },
          })

          if (!existingSub) {
            throw new Error("Subscription not found")
          }

          await prisma.subscription.update({
            where: { id: existingSub.id },
            data: {
              status: subscription.status,
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
          })
        } else {
          await prisma.subscription.update({
            where: { userId },
            data: {
              status: subscription.status,
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
          })
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        const existingSub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        })

        if (existingSub) {
          await prisma.subscription.update({
            where: { id: existingSub.id },
            data: {
              status: "canceled",
              plan: "free",
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            },
          })
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription) {
          const existingSub = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: invoice.subscription as string },
          })

          if (existingSub) {
            await prisma.subscription.update({
              where: { id: existingSub.id },
              data: {
                status: "past_due",
              },
            })
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
