"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Loader2 } from "lucide-react"
import { offlineStorage } from "@/lib/offline-storage"

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  category: string
  date: Date
  isPaid: boolean
  productId?: string | null
  quantity?: number | null
}

interface TransactionFormProps {
  transaction?: Transaction
  onSuccess?: () => void
}

const INCOME_CATEGORIES = [
  "Vendas de Produtos",
  "Prestação de Serviços",
  "Comissões",
  "Outras Receitas",
]

const EXPENSE_CATEGORIES = [
  "Aluguel",
  "Fornecedores",
  "Impostos (DAS MEI)",
  "Marketing",
  "Equipamentos",
  "Transporte",
  "Alimentação",
  "Outras Despesas",
]

export function TransactionForm({ transaction, onSuccess }: TransactionFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [type, setType] = useState<string>(transaction?.type || "income")
  const [category, setCategory] = useState<string>(transaction?.category || "")
  const [products, setProducts] = useState<any[]>([])

  const isEditing = !!transaction

  React.useEffect(() => {
    if (open) {
      const fetchProducts = async () => {
        try {
          const response = await fetch("/api/products")
          if (response.ok) {
            const data = await response.json()
            setProducts(data)
          }
        } catch (error) {
          console.error("Error fetching products:", error)
        }
      }
      fetchProducts()
    }
  }, [open])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      type: formData.get("type") as string,
      amount: parseFloat(formData.get("amount") as string),
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      date: new Date(formData.get("date") as string).toISOString(),
      isPaid: formData.get("isPaid") === "true",
      productId: formData.get("productId") === "none" ? null : formData.get("productId"),
      quantity: formData.get("quantity") ? parseInt(formData.get("quantity") as string) : null,
    }

    try {
      const url = isEditing
        ? `/api/transactions/${transaction.id}`
        : "/api/transactions"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao salvar transação")
      }

      toast({
        title: isEditing ? "Transação atualizada!" : "Transação criada!",
        description: isEditing
          ? "A transação foi atualizada com sucesso."
          : "A transação foi criada com sucesso.",
      })

      setOpen(false)
      router.refresh()
      onSuccess?.()
    } catch (error: any) {
      if (error instanceof TypeError && !navigator.onLine) {
        // Network error - likely offline
        const url = isEditing
          ? `/api/transactions/${transaction?.id}`
          : "/api/transactions"
        const method = isEditing ? "PUT" : "POST"
        
        offlineStorage.saveRequest(url, method, data)
        
        toast({
          title: "Modo Offline",
          description: "Sua transação foi salva localmente e será sincronizada assim que você estiver online.",
        })
        setOpen(false)
        onSuccess?.()
        return
      }

      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="sm">
            Editar
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Transação" : "Nova Transação"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Atualize os dados da transação"
                : "Adicione uma nova receita ou despesa"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                name="type"
                defaultValue={transaction?.type || "income"}
                onValueChange={setType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                defaultValue={transaction?.amount}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="Ex: Venda de produto"
                defaultValue={transaction?.description}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                name="category"
                defaultValue={transaction?.category}
                onValueChange={(value) => setCategory(value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {type === "income" && category === "Vendas de Produtos" && (
              <div className="grid gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="grid gap-2">
                  <Label htmlFor="productId">Produto do Inventário</Label>
                  <Select name="productId" defaultValue={transaction?.productId || undefined}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Selecione o produto para dar baixa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum (Venda avulsa)</SelectItem>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.stock} em estoque)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantidade Vendida</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    defaultValue={transaction?.quantity || 1}
                    disabled={isLoading}
                  />
                  <p className="text-[10px] text-muted-foreground italic">
                    Ao selecionar um produto, o estoque será atualizado automaticamente após salvar.
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={
                  transaction?.date
                    ? new Date(transaction.date).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
                max={new Date().toISOString().split("T")[0]}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="isPaid">Status de Pagamento</Label>
              <Select
                name="isPaid"
                defaultValue={
                  transaction?.isPaid !== undefined
                    ? String(transaction.isPaid)
                    : "true"
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Pago</SelectItem>
                  <SelectItem value="false">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
