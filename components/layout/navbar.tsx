"use client"

import { UserNav } from "./user-nav"
import { MobileSidebar } from "./mobile-sidebar"

export function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <MobileSidebar />
        <div>
          <h2 className="text-lg font-semibold">Bem-vindo ao MEIKon</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas finanças de forma simples
          </p>
        </div>
      </div>
      <UserNav />
    </header>
  )
}
