"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  category: string
  date: Date
  isPaid: boolean
}

interface ExportButtonProps {
  transactions: Transaction[]
}

export function ExportButton({ transactions }: ExportButtonProps) {
  function exportToCSV() {
    const headers = ["Data", "Tipo", "Descrição", "Categoria", "Valor", "Status"]
    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString("pt-BR"),
      t.type === "income" ? "Receita" : "Despesa",
      t.description,
      t.category,
      t.amount.toFixed(2),
      t.isPaid ? "Pago" : "Pendente",
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `transacoes-${new Date().toISOString().split("T")[0]}.csv`
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button onClick={exportToCSV} variant="outline" className="gap-2">
      <Download className="h-4 w-4" />
      Exportar CSV
    </Button>
  )
}

interface ReportSummaryProps {
  transactions: Transaction[]
}

export function ReportSummary({ transactions }: ReportSummaryProps) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // Mês Atual
  const currentMonthIncome = transactions
    .filter((t) => t.type === "income" && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
    .reduce((sum, t) => sum + t.amount, 0)

  // Mês Anterior
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
  const lastMonthIncome = transactions
    .filter((t) => t.type === "income" && new Date(t.date).getMonth() === lastMonth && new Date(t.date).getFullYear() === lastMonthYear)
    .reduce((sum, t) => sum + t.amount, 0)

  // Receita Média (Total / Meses com transações)
  const monthsWithTransactions = new Set(transactions.map(t => {
    const d = new Date(t.date)
    return `${d.getMonth()}-${d.getFullYear()}`
  })).size || 1
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const avgIncome = totalIncome / monthsWithTransactions

  // Projeção Anual (Média * 12)
  const projectedYearly = avgIncome * 12

  const incomeChange = lastMonthIncome === 0 ? 0 : ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-success/20 bg-success/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Mês vs. Anterior</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {formatCurrency(currentMonthIncome)}
          </div>
          <div className={`text-[10px] font-bold mt-1 inline-flex items-center px-1.5 py-0.5 rounded-full ${incomeChange >= 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
            {incomeChange >= 0 ? "+" : ""}{incomeChange % 1 === 0 ? incomeChange.toFixed(0) : incomeChange.toFixed(1)}% vs. mês ant.
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Receita Média</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(avgIncome)}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase font-medium">baseado em {monthsWithTransactions} meses</p>
        </CardContent>
      </Card>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Projeção Anual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">
            {formatCurrency(projectedYearly)}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase font-medium">estimativa para 12 meses</p>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Top Despesas</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="space-y-1">
              {transactions
                .filter(t => t.type === "expense")
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 2)
                .map(t => (
                  <div key={t.id} className="flex justify-between items-center text-[10px]">
                    <span className="truncate max-w-[80px] font-medium">{t.description}</span>
                    <span className="font-bold text-destructive">{formatCurrency(t.amount)}</span>
                  </div>
                ))}
              {transactions.filter(t => t.type === "expense").length === 0 && (
                <p className="text-[10px] text-muted-foreground italic">Nenhuma despesa</p>
              )}
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
