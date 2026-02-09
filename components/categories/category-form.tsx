"use client"

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
import { Crown, Plus, Loader2, DollarSign, ShoppingCart, Briefcase, Home, Car, Coffee, Zap, Package, TrendingUp, CreditCard, Wallet, PiggyBank, Receipt, FileText, Utensils } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
  type: string
  icon: string
  color: string
}

interface CategoryFormProps {
  category?: Category
  isPro?: boolean
  onSuccess?: () => void
}

const ICONS = [
  { name: "DollarSign", icon: DollarSign, label: "Dinheiro" },
  { name: "ShoppingCart", icon: ShoppingCart, label: "Compras" },
  { name: "Briefcase", icon: Briefcase, label: "Trabalho" },
  { name: "Home", icon: Home, label: "Casa" },
  { name: "Car", icon: Car, label: "Transporte" },
  { name: "Coffee", icon: Coffee, label: "Alimentação" },
  { name: "Zap", icon: Zap, label: "Energia" },
  { name: "Package", icon: Package, label: "Produtos" },
  { name: "TrendingUp", icon: TrendingUp, label: "Investimentos" },
  { name: "CreditCard", icon: CreditCard, label: "Cartão" },
  { name: "Wallet", icon: Wallet, label: "Carteira" },
  { name: "PiggyBank", icon: PiggyBank, label: "Economia" },
  { name: "Receipt", icon: Receipt, label: "Recibos" },
  { name: "FileText", icon: FileText, label: "Documentos" },
  { name: "Utensils", icon: Utensils, label: "Restaurante" },
]

const COLORS = [
  { name: "Azul", value: "#2563eb" },
  { name: "Verde", value: "#10b981" },
  { name: "Vermelho", value: "#ef4444" },
  { name: "Amarelo", value: "#f59e0b" },
  { name: "Roxo", value: "#8b5cf6" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Laranja", value: "#f97316" },
  { name: "Ciano", value: "#06b6d4" },
  { name: "Índigo", value: "#6366f1" },
  { name: "Cinza", value: "#6b7280" },
]

export function CategoryForm({ category, isPro = false, onSuccess }: CategoryFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(category?.name || "")
  const [selectedIcon, setSelectedIcon] = useState(category?.icon || "DollarSign")
  const [selectedColor, setSelectedColor] = useState(category?.color || "#2563eb")

  const isEditing = !!category

  if (!isPro && !isEditing) {
    return (
      <Button className="gap-2" variant="outline" onClick={() => {
        toast({
          title: "Funcionalidade PRO",
          description: "A criação de categorias personalizadas é exclusiva do plano PRO.",
        })
      }}>
        <Plus className="h-4 w-4" />
        Nova Categoria
      </Button>
    )
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      icon: selectedIcon,
      color: selectedColor,
    }

    try {
      const url = isEditing
        ? `/api/categories/${category.id}`
        : "/api/categories"
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
        throw new Error(result.error || "Erro ao salvar categoria")
      }

      toast({
        title: isEditing ? "Categoria atualizada!" : "Categoria criada!",
        description: isEditing
          ? "A categoria foi atualizada com sucesso."
          : "A categoria foi criada com sucesso.",
      })

      setOpen(false)
      router.refresh()
      onSuccess?.()
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

  const SelectedIconComponent = ICONS.find((i) => i.name === selectedIcon)?.icon || DollarSign

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
            Nova Categoria
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Atualize os dados da categoria"
                : "Crie uma nova categoria personalizada"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Ex: Vendas Online"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                name="type"
                defaultValue={category?.type || "income"}
                required
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
              <Label>Ícone</Label>
              <div className="grid grid-cols-5 gap-2">
                {ICONS.map((icon) => {
                  const IconComponent = icon.icon
                  return (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => setSelectedIcon(icon.name)}
                      className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all hover:bg-muted ${
                        selectedIcon === icon.name
                          ? "border-primary bg-primary/10"
                          : "border-transparent"
                      }`}
                      title={icon.label}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="text-xs">{icon.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Cor</Label>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:bg-muted ${
                      selectedColor === color.value
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <div
                      className="h-8 w-8 rounded-full"
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="text-xs">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <Label className="mb-2 block">Preview</Label>
              <div className="flex items-center gap-3">
                <div
                  className="rounded-full p-3"
                  style={{ backgroundColor: `${selectedColor}20` }}
                >
                  <SelectedIconComponent
                    className="h-6 w-6"
                    style={{ color: selectedColor }}
                  />
                </div>
                <div>
                  <p className="font-medium">
                    {name || "Nome da Categoria"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedIcon} • {COLORS.find((c) => c.value === selectedColor)?.name}
                  </p>
                </div>
              </div>
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
