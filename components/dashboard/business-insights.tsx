import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react"

interface BusinessInsightsProps {
  stats: {
    income: number
    expenses: number
    balance: number
  }
}

export function BusinessInsights({ stats }: BusinessInsightsProps) {
  const getInsights = () => {
    if (stats.income === 0 && stats.expenses === 0) {
      return {
        title: "Comece sua jornada",
        description: "Adicione sua primeira receita para ver como está o desempenho do seu MEI.",
        icon: Sparkles,
        color: "text-primary"
      }
    }

    if (stats.balance > 0) {
      return {
        title: "Saldo Positivo!",
        description: "Seu negócio está crescendo. Considere investir em melhorias ou reservar para impostos.",
        icon: TrendingUp,
        color: "text-success"
      }
    }

    return {
      title: "Atenção ao Saldo",
      description: "Suas despesas superaram as receitas. Revise seus custos para manter a saúde financeira.",
      icon: AlertCircle,
      color: "text-destructive"
    }
  }

  const insight = getInsights()

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <insight.icon className={`h-4 w-4 ${insight.color}`} />
          Status do Negócio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="font-bold text-sm leading-none">{insight.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {insight.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
