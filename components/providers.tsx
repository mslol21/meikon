"use client"

import { SessionProvider } from "next-auth/react"
import { useOfflineSync } from "@/hooks/use-offline-sync"

function SyncManager({ children }: { children: React.ReactNode }) {
  // This hook handles the periodic/online sync logic
  useOfflineSync()
  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SyncManager>
        {children}
      </SyncManager>
    </SessionProvider>
  )
}
