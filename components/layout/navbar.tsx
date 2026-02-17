"use client"

import { UserNav } from "./user-nav"
import { MobileSidebar } from "./mobile-sidebar"
import { OfflineBadge } from "./offline-badge"

export function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <MobileSidebar />
        <div className="min-w-0">
          <h2 className="text-sm md:text-lg font-semibold truncate">Bem-vindo ao MEIKon</h2>
          <p className="hidden md:block text-sm text-muted-foreground">
            Gerencie suas finanças de forma simples
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <OfflineBadge />
        <UserNav />
      </div>
    </header>
  )
}
