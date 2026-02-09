import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ExportButton, ReportSummary } from "@/components/reports/export-button"
import { CategoryChart } from "@/components/reports/category-chart"
import { MonthlyChart } from "@/components/reports/monthly-chart"
import { ProjectedChart } from "@/components/reports/projected-chart"
import { formatCurrency } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

async function getTransactions(userId: string) {
  return await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  })
}

export default async function RelatoriosPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const transactions = await getTransactions(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Análise detalhada das suas finanças
          </p>
        </div>
        <ExportButton transactions={transactions} />
      </div>

      {/* Summary Cards */}
      <ReportSummary transactions={transactions} />

      {/* Monthly Evolution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyChart transactions={transactions} />
        <ProjectedChart transactions={transactions} />
      </div>

      {/* Category Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <CategoryChart transactions={transactions} type="income" />
        <CategoryChart transactions={transactions} type="expense" />
      </div>

      {/* Top Categories */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Top 5 Categorias de Receita
          </h3>
          <div className="space-y-3">
            {transactions
              .filter((t) => t.type === "income")
              .reduce((acc, t) => {
                const existing = acc.find((item) => item.category === t.category)
                if (existing) {
                  existing.total += t.amount
                  existing.count += 1
                } else {
                  acc.push({ category: t.category, total: t.amount, count: 1 })
                }
                return acc
              }, [] as { category: string; total: number; count: number }[])
              .sort((a, b) => b.total - a.total)
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-sm font-semibold text-success">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.count} transações
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                </div>
              ))}
            {transactions.filter((t) => t.type === "income").length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                Nenhuma receita registrada
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Top 5 Categorias de Despesa
          </h3>
          <div className="space-y-3">
            {transactions
              .filter((t) => t.type === "expense")
              .reduce((acc, t) => {
                const existing = acc.find((item) => item.category === t.category)
                if (existing) {
                  existing.total += t.amount
                  existing.count += 1
                } else {
                  acc.push({ category: t.category, total: t.amount, count: 1 })
                }
                return acc
              }, [] as { category: string; total: number; count: number }[])
              .sort((a, b) => b.total - a.total)
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-sm font-semibold text-destructive">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.count} transações
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-destructive">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                </div>
              ))}
            {transactions.filter((t) => t.type === "expense").length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                Nenhuma despesa registrada
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
