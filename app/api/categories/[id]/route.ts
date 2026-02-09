import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["income", "expense"]),
  icon: z.string().min(1, "Ícone é obrigatório"),
  color: z.string().min(1, "Cor é obrigatória"),
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

    const category = await prisma.category.findUnique({
      where: { id: params.id },
    })

    if (!category || category.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      )
    }

    const body = await req.json()
    const data = categorySchema.parse(body)

    const updated = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: data.name,
        type: data.type,
        icon: data.icon,
        color: data.color,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Update category error:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar categoria" },
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

    const category = await prisma.category.findUnique({
      where: { id: params.id },
    })

    if (!category || category.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      )
    }

    // Check if category is being used
    const transactionCount = await prisma.transaction.count({
      where: {
        userId: session.user.id,
        category: category.name,
      },
    })

    if (transactionCount > 0) {
      return NextResponse.json(
        {
          error: `Não é possível deletar. Esta categoria está sendo usada em ${transactionCount} transação(ões).`,
        },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete category error:", error)
    return NextResponse.json(
      { error: "Erro ao deletar categoria" },
      { status: 500 }
    )
  }
}
