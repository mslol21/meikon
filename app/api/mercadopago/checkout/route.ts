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

    // Garantir que exista um registro de subscription (mesmo que free) para o usuário
    if (!subscription) {
      await prisma.subscription.create({
        data: {
          userId: session.user.id,
          stripeCustomerId: `temp_${session.user.id}`,
          status: "active",
          plan: "free",
        },
      })
    }

    // Calcular data de início (COMEÇO IMEDIATO para ativação da conta)
    const startDate = new Date()
    startDate.setSeconds(startDate.getSeconds() + 30) // 30 segundos no futuro para evitar erro de atraso
    startDate.setMilliseconds(0) 

    // Validar URL de retorno (obrigatório ser absoluta para o MercadoPago)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://meikon.vercel.app"
    const back_url = `${baseUrl}/dashboard?success=true`

    try {
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
          back_url: back_url,
          external_reference: session.user.id,
          status: "pending",
        }
      })

      return NextResponse.json({ url: result.init_point })
    } catch (mpError: any) {
      console.error("MercadoPago API Error Details:", JSON.stringify(mpError, null, 2))
      return NextResponse.json(
        { error: mpError.message || "Erro na API do MercadoPago" },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error("General Checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Erro ao criar assinatura" },
      { status: 500 }
    )
  }
}
