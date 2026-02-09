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
  date: Date
  isPaid: boolean
}

interface ProjectedChartProps {
  transactions: Transaction[]
}

export function ProjectedChart({ transactions }: ProjectedChartProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  // Processar dados para os últimos 6 meses + 3 meses de projeção
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const monthlyTotals = new Array(9).fill(0).map((_, i) => {
    const d = new Date(currentYear, currentMonth - 5 + i, 1)
    return {
      month: d.toLocaleDateString("pt-BR", { month: "short" }),
      timestamp: d.getTime(),
      balance: 0,
      isProjected: i > 5,
    }
  })

  // Preencher meses reais
  transactions.forEach((t) => {
    const tDate = new Date(t.date)
    const monthIndex = 5 - (currentMonth - tDate.getMonth() + (currentYear - tDate.getFullYear()) * 12)
    
    if (monthIndex >= 0 && monthIndex <= 5) {
      const amount = t.type === "income" ? t.amount : -t.amount
      monthlyTotals[monthIndex].balance += amount
    }
  })

  // Calcular média dos últimos 6 meses para projeção
  const recentMonths = monthlyTotals.slice(0, 6)
  const averageBalance = recentMonths.reduce((sum, m) => sum + m.balance, 0) / 6

  // Preencher meses projetados
  for (let i = 6; i < 9; i++) {
    monthlyTotals[i].balance = averageBalance
  }

  const chartData = monthlyTotals.map(d => ({
    name: d.month,
    "Saldo Real": d.isProjected ? null : d.balance,
    "Saldo Projetado": d.balance,
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Projeção de Fluxo de Caixa</CardTitle>
        <CardDescription>
          Tendência financeira baseada na sua média histórica de faturamento
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => `R$ ${formatCompactNumber(value)}`}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Saldo Real"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Saldo Projetado"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
