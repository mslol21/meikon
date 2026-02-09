import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const userId = session.user.id

  // Check subscription for export feature
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  if (subscription?.plan !== "pro") {
    return NextResponse.json(
      { error: "A exportação é uma funcionalidade exclusiva do plano PRO." },
      { status: 403 }
    )
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  })

  // Basic CSV generation
  const headers = ["ID", "Tipo", "Descricao", "Valor", "Categoria", "Data", "Pago"]
  const rows = transactions.map((t) => [
    t.id,
    t.type === "income" ? "Receita" : "Despesa",
    t.description.replace(/,/g, " "), // Remove commas to avoid CSV break
    t.amount.toString(),
    t.category,
    t.date.toISOString().split("T")[0],
    t.isPaid ? "Sim" : "Nao",
  ])

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=transacoes-MEIKon-${new Date().toISOString().split("T")[0]}.csv`,
    },
  })
}
