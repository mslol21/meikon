import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { preapproval } from "@/lib/mercadopago"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    // Se já tiver uma assinatura ativa (Stripe ou MercadoPago)
    if (subscription) {
      if (subscription.stripeSubscriptionId) {
         return NextResponse.json(
          { error: "Você já possui uma assinatura ativa via Stripe. Gerencie-a pelo portal." },
          { status: 400 }
        )
      }
      if (subscription.mercadoPagoSubscriptionId) {
         return NextResponse.json(
          { error: "Você já possui uma assinatura ativa via MercadoPago." },
          { status: 400 }
        )
      }
    }

    // Calcular data de início (14 dias de teste)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + 14)

    const result = await preapproval.create({
      body: {
        reason: "Assinatura MEIKon Pro",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 39,
          currency_id: "BRL",
          start_date: startDate.toISOString(),
        },
        payer_email: session.user.email,
        back_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
        external_reference: session.user.id,
        status: "pending",
      }
    })

    return NextResponse.json({ url: result.init_point })

  } catch (error) {
    console.error("MercadoPago Checkout error:", error)
    return NextResponse.json(
      { error: "Erro ao criar assinatura no MercadoPago" },
      { status: 500 }
    )
  }
}
