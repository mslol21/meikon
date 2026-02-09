"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ContactForm } from "./contact-form"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Loader2, Mail, Phone, ExternalLink } from "lucide-react"

interface Contact {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  type: string
  _count: {
    transactions: number
  }
}

interface ContactListProps {
  initialContacts: Contact[]
}

export function ContactList({ initialContacts }: ContactListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [contacts, setContacts] = useState(initialContacts)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este contato?")) return
    
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/contacts/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Erro ao excluir")

      toast({
        title: "Contato excluído",
        description: "O contato foi removido com sucesso.",
      })
      setContacts(contacts.filter(c => c.id !== id))
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o contato.",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "client": return <Badge variant="success">Cliente</Badge>
      case "provider": return <Badge variant="secondary">Fornecedor</Badge>
      case "both": return <Badge variant="outline">Ambos</Badge>
      default: return null
    }
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead className="text-center">Transações</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                Nenhum contato encontrado.
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{getTypeBadge(contact.type)}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-xs">
                    {contact.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
                    {contact._count.transactions}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <ContactForm contact={contact} />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(contact.id)}
                      disabled={isDeleting === contact.id}
                    >
                      {isDeleting === contact.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
