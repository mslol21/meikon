import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Check } from "lucide-react"
import { CategoryForm } from "@/components/categories/category-form"
import { CategoryList } from "@/components/categories/category-list"
import { UpgradeButton } from "@/components/subscription/upgrade-button"

async function getSubscription(userId: string) {
  return await prisma.subscription.findUnique({
    where: { userId },
  })
}

async function getCategories(userId: string) {
  return await prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  })
}

export default async function ConfiguracoesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return <div>Não autorizado</div>
  }

  const [subscription, categories] = await Promise.all([
    getSubscription(session.user.id),
    getCategories(session.user.id),
  ])

  const isPro = subscription?.plan === "pro"

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie sua conta e assinatura
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Informações da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Nome</p>
              <p className="text-sm text-muted-foreground">{session?.user.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{session?.user.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle>Assinatura</CardTitle>
            <CardDescription>Plano atual e benefícios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Plano Atual</p>
                <p className="text-2xl font-bold">
                  {isPro ? "PRO" : "FREE"}
                </p>
              </div>
              {isPro && (
                <div className="rounded-full bg-primary p-2">
                  <Crown className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Status</p>
              <p className="text-sm text-muted-foreground capitalize">
                {subscription?.status || "Inativo"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Categorias Personalizadas</CardTitle>
              <CardDescription>
                Gerencie suas categorias de receitas e despesas
              </CardDescription>
            </div>
            <CategoryForm />
          </div>
        </CardHeader>
        <CardContent>
          <CategoryList categories={categories} />
        </CardContent>
      </Card>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Free Plan */}
        <Card className={!isPro ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle>Plano Free</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">R$ 0</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm">Até 50 transações/mês</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm">Relatórios básicos</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm">Categorias padrão</span>
              </li>
            </ul>
            {!isPro && (
              <p className="text-sm font-medium text-primary">Plano Atual</p>
            )}
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className={isPro ? "border-primary" : ""}>
          <CardHeader>
            <div className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              Mais Popular
            </div>
            <CardTitle>Plano PRO</CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">R$ 39</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm">Transações ilimitadas</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm">Importação de Extrato (OFX)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm">Gestão de Metas Mensais</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm">Exportação CSV</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm">14 dias grátis</span>
              </li>
            </ul>
            {isPro ? (
                <div>
                  <p className="text-sm font-medium text-primary mb-2">Plano Atual</p>
                  <UpgradeButton isPro variant="outline" />
                </div>
            ) : (
              <UpgradeButton />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
