import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { InvoicingForm } from "@/components/invoicing/invoicing-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Link as LinkIcon, History } from "lucide-react"

async function getInvoicingData(userId: string) {
  try {
    const [contacts, transactions] = await Promise.all([
      prisma.contact.findMany({
        where: { userId },
        orderBy: { name: "asc" }
      }),
      prisma.transaction.findMany({
        where: { 
          userId,
          type: "income" 
        },
        orderBy: { date: "desc" },
        take: 5
      })
    ])
    
    return { contacts, recentIncomes: transactions }
  } catch (error) {
    console.error("Erro ao buscar dados de faturamento:", error)
    return { contacts: [], recentIncomes: [] }
  }
}

export default async function FaturamentoPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const { contacts, recentIncomes } = await getInvoicingData(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Faturamento</h1>
          <p className="text-muted-foreground">
            Emita notas fiscais e gerencie suas vendas
          </p>
        </div>
        <InvoicingForm contacts={contacts} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <LinkIcon className="h-5 w-5" />
              Links Úteis para MEI
            </CardTitle>
            <CardDescription>
              Acessos diretos aos portais oficiais do governo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <a 
              href="https://www.nfse.gov.br/EmissorNacional" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">Portal Nacional da NFS-e</p>
                <p className="text-xs text-muted-foreground">Emissor oficial de notas de serviço</p>
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </a>
            
            <a 
              href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">Portal do Empreendedor</p>
                <p className="text-xs text-muted-foreground">Serviços, alteração e baixa do MEI</p>
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              Pronto para faturar?
            </CardTitle>
            <CardDescription>
              Últimas receitas que podem precisar de nota
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIncomes.length === 0 ? (
                <p className="text-center py-4 text-sm text-muted-foreground">Nenhuma receita recente.</p>
              ) : (
                recentIncomes.map((income) => (
                  <div key={income.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{income.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(income.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="font-semibold text-success">
                      + R$ {income.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
