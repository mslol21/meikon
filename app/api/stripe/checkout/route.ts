import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { stripe, STRIPE_PRICE_ID } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: "Assinatura não encontrada" },
        { status: 404 }
      )
    }

    if (subscription.mercadoPagoSubscriptionId) {
      return NextResponse.json(
        { error: "Você já possui uma assinatura ativa via MercadoPago." },
        { status: 400 }
      )
    }

    // If user already has a Stripe subscription, redirect to portal
    if (subscription.stripeSubscriptionId) {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      })

      return NextResponse.json({ url: portalSession.url })
    }

    // Create checkout session for new subscription
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: subscription.stripeCustomerId.startsWith("temp_")
        ? undefined
        : subscription.stripeCustomerId,
      customer_email: subscription.stripeCustomerId.startsWith("temp_")
        ? session.user.email!
        : undefined,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      metadata: {
        userId: session.user.id,
      },
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          userId: session.user.id,
        },
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Erro ao criar sessão de checkout" },
      { status: 500 }
    )
  }
}
