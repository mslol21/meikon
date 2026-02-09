import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const updateSchema = z.object({
  type: z.enum(["income", "expense"]).optional(),
  amount: z.number().positive().optional(),
  description: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  date: z.string().datetime().optional(),
  isPaid: z.boolean().optional(),
})

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const data = updateSchema.parse(body)

    // Check if transaction belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      )
    }

    const transaction = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    })

    return NextResponse.json(transaction)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Update transaction error:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar transação" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Check if transaction belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      )
    }

    await prisma.transaction.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Transação deletada com sucesso" })
  } catch (error) {
    console.error("Delete transaction error:", error)
    return NextResponse.json(
      { error: "Erro ao deletar transação" },
      { status: 500 }
    )
  }
}
