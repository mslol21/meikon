import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  ExternalLink,
  Info,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"

async function getFiscalData(userId: string) {
  const currentYear = new Date().getFullYear()
  
  const [user, transactions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { yearlyLimit: true }
    }),
    prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(currentYear, 0, 1),
          lte: new Date(currentYear, 11, 31)
        }
      }
    })
  ])

  const yearlyIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  // DAS Tracking: Verificamos se há uma despesa na categoria "Impostos (DAS MEI)" para cada mês
  const dasPayments = Array.from({ length: 12 }, (_, i) => {
    const month = i
    const hasPayment = transactions.some(t => {
      const tDate = new Date(t.date)
      return tDate.getMonth() === month && 
             t.type === "expense" && 
             t.category === "Impostos (DAS MEI)"
    })
    return { month, paid: hasPayment }
  })

  return {
    yearlyLimit: user?.yearlyLimit || 81000,
    yearlyIncome,
    dasPayments,
    currentYear
  }
}

export default async function FiscalPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const data = await getFiscalData(session.user.id)
  
  const limitProgress = (data.yearlyIncome / data.yearlyLimit) * 100
  const isNearLimit = limitProgress >= 80
  const isOverLimit = limitProgress >= 100

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading">Hub Fiscal (MEI)</h1>
        <p className="text-muted-foreground">
          Monitore seu limite de faturamento e obrigações fiscais
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Limite de Faturamento */}
        <Card className={isOverLimit ? "border-destructive" : isNearLimit ? "border-warning" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Limite Anual MEI ({data.currentYear})
            </CardTitle>
            <CardDescription>
              Acompanhe quanto você já faturou em relação ao limite de {formatCurrency(data.yearlyLimit)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Faturamento Total</span>
                <span className="font-bold">{formatCurrency(data.yearlyIncome)}</span>
              </div>
              <Progress value={limitProgress} className={`h-3 ${isOverLimit ? "bg-destructive/20" : ""}`} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>{limitProgress.toFixed(1)}% utilizado</span>
                <span>100%</span>
              </div>
            </div>

            {isOverLimit ? (
              <div className="bg-destructive/10 p-4 rounded-lg flex gap-3 border border-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                <div className="text-sm">
                  <p className="font-bold text-destructive">Limite Ultrapassado!</p>
                  <p className="text-destructive/80">Você excedeu o limite do MEI. Procure um contador para realizar o desenquadramento.</p>
                </div>
              </div>
            ) : isNearLimit ? (
              <div className="bg-warning/10 p-4 rounded-lg flex gap-3 border border-warning/20">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                <div className="text-sm">
                  <p className="font-bold text-warning">Atenção!</p>
                  <p className="text-warning/80">Você atingiu {limitProgress.toFixed(0)}% do seu limite anual. Planeje seus próximos meses.</p>
                </div>
              </div>
            ) : (
              <div className="bg-success/10 p-4 rounded-lg flex gap-3 border border-success/20">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                <div className="text-sm text-success-foreground">
                  Você está dentro do limite seguro para o ano de {data.currentYear}.
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guia DAS */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Controle de DAS
              </CardTitle>
              <CardDescription>
                Pagamentos identificados em {data.currentYear}
              </CardDescription>
            </div>
            {data.dasPayments[new Date().getMonth()].paid ? (
              <Badge variant="success">Regular</Badge>
            ) : (
              <Badge variant="destructive">Pendente</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {data.dasPayments.map((p, i) => (
                <div 
                  key={i} 
                  className={`p-2 rounded border text-center text-xs flex flex-col items-center gap-1 ${
                    p.paid ? "bg-success/5 border-success/20" : "bg-muted/50 border-muted"
                  }`}
                >
                  <span className="font-medium text-muted-foreground">{monthNames[i].substring(0, 3)}</span>
                  {p.paid ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground/30" />
                  )}
                </div>
              ))}
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg mb-6 border border-primary/10">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Próximo Vencimento:</span>
                <span className="font-bold">20/{String(new Date().getMonth() + 1).padStart(2, '0')}/{new Date().getFullYear()}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Lembre-se de pagar o DAS até o dia 20 de cada mês para manter seus benefícios previdenciários.
              </p>
            </div>

            <div className="pt-6 border-t space-y-4">
              <p className="text-xs text-muted-foreground flex gap-2">
                <Info className="h-4 w-4 shrink-0" />
                O MEIKon detecta automaticamente o pagamento se existir uma despesa na categoria &quot;Impostos (DAS MEI)&quot;.
              </p>
              <Button variant="outline" className="w-full gap-2 border-primary/20 hover:bg-primary/5" asChild>
                <a href="https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao" target="_blank" rel="noopener noreferrer">
                  Emitir Guia DAS Oficial
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
