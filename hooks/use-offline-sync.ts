"use client"

import { useEffect, useState } from "react"
import { offlineStorage } from "@/lib/offline-storage"
import { useToast } from "@/hooks/use-toast"

export function useOfflineSync() {
  const { toast } = useToast()
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  const sync = async () => {
    const pending = offlineStorage.getPendingRequests()
    if (pending.length === 0 || isSyncing) return

    setIsSyncing(true)
    let successCount = 0
    let failCount = 0

    toast({
      title: "Sincronizando...",
      description: `Enviando ${pending.length} registros pendentes.`,
    })

    for (const request of pending) {
      try {
        const response = await fetch(request.url, {
          method: request.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request.body),
        })

        if (response.ok) {
          offlineStorage.removeRequest(request.id)
          successCount++
        } else {
          failCount++
        }
      } catch (error) {
        failCount++
      }
    }

    setIsSyncing(false)
    setPendingCount(offlineStorage.getPendingRequests().length)

    if (successCount > 0) {
      toast({
        title: "Sincronização concluída!",
        description: `${successCount} registros sincronizados com sucesso.`,
      })
    }

    if (failCount > 0) {
      toast({
        variant: "destructive",
        title: "Erro na sincronização",
        description: `${failCount} registros não puderam ser sincronizados. Tentaremos novamente mais tarde.`,
      })
    }
  }

  useEffect(() => {
    setPendingCount(offlineStorage.getPendingRequests().length)

    const handleOnline = () => {
      sync()
    }

    window.addEventListener("online", handleOnline)
    
    // Initial sync check
    if (navigator.onLine) {
      sync()
    }

    return () => window.removeEventListener("online", handleOnline)
  }, [])

  return { sync, isSyncing, pendingCount }
}
