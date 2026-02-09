"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { CategoryForm } from "./category-form"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Loader2 } from "lucide-react"
import * as Icons from "lucide-react"

interface Category {
  id: string
  name: string
  type: string
  icon: string
  color: string
}

interface CategoryListProps {
  categories: Category[]
  isPro?: boolean
}

export function CategoryList({ categories, isPro }: CategoryListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  )

  async function handleDelete(id: string) {
    setIsDeleting(id)

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao deletar categoria")
      }

      toast({
        title: "Categoria deletada!",
        description: "A categoria foi removida com sucesso.",
      })

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
      setCategoryToDelete(null)
    }
  }

  function openDeleteDialog(category: Category) {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const incomeCategories = categories.filter((c) => c.type === "income")
  const expenseCategories = categories.filter((c) => c.type === "expense")

  function getIcon(iconName: string) {
    const IconComponent = (Icons as any)[iconName]
    return IconComponent || Icons.DollarSign
  }

  return (
    <div className="space-y-6">
      {/* Income Categories */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Categorias de Receita</h3>
        {incomeCategories.length === 0 ? (
          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            Nenhuma categoria de receita personalizada
          </div>
        ) : (
          <div className="grid gap-3">
            {incomeCategories.map((category) => {
              const IconComponent = getIcon(category.icon)
              return (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="rounded-full p-3"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <IconComponent
                        className="h-5 w-5"
                        style={{ color: category.color }}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="success">Receita</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CategoryForm
                      category={category}
                      isPro={isPro}
                      onSuccess={() => router.refresh()}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(category)}
                      disabled={isDeleting === category.id}
                    >
                      {isDeleting === category.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Expense Categories */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Categorias de Despesa</h3>
        {expenseCategories.length === 0 ? (
          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            Nenhuma categoria de despesa personalizada
          </div>
        ) : (
          <div className="grid gap-3">
            {expenseCategories.map((category) => {
              const IconComponent = getIcon(category.icon)
              return (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="rounded-full p-3"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <IconComponent
                        className="h-5 w-5"
                        style={{ color: category.color }}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="destructive">Despesa</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CategoryForm
                      category={category}
                      isPro={isPro}
                      onSuccess={() => router.refresh()}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(category)}
                      disabled={isDeleting === category.id}
                    >
                      {isDeleting === category.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar a categoria &quot;
              {categoryToDelete?.name}&quot;? Esta ação não pode ser desfeita.
              {categoryToDelete && (
                <span className="mt-2 block text-sm text-muted-foreground">
                  Nota: Você não pode deletar categorias que estão sendo usadas
                  em transações.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setCategoryToDelete(null)
              }}
              disabled={!!isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                categoryToDelete && handleDelete(categoryToDelete.id)
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
