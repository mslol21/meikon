import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  price: z.number().nonnegative("Preço deve ser positivo"),
  costPrice: z.number().nonnegative().optional().nullable(),
  stock: z.number().int().default(0),
  minStock: z.number().int().default(0),
  unit: z.string().default("un"),
  categoryId: z.string().optional().nullable(),
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
    const data = productSchema.parse(body)

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product || product.userId !== session.user.id) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...data,
      },
      include: {
        category: true,
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Update product error:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
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

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product || product.userId !== session.user.id) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Produto excluído com sucesso" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json(
      { error: "Erro ao excluir produto" },
      { status: 500 }
    )
  }
}
