import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { ProductList } from "@/components/inventory/product-list"
import { Package, Truck, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function InventoryPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    })
  } catch (error) {
    console.warn("Módulo de inventário ainda não disponível no banco de dados.")
  }

  // Basic stats
  const totalProducts = products.length
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0)

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventário</h2>
          <p className="text-muted-foreground">
            Gerencie seu catálogo de produtos e controle seu estoque.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Produtos cadastrados</p>
          </CardContent>
        </Card>
        
        <Card className={lowStockProducts > 0 ? "bg-destructive/5 border-destructive/20" : "bg-success/5 border-success/20"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lowStockProducts > 0 ? "text-destructive" : "text-success"}`}>
              {lowStockProducts}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Produtos precisando de reposição</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor em Estoque</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalInventoryValue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Potencial de venda total</p>
          </CardContent>
        </Card>
      </div>

      <ProductList initialProducts={products as any} />
    </div>
  )
}
