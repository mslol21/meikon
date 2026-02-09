"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ExternalLink, FileText, CreditCard, Landmark, Briefcase } from "lucide-react"

export function GovHub() {
  const links = [
    {
      label: "Emitir Nota Fiscal",
      description: "Portal Nacional NFS-e",
      href: "https://www.nfse.gov.br/EmissorNacional",
      icon: FileText
    },
    {
      label: "Emitir Boleto DAS",
      description: "Imposto mensal MEI",
      href: "http://www.pgmei.receita.fazenda.gov.br/Pagina/Login",
      icon: CreditCard
    },
    {
      label: "Declaração Anual",
      description: "DASN-SIMEI",
      href: "http://www.pgmei.receita.fazenda.gov.br/Pagina/Login",
      icon: Landmark
    },
    {
      label: "Portal Empreendedor",
      description: "Serviços e cadastros",
      href: "https://www.gov.br/empresas-e-negocios/pt-br/empreendedor",
      icon: Briefcase
    }
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Landmark className="h-4 w-4 text-primary" />
          Serviços Oficiais MEI
        </CardTitle>
        <CardDescription className="text-xs">Acessos rápidos aos portais do governo</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors group"
          >
            <div className="rounded-full bg-muted p-2 group-hover:bg-primary/10">
              <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold leading-none flex items-center gap-1">
                {link.label}
                <ExternalLink className="h-2.5 w-2.5 opacity-50" />
              </span>
              <span className="text-[10px] text-muted-foreground mt-1">{link.description}</span>
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  )
}
