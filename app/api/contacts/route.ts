import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  type: z.enum(["client", "provider", "both"]),
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const contacts = await prisma.contact.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { transactions: true }
        }
      }
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error("Get contacts error:", error)
    return NextResponse.json({ error: "Erro ao buscar contatos" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const data = contactSchema.parse(body)

    const contact = await prisma.contact.create({
      data: {
        ...data,
        email: data.email || null,
        phone: data.phone || null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error("Create contact error:", error)
    return NextResponse.json({ error: "Erro ao criar contato" }, { status: 500 })
  }
}
