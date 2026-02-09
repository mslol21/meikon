"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Settings,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Transações",
    icon: Receipt,
    href: "/transacoes",
  },
  {
    label: "Relatórios",
    icon: BarChart3,
    href: "/relatorios",
  },
  {
    label: "Configurações",
    icon: Settings,
    href: "/configuracoes",
  },
]

export function MobileSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b p-6">
            <SheetTitle className="text-left">
              <div className="flex items-center gap-2">
                <Image src="/meikon-icon.png" alt="MEIKon Logo" width={32} height={32} className="h-8 w-auto" />
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-[#0055CC]">MEI</span>
                  <span className="text-primary">Kon</span>
                </span>
              </div>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex-1 space-y-1 p-4">
            {routes.map((route) => {
              const isActive = pathname === route.href
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground">
              © 2026 MEIKon. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
