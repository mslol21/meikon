"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function SubscriptionStatusToast() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const success = searchParams.get("success")

  useEffect(() => {
    if (success === "true") {
      toast({
        title: "Assinatura iniciada! 🎉",
        description: "Seu pagamento está sendo processado. Em instantes seu plano PRO será ativado.",
      })
      
      // Limpar a URL removendo o parâmetro 'success' sem recarregar a página
      const url = new URL(window.location.href)
      url.searchParams.delete("success")
      window.history.replaceState({}, "", url.toString())
    }
  }, [success, toast])

  return null
}
