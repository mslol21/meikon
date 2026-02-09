"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface GoalWidgetProps {
  currentMonthlyIncome: number
  goals: any[]
}

export function GoalWidget({ currentMonthlyIncome, goals }: GoalWidgetProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  
  const currentGoal = goals.find((g: any) => g.month === currentMonth && g.year === currentYear)
  const targetAmount = currentGoal?.targetAmount || 0
  
  const progress = targetAmount > 0 ? (currentMonthlyIncome / targetAmount) * 100 : 0
  const isGoalReached = progress >= 100

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      targetAmount: parseFloat(formData.get("targetAmount") as string),
      month: currentMonth,
      year: currentYear,
    }

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Erro ao salvar meta")

      toast({
        title: "Meta atualizada!",
        description: "Sua meta mensal foi salva com sucesso.",
      })
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar a meta.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-xl">Meta Mensal</CardTitle>
          <CardDescription>Receita esperada para este mês</CardDescription>
        </div>
        <Target className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {targetAmount > 0 ? (
          <div className="w-full space-y-6 flex flex-col items-center">
            {/* Circular Progress Gauge */}
            <div className="relative h-32 w-32">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-muted stroke-current"
                  strokeWidth="8"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary stroke-current transition-all duration-1000 ease-in-out"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * Math.min(progress, 100)) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold">{progress.toFixed(0)}%</span>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Metas</span>
              </div>
            </div>

            <div className="w-full space-y-1 text-center">
              <p className="text-2xl font-bold">{formatCurrency(currentMonthlyIncome)}</p>
              <p className="text-xs text-muted-foreground">
                sua meta: {formatCurrency(targetAmount)}
              </p>
            </div>
            
            {isGoalReached ? (
              <div className="flex items-center gap-2 text-xs text-success font-medium bg-success/10 px-3 py-1 rounded-full">
                <TrendingUp className="h-3 w-3" />
                Meta atingida! Parabéns!
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Faltam <span className="font-semibold text-foreground">{formatCurrency(targetAmount - currentMonthlyIncome)}</span>
                </p>
              </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Ajustar Meta
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={onSubmit}>
                  <DialogHeader>
                    <DialogTitle>Ajustar Meta Mensal</DialogTitle>
                    <DialogDescription>
                      Quanto você pretende faturar em {new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date())}?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="targetAmount">Valor da Meta (R$)</Label>
                    <Input
                      id="targetAmount"
                      name="targetAmount"
                      type="number"
                      step="0.01"
                      defaultValue={targetAmount}
                      required
                      placeholder="Ex: 5000.00"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Salvar Meta
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Nenhuma meta definida</p>
              <p className="text-xs text-muted-foreground">
                Defina uma meta de faturamento para acompanhar seu progresso.
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">Definir Meta</Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={onSubmit}>
                  <DialogHeader>
                    <DialogTitle>Definir Meta Mensal</DialogTitle>
                    <DialogDescription>
                      Quanto você pretende faturar este mês?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="targetAmount">Valor da Meta (R$)</Label>
                    <Input
                      id="targetAmount"
                      name="targetAmount"
                      type="number"
                      step="0.01"
                      required
                      placeholder="Ex: 5000.00"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Criar Meta
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
