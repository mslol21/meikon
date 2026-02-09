"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { FilePlus, Loader2, ExternalLink, Info } from "lucide-react"

interface Contact {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  type: string
}

interface InvoicingFormProps {
  contacts: Contact[]
}

export function InvoicingForm({ contacts }: InvoicingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedContact, setSelectedContact] = useState<string>("")

  const clients = contacts.filter(c => c.type === "client" || c.type === "both")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const amount = formData.get("amount")
    const description = formData.get("description")
    
    // Aqui no futuro poderíamos salvar a intenção de faturamento no banco
    // Por enquanto, vamos apenas simular e abrir o portal nacional
    
    try {
      // Simulação de processamento
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Dados preparados!",
        description: "Agora utilize os dados no Portal Nacional da NFS-e.",
      })
      
      // Abre o portal nacional em uma nova aba
      window.open("https://www.nfse.gov.br/EmissorNacional", "_blank")
      setOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível preparar os dados.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <FilePlus className="h-4 w-4" />
          Nova Nota Fiscal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Assistente de Emissão (NFS-e)</DialogTitle>
            <DialogDescription>
              Preencha os dados básicos para facilitar a emissão no Portal Nacional.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="contactId">Cliente</Label>
              <Select name="contactId" onValueChange={setSelectedContact} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Valor do Serviço (R$)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição do Serviço</Label>
              <Input
                id="description"
                name="description"
                placeholder="Ex: Consultoria em TI, Manutenção..."
                required
              />
            </div>

            <div className="rounded-lg bg-muted p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Info className="h-3 w-3" />
                Dica Fiscal
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Ao abrir o Portal Nacional, selecione a opção <strong>"Emissão Simplificada"</strong>. 
                Utilize o código de serviço correspondente ao seu CNAE principal para garantir a tributação correta.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Ir para o Portal Nacional
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
