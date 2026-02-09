"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { formatCurrency, formatCompactNumber } from "@/lib/utils"

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  category: string
  date: Date
  isPaid: boolean
}

interface MonthlyChartProps {
  transactions: Transaction[]
}

export function MonthlyChart({ transactions }: MonthlyChartProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const monthlyData = new Map<
    string,
    { income: number; expense: number; balance: number }
  >()

  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    })

    if (!monthlyData.has(month)) {
      monthlyData.set(month, { income: 0, expense: 0, balance: 0 })
    }

    const data = monthlyData.get(month)!
    if (t.type === "income") {
      data.income += t.amount
    } else {
      data.expense += t.amount
    }
    data.balance = data.income - data.expense
  })

  const chartData = Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      Receitas: data.income,
      Despesas: data.expense,
      Saldo: data.balance,
    }))
    .reverse()
    .slice(0, 12)

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução Mensal</CardTitle>
          <CardDescription>Últimos 12 meses</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </CardContent>
      </Card>
    )
  }

  if (!isMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução Mensal</CardTitle>
          <CardDescription>Últimos 12 meses</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Mensal</CardTitle>
        <CardDescription>Últimos 12 meses</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `R$ ${formatCompactNumber(v)}`} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Receitas"
              stroke="hsl(var(--success))"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Despesas"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Saldo"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
