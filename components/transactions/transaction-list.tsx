"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TransactionForm } from "./transaction-form"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  category: string
  date: Date
  isPaid: boolean
}

interface TransactionListProps {
  initialTransactions: Transaction[]
  totalCount: number
}

const ITEMS_PER_PAGE = 10

export function TransactionList({
  initialTransactions,
  totalCount,
}: TransactionListProps) {
  const [isMounted, setIsMounted] = React.useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [transactions, setTransactions] = React.useState(initialTransactions || [])

  React.useEffect(() => {
    setIsMounted(true)
  }, [])
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [transactionToDelete, setTransactionToDelete] = React.useState<string | null>(
    null
  )
  const [currentPage, setCurrentPage] = React.useState(1)
  const [filters, setFilters] = React.useState({
    type: "all",
    category: "all",
    isPaid: "all",
    startDate: "",
    endDate: "",
  })

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  async function handleDelete(id: string) {
    setIsDeleting(id)

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao deletar transação")
      }

      toast({
        title: "Transação deletada!",
        description: "A transação foi removida com sucesso.",
      })

      setTransactions(transactions.filter((t) => t.id !== id))
      setDeleteDialogOpen(false)
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      })
    } finally {
      setIsDeleting(null)
      setTransactionToDelete(null)
    }
  }

  function openDeleteDialog(id: string) {
    setTransactionToDelete(id)
    setDeleteDialogOpen(true)
  }

  const filteredTransactions = transactions.filter((transaction) => {
    if (filters.type !== "all" && transaction.type !== filters.type) return false
    if (filters.category !== "all" && transaction.category !== filters.category)
      return false
    if (
      filters.isPaid !== "all" &&
      transaction.isPaid !== (filters.isPaid === "true")
    )
      return false
    if (
      filters.startDate &&
      new Date(transaction.date) < new Date(filters.startDate)
    )
      return false
    if (
      filters.endDate &&
      new Date(transaction.date) > new Date(filters.endDate)
    )
      return false
    return true
  })

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-5">
        <div>
          <Label>Tipo</Label>
          <Select
            value={filters.type}
            onValueChange={(value) =>
              setFilters({ ...filters, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Status</Label>
          <Select
            value={filters.isPaid}
            onValueChange={(value) =>
              setFilters({ ...filters, isPaid: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Pago</SelectItem>
              <SelectItem value="false">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Data Inicial</Label>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Data Final</Label>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
        </div>

        <div className="flex items-end gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setFilters({
                type: "all",
                category: "all",
                isPaid: "all",
                startDate: "",
                endDate: "",
              })
            }
            className="flex-1"
          >
            Limpar
          </Button>
          <Button
            variant="secondary"
            className="gap-2"
            onClick={async () => {
              try {
                const response = await fetch("/api/transactions/export")
                if (!response.ok) {
                  const data = await response.json()
                  throw new Error(data.error || "Erro ao exportar")
                }
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `transacoes-${new Date().toISOString().split("T")[0]}.csv`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
              } catch (error: any) {
                toast({
                  variant: "destructive",
                  title: "Erro ao exportar",
                  description: error.message,
                })
              }
            }}
          >
            <Download className="h-4 w-4" />
            CSV
          </Button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="rounded-lg border">
        {paginatedTransactions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Nenhuma transação encontrada
          </div>
        ) : (
          <div className="divide-y">
            {paginatedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-full p-2 ${
                      transaction.type === "income"
                        ? "bg-success/10"
                        : "bg-destructive/10"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="h-5 w-5 text-success" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{formatDate(transaction.date)}</span>
                      <span>•</span>
                      <Badge
                        variant={transaction.isPaid ? "success" : "secondary"}
                      >
                        {transaction.isPaid ? "Pago" : "Pendente"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`text-lg font-semibold ${
                      transaction.type === "income"
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className="flex items-center gap-2">
                    <TransactionForm
                      transaction={transaction}
                      onSuccess={() => router.refresh()}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(transaction.id)}
                      disabled={isDeleting === transaction.id}
                    >
                      {isDeleting === transaction.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredTransactions.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)}{" "}
            de {filteredTransactions.length} transações
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <div className="text-sm">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar esta transação? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setTransactionToDelete(null)
              }}
              disabled={!!isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                transactionToDelete && handleDelete(transactionToDelete)
              }
              disabled={!!isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
