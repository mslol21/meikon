"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Loader2, Package } from "lucide-react"
import { offlineStorage } from "@/lib/offline-storage"

interface Category {
  id: string
  name: string
  type: string
}

interface Product {
  id: string
  name: string
  description?: string
  sku?: string
  price: number
  costPrice?: number
  stock: number
  minStock: number
  unit: string
  categoryId?: string
}

interface ProductFormProps {
  product?: Product
  onSuccess?: () => void
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  const isEditing = !!product

  useEffect(() => {
    if (open) {
      fetchCategories()
    }
  }, [open])

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories?type=product")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      sku: (formData.get("sku") as string) || null,
      description: (formData.get("description") as string) || null,
      price: parseFloat(formData.get("price") as string),
      costPrice: formData.get("costPrice") ? parseFloat(formData.get("costPrice") as string) : null,
      stock: parseInt(formData.get("stock") as string) || 0,
      minStock: parseInt(formData.get("minStock") as string) || 0,
      unit: formData.get("unit") as string,
      categoryId: (formData.get("categoryId") as string) || null,
    }

    try {
      const url = isEditing
        ? `/api/products/${product.id}`
        : "/api/products"
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
        throw new Error(result.error || "Erro ao salvar produto")
      }

      toast({
        title: isEditing ? "Produto atualizado!" : "Produto criado!",
        description: isEditing
          ? "O produto foi atualizado com sucesso."
          : "O produto foi adicionado ao seu inventário.",
      })

      setOpen(false)
      router.refresh()
      onSuccess?.()
    } catch (error: any) {
      if (error instanceof TypeError && !navigator.onLine) {
        // Network error - likely offline
        const url = isEditing
          ? `/api/products/${product?.id}`
          : "/api/products"
        const method = isEditing ? "PUT" : "POST"
        
        offlineStorage.saveRequest(url, method, data)
        
        toast({
          title: "Modo Offline",
          description: "O produto foi salvo localmente e será sincronizado assim que você estiver online.",
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
            Novo Produto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Atualize as informações do seu produto"
                : "Adicione um novo produto ao seu catálogo de inventário"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Camiseta Algodão G"
                  defaultValue={product?.name}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU / Código</Label>
                <Input
                  id="sku"
                  name="sku"
                  placeholder="Ex: CAM-001"
                  defaultValue={product?.sku}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Detalhes sobre o produto..."
                defaultValue={product?.description}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Preço de Venda (R$)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  defaultValue={product?.price}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="costPrice">Preço de Custo (R$)</Label>
                <Input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  defaultValue={product?.costPrice}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stock">Estoque Atual</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue={product?.stock || 0}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minStock">Estoque Mínimo</Label>
                <Input
                  id="minStock"
                  name="minStock"
                  type="number"
                  min="0"
                  defaultValue={product?.minStock || 0}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unidade</Label>
                <Select name="unit" defaultValue={product?.unit || "un"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unid." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="un">Unidade (un)</SelectItem>
                    <SelectItem value="kg">Quilo (kg)</SelectItem>
                    <SelectItem value="g">Grama (g)</SelectItem>
                    <SelectItem value="m">Metro (m)</SelectItem>
                    <SelectItem value="l">Litro (l)</SelectItem>
                    <SelectItem value="cx">Caixa (cx)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="categoryId">Categoria</Label>
              <Select name="categoryId" defaultValue={product?.categoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sem categoria</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
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
              {isEditing ? "Atualizar Produto" : "Criar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
