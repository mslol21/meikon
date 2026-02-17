import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { TransactionForm } from "@/components/transactions/transaction-form"
import { OFXImport } from "@/components/transactions/ofx-import"
import { TransactionList } from "@/components/transactions/transaction-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

async function getTransactions(userId: string) {
  const [transactions, count, subscription] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: {
        product: {
          select: {
            name: true,
            unit: true
          }
        }
      }
    }),
    prisma.transaction.count({ where: { userId } }),
    prisma.subscription.findUnique({ where: { userId } }),
  ])

  return { transactions, count, subscription }
}

export default async function TransacoesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const { transactions, count, subscription } = await getTransactions(
    session.user.id
  )

  const isFreePlan = subscription?.plan === "free"
  const limitReached = isFreePlan && count >= 50

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie suas receitas e despesas
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <OFXImport />
          <TransactionForm />
        </div>
      </div>

      {/* Limit Warning */}
      {isFreePlan && (
        <Card
          className={
            limitReached
              ? "border-destructive bg-destructive/10"
              : count >= 15
              ? "border-primary/50 bg-primary/5"
              : ""
          }
        >
          <CardHeader>
            <CardTitle>
              {limitReached ? "Limite Atingido" : "Plano Free"}
            </CardTitle>
            <CardDescription>
              {limitReached
                ? "Você atingiu o limite de 50 transações. Faça upgrade para continuar."
                : `Você usou ${count} de 50 transações disponíveis.`}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total de Transações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {transactions.filter((t) => t.type === "income").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {transactions.filter((t) => t.type === "expense").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <TransactionList
        initialTransactions={transactions}
        totalCount={count}
      />
    </div>
  )
}
