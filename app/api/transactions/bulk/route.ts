import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const bulkTransactionSchema = z.array(
  z.object({
    type: z.enum(["income", "expense"]),
    amount: z.number().positive(),
    description: z.string().min(1),
    category: z.string().min(1),
    date: z.string().datetime(),
    isPaid: z.boolean().default(true),
  })
)

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const data = bulkTransactionSchema.parse(body)

    // Check subscription and transaction limit
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (subscription?.plan === "free") {
      const transactionCount = await prisma.transaction.count({
        where: { userId: session.user.id },
      })

      const newTotal = transactionCount + data.length
      if (newTotal > 20) {
        return NextResponse.json(
          {
            error: `Limite ultrapassado. Você já possui ${transactionCount} transações e o plano Free permite apenas 20 no total.`,
          },
          { status: 403 }
        )
      }
    }

    // Usar transaction para garantir que tudo seja salvo ou nada
    const transactions = await prisma.$transaction(
      data.map((t) =>
        prisma.transaction.create({
          data: {
            ...t,
            date: new Date(t.date),
            userId: session.user.id,
          },
        })
      )
    )

    return NextResponse.json(transactions, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos no envio em lote" },
        { status: 400 }
      )
    }

    console.error("Bulk create transactions error:", error)
    return NextResponse.json(
      { error: "Erro ao criar transações em lote" },
      { status: 500 }
    )
  }
}
