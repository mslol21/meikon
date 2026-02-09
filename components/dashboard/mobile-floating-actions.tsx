"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function MobileFloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 md:hidden">
      <Link href="/transacoes?nova=receita">
        <Button size="icon" className="h-14 w-14 rounded-full shadow-2xl bg-success hover:bg-success/90">
          <Plus className="h-8 w-8 text-white" />
        </Button>
      </Link>
    </div>
  )
}
