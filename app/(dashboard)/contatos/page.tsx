import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ContactList } from "@/components/contacts/contact-list"
import { ContactForm } from "@/components/contacts/contact-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

async function getContacts(userId: string) {
  const contacts = await prisma.contact.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { transactions: true }
      }
    }
  })
  return contacts
}

export default async function ContatosPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const contacts = await getContacts(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">Contatos</h1>
          <p className="text-muted-foreground">
            Gerencie seus clientes e fornecedores
          </p>
        </div>
        <ContactForm />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total de Contatos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {contacts.filter(c => c.type === "client" || c.type === "both").length}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {contacts.filter(c => c.type === "provider" || c.type === "both").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <ContactList initialContacts={contacts} />
    </div>
  )
}
