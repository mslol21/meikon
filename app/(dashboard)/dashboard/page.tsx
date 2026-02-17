import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ChartOverview } from "@/components/dashboard/chart-overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UpgradeButton } from "@/components/subscription/upgrade-button"
import { GoalWidget } from "@/components/dashboard/goal-widget"

async function getDashboardData(userId: string) {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const [transactions, subscription, goals, transactionCount, dasPayment] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 10,
    }),
    prisma.subscription.findUnique({
      where: { userId },
    }),
    prisma.goal.findMany({
      where: { 
        userId,
        year: currentYear
      },
      orderBy: { month: "desc" }
    }),
    prisma.transaction.count({ where: { userId } }),
    prisma.transaction.findFirst({
      where: {
        userId,
        category: "Impostos (DAS MEI)",
        date: {
          gte: new Date(currentYear, currentMonth - 1, 1),
          lt: new Date(currentYear, currentMonth, 1),
        }
      }
    })
  ])

  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: { userId },
      orderBy: { stock: "asc" },
      take: 50
    })
  } catch (error) {
    console.warn("Módulo de inventário ainda não sincronizado no banco de dados.")
  }

  // Filtrar produtos com estoque baixo em memória (Prisma não suporta comparação de colunas direta no where)
  const lowStockProducts = products ? products.filter((p: any) => p.stock <= p.minStock).slice(0, 3) : []

  // Todas as transações do mês atual para calcular o atingimento da meta
  const monthTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: new Date(currentYear, currentMonth - 1, 1),
        lt: new Date(currentYear, currentMonth, 1),
      },
    },
  })

  const currentMonthIncome = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  // Calcule o faturamento anual do ano atual
  const yearlyIncome = await prisma.transaction.aggregate({
    where: {
      userId,
      type: "income",
      date: {
        gte: new Date(currentYear, 0, 1),
        lt: new Date(currentYear + 1, 0, 1),
      }
    },
    _sum: { amount: true }
  }).then(res => res._sum.amount || 0)

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expenses

  return {
    stats: { income, expenses, balance },
    transactions,
    subscription,
    goals,
    currentMonthIncome,
    yearlyIncome,
    transactionCount,
    isDasPaid: !!dasPayment,
    isGoalSet: !!goals.find(g => g.month === currentMonth && g.year === currentYear),
    lowStockProducts: lowStockProducts,
  }
}

import { QuickActions } from "@/components/dashboard/quick-actions"
import { BusinessInsights } from "@/components/dashboard/business-insights"
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist"
import { GovHub } from "@/components/dashboard/gov-hub"
import { MobileFloatingActions } from "@/components/dashboard/mobile-floating-actions"
import { formatCurrency, cn } from "@/lib/utils"
import { AlertTriangle, Crown, Package, ArrowRight } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const data = await getDashboardData(session.user.id)

  const isFreePlan = data.subscription?.plan === "free"
  const limitReached = isFreePlan && data.transactionCount >= 50

  const meiLimit = 81000
  const meiUsagePercent = (data.yearlyIncome / meiLimit) * 100
  const isMeiLimitCritical = meiUsagePercent >= 80

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Olá, {session.user.name?.split(" ")[0]}! 👋</h1>
          <p className="text-muted-foreground text-sm">
            Aqui está o que está acontecendo com seu negócio hoje.
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Alerta de Limite MEI */}
      {data.yearlyIncome > 0 && (
        <Card className={cn(
          "border-l-4",
          isMeiLimitCritical ? "border-l-destructive bg-destructive/5" : "border-l-primary bg-primary/5"
        )}>
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full", isMeiLimitCritical ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">Faturamento Anual MEI</CardTitle>
                  <CardDescription className="text-xs">
                    Você utilizou <strong>{meiUsagePercent % 1 === 0 ? meiUsagePercent.toFixed(0) : meiUsagePercent.toFixed(1)}%</strong> do limite anual (R$ 81.000)
                  </CardDescription>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{formatCurrency(data.yearlyIncome)}</p>
                <p className="text-[10px] text-muted-foreground uppercase">acumulado no ano</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Alerta de Estoque Baixo */}
      {data.lowStockProducts.length > 0 && (
        <Card className="border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10">
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">Reposição Necessária</CardTitle>
                  <CardDescription className="text-xs">
                    Você tem <strong>{data.lowStockProducts.length}</strong> {data.lowStockProducts.length === 1 ? 'produto' : 'produtos'} com estoque baixo.
                  </CardDescription>
                </div>
              </div>
              <Link href="/inventario">
                <Button variant="ghost" size="sm" className="text-xs gap-2">
                  Gerenciar Estoque
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      )}

      {limitReached && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">
              Limite de Transações Atingido
            </CardTitle>
            <CardDescription>
              Você atingiu o limite de 50 transações do plano gratuito. Faça
              upgrade para o plano PRO para transações ilimitadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-[200px]">
              <UpgradeButton />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3 space-y-6">
          <StatsCards stats={data.stats} />
          
          <div className="grid gap-6 md:grid-cols-3">
             <div className="md:col-span-2 space-y-6">
                <ChartOverview userId={session!.user.id} />
                <GovHub />
             </div>
             <div className="md:col-span-1 space-y-6">
                <OnboardingChecklist stats={data.stats} isGoalSet={data.isGoalSet} isDasPaid={data.isDasPaid} />
                <BusinessInsights stats={data.stats} />
                
                <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
                  <div className="absolute right-0 top-0 p-4 opacity-20">
                    <Crown className="h-12 w-12" />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider">Planos & Benefícios</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 relative z-10">
                    <p className="text-xs leading-relaxed opacity-90">
                      Importe seu extrato bancário em segundos com o <strong>Plano PRO</strong>.
                    </p>
                    <Link href="/configuracoes">
                      <Button variant="secondary" size="sm" className="w-full text-xs font-bold">
                        Ver Opções de Upgrade
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
             </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="sticky top-6 space-y-6">
            <GoalWidget currentMonthlyIncome={data.currentMonthIncome} goals={data.goals} />
            <RecentTransactions transactions={data.transactions} />
          </div>
        </div>
      </div>
      <MobileFloatingActions />
    </div>
  )
}
