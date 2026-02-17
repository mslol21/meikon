"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
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
import { ProductForm } from "./product-form"
import { useToast } from "@/hooks/use-toast"
import {
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertTriangle,
  Search,
  Filter
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Category {
  id: string
  name: string
  color: string
}

interface Product {
  id: string
  name: string
  sku?: string
  price: number
  stock: number
  minStock: number
  unit: string
  categoryId?: string
  category?: Category
}

interface ProductListProps {
  initialProducts: Product[]
}

const ITEMS_PER_PAGE = 10

export function ProductList({ initialProducts }: ProductListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = React.useState(initialProducts || [])
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [productToDelete, setProductToDelete] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [search, setSearch] = React.useState("")

  const filteredProducts = products.filter((product) => {
    const searchLower = search.toLowerCase()
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.sku?.toLowerCase().includes(searchLower) ||
      product.category?.name.toLowerCase().includes(searchLower)
    )
  })

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  async function handleDelete(id: string) {
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir produto")
      }

      toast({
        title: "Produto excluído!",
        description: "O produto foi removido com sucesso.",
      })

      setProducts(products.filter((p) => p.id !== id))
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
      setProductToDelete(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou SKU..."
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <ProductForm onSuccess={() => router.refresh()} />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        {paginatedProducts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
            <Package className="h-12 w-12 opacity-20" />
            <p>Nenhum produto encontrado no seu inventário</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 font-semibold text-muted-foreground">Produto</th>
                  <th className="p-4 font-semibold text-muted-foreground">Preço</th>
                  <th className="p-4 font-semibold text-muted-foreground">Estoque</th>
                  <th className="p-4 font-semibold text-muted-foreground">Status</th>
                  <th className="p-4 text-right font-semibold text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedProducts.map((product) => {
                  const isLowStock = product.stock <= product.minStock
                  return (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold">{product.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {product.sku ? `SKU: ${product.sku}` : "Sem SKU"} • {product.category?.name || "Sem categoria"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-medium">
                        {formatCurrency(product.price)}
                        <span className="text-[10px] text-muted-foreground ml-1">/{product.unit}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isLowStock ? 'text-destructive' : ''}`}>
                            {product.stock}
                          </span>
                          <span className="text-xs text-muted-foreground">{product.unit}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {isLowStock ? (
                          <Badge variant="destructive" className="gap-1 px-1.5 py-0">
                            <AlertTriangle className="h-3 w-3" />
                            Estoque Baixo
                          </Badge>
                        ) : (
                          <Badge variant="success" className="px-1.5 py-0">Ok</Badge>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <ProductForm
                            product={product as any}
                            onSuccess={() => router.refresh()}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setProductToDelete(product.id)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Próxima <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Produto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover este produto do seu catálogo?
              Esta ação não pode ser desfeita e removerá o histórico de estoque associado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => productToDelete && handleDelete(productToDelete)}
              disabled={!!isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
