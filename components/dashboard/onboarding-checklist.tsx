"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, MessageSquareText } from "lucide-react"

interface OnboardingChecklistProps {
  stats: {
    income: number
    expenses: number
  }
  isGoalSet: boolean
  isDasPaid: boolean
}

export function OnboardingChecklist({ stats, isGoalSet, isDasPaid }: OnboardingChecklistProps) {
  const steps = [
    {
      id: "income",
      label: "Adicionar primeira receita",
      completed: stats.income > 0,
    },
    {
      id: "expense",
      label: "Adicionar primeira despesa",
      completed: stats.expenses > 0,
    },
    {
      id: "goal",
      label: "Definir meta mensal",
      completed: isGoalSet,
    },
    {
      id: "das",
      label: "Conferir DAS do mês",
      completed: isDasPaid,
    }
  ]

  const completedCount = steps.filter(s => s.completed).length
  const progressPercent = (completedCount / steps.length) * 100

  if (progressPercent === 100) return null

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-primary" />
            Primeiros Passos
          </CardTitle>
          <span className="text-xs font-medium text-primary">{progressPercent.toFixed(0)}% completo</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3 text-sm">
              {step.completed ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={step.completed ? "text-muted-foreground line-through" : "font-medium"}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
