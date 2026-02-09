"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { formatCurrency, formatCompactNumber } from "@/lib/utils"

interface DashboardChartProps {
  data: {
    month: string
    Receitas: number
    Despesas: number
  }[]
}

export function DashboardChart({ data }: DashboardChartProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-full w-full flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(v) => `R$ ${formatCompactNumber(v)}`} />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
        />
        <Legend />
        <Bar dataKey="Receitas" fill="hsl(var(--success))" />
        <Bar dataKey="Despesas" fill="hsl(var(--destructive))" />
      </BarChart>
    </ResponsiveContainer>
  )
}
