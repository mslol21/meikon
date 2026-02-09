import { Button } from "@/components/ui/button"
import { Plus, Receipt, FilePlus, Download } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/transacoes?nova=receita">
        <Button size="sm" className="gap-2 bg-success hover:bg-success/90">
          <Plus className="h-4 w-4" />
          Receita
        </Button>
      </Link>
      <Link href="/transacoes?nova=despesa">
        <Button size="sm" variant="destructive" className="gap-2">
          <Plus className="h-4 w-4" />
          Despesa
        </Button>
      </Link>
      <Link href="/faturamento">
        <Button size="sm" variant="outline" className="gap-2">
          <FilePlus className="h-4 w-4" />
          Nota Fiscal
        </Button>
      </Link>
      <Link href="/transacoes">
        <Button size="sm" variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Importar OFX
        </Button>
      </Link>
    </div>
  )
}
