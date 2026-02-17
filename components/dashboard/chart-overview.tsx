import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"
import { DashboardChart } from "./dashboard-chart"

async function getChartData(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 100,
  })

  const monthlyData = new Map<string, { income: number; expense: number }>()

  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    })

    if (!monthlyData.has(month)) {
      monthlyData.set(month, { income: 0, expense: 0 })
    }

    const data = monthlyData.get(month)!
    if (t.type === "income") {
      data.income += t.amount
    } else {
      data.expense += t.amount
    }
  })

  return Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      Receitas: data.income,
      Despesas: data.expense,
    }))
    .reverse()
    .slice(0, 6)
}

export async function ChartOverview({ userId }: { userId: string }) {
  let data = []
  try {
    data = await getChartData(userId)
  } catch (error) {
    console.warn("Gráfico temporariamente indisponível durante sincronização.")
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Visão Geral</CardTitle>
        <CardDescription>Receitas vs Despesas (últimos 6 meses)</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <DashboardChart data={data} />
      </CardContent>
    </Card>
  )
}
