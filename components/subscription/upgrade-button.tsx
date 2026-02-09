"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Crown, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UpgradeButtonProps {
  isPro?: boolean
  variant?: "default" | "outline"
}

export function UpgradeButton({ isPro, variant = "default" }: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleUpgrade() {
    setIsLoading(true)

    try {
      const response = await fetch("/api/mercadopago/checkout", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar assinatura")
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleUpgrade}
      disabled={isLoading}
      variant={variant}
      className="w-full gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Crown className="h-4 w-4" />
      )}
      {isPro ? "Gerenciar Assinatura" : "Fazer Upgrade"}
    </Button>
  )
}
