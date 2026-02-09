import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const goalSchema = z.object({
  targetAmount: z.number().positive(),
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const data = goalSchema.parse(body)

    const goal = await prisma.goal.upsert({
      where: {
        userId_month_year: {
          userId: session.user.id,
          month: data.month,
          year: data.year,
        },
      },
      update: {
        targetAmount: data.targetAmount,
      },
      create: {
        userId: session.user.id,
        month: data.month,
        year: data.year,
        targetAmount: data.targetAmount,
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      )
    }

    console.error("Save goal error:", error)
    return NextResponse.json(
      { error: "Erro ao salvar meta" },
      { status: 500 }
    )
  }
}
