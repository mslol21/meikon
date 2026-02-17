"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function OfflineBadge() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) {
    return (
      <Badge variant="outline" className="gap-1.5 text-xs text-success border-success/30 bg-success/5 font-medium">
        <Wifi className="h-3 w-3" />
        Online
      </Badge>
    )
  }

  return (
    <Badge variant="destructive" className="gap-1.5 text-xs animate-pulse">
      <WifiOff className="h-3 w-3" />
      Offline
    </Badge>
  )
}
