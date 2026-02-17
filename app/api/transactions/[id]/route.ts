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
  productId: z.string().optional().nullable(),
  quantity: z.number().int().positive().optional(),
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

    const transaction = await prisma.$transaction(async (tx) => {
      // 1. Revert old stock impact if it was an income with a product
      if (existingTransaction.type === "income" && existingTransaction.productId) {
        await tx.product.update({
          where: { id: existingTransaction.productId },
          data: {
            stock: {
              increment: (existingTransaction as any).quantity || 1
            }
          }
        })
      }

      // 2. Update the transaction
      const updated = await tx.transaction.update({
        where: { id: params.id },
        data: {
          ...data,
          date: data.date ? new Date(data.date) : undefined,
          productId: data.productId,
          quantity: data.quantity ?? undefined,
        },
      })

      // 3. Apply new stock impact if it's an income with a product
      const finalType = data.type || existingTransaction.type
      const finalProductId = data.productId !== undefined ? data.productId : existingTransaction.productId
      const finalQuantity = data.quantity !== undefined ? data.quantity : (existingTransaction as any).quantity

      if (finalType === "income" && finalProductId) {
        await tx.product.update({
          where: { id: finalProductId },
          data: {
            stock: {
              decrement: finalQuantity || 1
            }
          }
        })
      }

      return updated
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

    await prisma.$transaction(async (tx) => {
      // If the transaction had a product associated, restore the stock
      if (existingTransaction.type === "income" && existingTransaction.productId) {
        await tx.product.update({
          where: { id: existingTransaction.productId },
          data: {
            stock: {
              increment: (existingTransaction as any).quantity || 1
            }
          }
        })
      }

      await tx.transaction.delete({
        where: { id: params.id },
      })
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
