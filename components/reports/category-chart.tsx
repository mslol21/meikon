"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
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

interface CategoryChartProps {
  transactions: Transaction[]
  type: "income" | "expense"
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--destructive))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#a4de6c",
]

export function CategoryChart({ transactions, type }: CategoryChartProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const filteredTransactions = transactions.filter((t) => t.type === type)

  const categoryData = filteredTransactions.reduce((acc, t) => {
    const existing = acc.find((item) => item.name === t.category)
    if (existing) {
      existing.value += t.amount
    } else {
      acc.push({ name: t.category, value: t.amount })
    }
    return acc
  }, [] as { name: string; value: number }[])

  const sortedData = categoryData.sort((a, b) => b.value - a.value)

  if (sortedData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {type === "income" ? "Receitas" : "Despesas"} por Categoria
          </CardTitle>
          <CardDescription>Distribuição por categoria</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        </CardContent>
      </Card>
    )
  }

  if (!isMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {type === "income" ? "Receitas" : "Despesas"} por Categoria
          </CardTitle>
          <CardDescription>Distribuição por categoria</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type === "income" ? "Receitas" : "Despesas"} por Categoria
        </CardTitle>
        <CardDescription>Distribuição por categoria</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sortedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {sortedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
