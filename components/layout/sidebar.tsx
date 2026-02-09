"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, BarChart3, Wallet, FilePlus, ShieldCheck, Users, Settings } from "lucide-react"

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    label: "Transações",
    icon: Wallet,
    href: "/transacoes",
  },
  {
    label: "Relatórios",
    icon: BarChart3,
    href: "/relatorios",
  },
  {
    label: "Faturamento",
    icon: FilePlus,
    href: "/faturamento",
  },
  {
    label: "Fiscal",
    icon: ShieldCheck,
    href: "/fiscal",
  },
  {
    label: "Contatos",
    icon: Users,
    href: "/contatos",
  },
  {
    label: "Configurações",
    icon: Settings,
    href: "/configuracoes",
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("h-screen w-64 border-r bg-card", className)}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/meikon-icon.png" alt="MEIKon Logo" width={32} height={32} className="h-8 w-auto" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#0055CC]">MEI</span>
              <span className="text-primary">Kon</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                pathname === route.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
