import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

interface StatsCardsProps {
  stats: {
    income: number
    expenses: number
    balance: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="shadow-sm border-success/20 bg-success/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Receitas</CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-success">
            {formatCurrency(stats.income)}
          </div>
          <p className="text-[10px] text-muted-foreground font-medium uppercase mt-1">Total de entradas</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-destructive/20 bg-destructive/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Despesas</CardTitle>
          <TrendingDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-destructive">
            {formatCurrency(stats.expenses)}
          </div>
          <p className="text-[10px] text-muted-foreground font-medium uppercase mt-1">Total de saídas</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Saldo</CardTitle>
          <Wallet className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl font-bold ${
              stats.balance >= 0 ? "text-primary" : "text-destructive"
            }`}
          >
            {formatCurrency(stats.balance)}
          </div>
          <p className="text-[10px] text-muted-foreground font-medium uppercase mt-1">Receitas - Despesas</p>
        </CardContent>
      </Card>
    </div>
  )
}
