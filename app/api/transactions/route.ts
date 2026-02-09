import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Valor deve ser positivo"),
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  date: z.string().datetime(),
  isPaid: z.boolean().default(true),
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where: any = {
      userId: session.user.id,
    }

    if (type) where.type = type
    if (category) where.category = category
    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Get transactions error:", error)
    return NextResponse.json(
      { error: "Erro ao buscar transações" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const data = transactionSchema.parse(body)

    // Check subscription and transaction limit
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (subscription?.plan === "free") {
      const transactionCount = await prisma.transaction.count({
        where: { userId: session.user.id },
      })

      if (transactionCount >= 20) {
        return NextResponse.json(
          {
            error:
              "Limite de 20 transações atingido. Faça upgrade para o plano PRO.",
          },
          { status: 403 }
        )
      }
    }

    const transaction = await prisma.transaction.create({
      data: {
        type: data.type,
        amount: data.amount,
        description: data.description,
        category: data.category,
        date: new Date(data.date),
        isPaid: data.isPaid,
        userId: session.user.id,
      },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Create transaction error:", error)
    return NextResponse.json(
      { error: "Erro ao criar transação" },
      { status: 500 }
    )
  }
}
