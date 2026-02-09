"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
import { FileUp, Loader2, Check, AlertCircle } from "lucide-react"
import { parseOFX, OFXTransaction } from "@/lib/ofx-parser"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CATEGORIES = {
  income: [
    "Vendas de Produtos",
    "Prestação de Serviços",
    "Comissões",
    "Outras Receitas",
  ],
  expense: [
    "Aluguel",
    "Fornecedores",
    "Impostos (DAS MEI)",
    "Marketing",
    "Equipamentos",
    "Transporte",
    "Alimentação",
    "Outras Despesas",
  ],
}

export function OFXImport() {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<(OFXTransaction & { category: string })[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      try {
        const parsed = parseOFX(content)
        // Adicionar categoria padrão com base no tipo
        const enriched = parsed.map(t => ({
          ...t,
          category: t.type === "income" ? CATEGORIES.income[0] : CATEGORIES.expense[0]
        }))
        setTransactions(enriched)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao importar",
          description: "O arquivo OFX parece ser inválido.",
        })
      }
    }
    reader.readAsText(file)
  }

  const handleSaveAll = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/transactions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactions.map(t => ({
          ...t,
          date: t.date.toISOString(),
          isPaid: true
        })))
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao salvar transações")
      }

      toast({
        title: "Importação concluída!",
        description: `${transactions.length} transações foram importadas com sucesso.`,
      })
      setOpen(false)
      setTransactions([])
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateCategory = (index: number, category: string) => {
    const newTransactions = [...transactions]
    newTransactions[index].category = category
    setTransactions(newTransactions)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileUp className="h-4 w-4" />
          Importar OFX
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Importar do Extrato (OFX)</DialogTitle>
          <DialogDescription>
            Arraste seu arquivo OFX para importar múltiplas transações de uma vez.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {transactions.length === 0 ? (
            <div 
              className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileUp className="h-12 w-12 mb-4" />
              <p>Clique ou arraste o arquivo .ofx aqui</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".ofx" 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-medium border-b pb-2 px-2">
                <span>Transação</span>
                <span className="flex gap-12">
                  <span className="w-32">Categoria</span>
                  <span className="w-24 text-right">Valor</span>
                </span>
              </div>
              <div className="divide-y">
                {transactions.map((t, i) => (
                  <div key={i} className="py-3 px-2 flex items-center justify-between hover:bg-muted/30">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium truncate max-w-[250px]">{t.description}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(t.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Select 
                        value={t.category} 
                        onValueChange={(val) => updateCategory(i, val)}
                      >
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(t.type === "income" ? CATEGORIES.income : CATEGORIES.expense).map(cat => (
                            <SelectItem key={cat} value={cat} className="text-xs">{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div className={`w-24 text-right font-semibold ${t.type === "income" ? "text-success" : "text-destructive"}`}>
                        {t.type === "income" ? "+" : "-"} {formatCurrency(t.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4">
          <Button 
            variant="ghost" 
            onClick={() => {
              setTransactions([])
              if (fileInputRef.current) fileInputRef.current.value = ""
            }}
            disabled={isLoading || transactions.length === 0}
          >
            Limpar
          </Button>
          <Button 
            onClick={handleSaveAll} 
            disabled={isLoading || transactions.length === 0}
            className="gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Salvar {transactions.length} Transações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
