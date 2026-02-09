import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, TrendingUp, Shield, Zap, CheckCircle2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image src="/meikon-icon.png" alt="MEIKon Logo" width={32} height={32} className="h-10 w-auto" />
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-[#0055CC]">MEI</span>
              <span className="text-primary">Kon</span>
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Começar Grátis</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1">
        <div className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight">
              O único gestor MEI que te ajuda a{" "}
              <span className="text-primary">bater suas metas</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Acompanhe seu progresso, organize seus impostos automaticamente e tenha 
              o controle total do seu negócio em um só lugar.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/register">
                  Começar Grátis <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Fazer Login</Link>
              </Button>
            </div>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="relative mx-auto mt-20 max-w-5xl">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-success/20 blur-2xl opacity-50" />
            <div className="relative rounded-2xl border bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden">
              {/* Browser Header */}
              <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/50" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                  <div className="h-3 w-3 rounded-full bg-green-500/50" />
                </div>
                <div className="mx-auto h-5 w-64 rounded bg-muted/50" />
              </div>
              
              {/* Dashboard Content Mockup */}
              <div className="p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-4">
                  {/* Fake Sidebar */}
                  <div className="hidden space-y-4 md:block">
                    <div className="h-8 w-full rounded bg-primary/20" />
                    <div className="h-8 w-3/4 rounded bg-muted" />
                    <div className="h-8 w-3/4 rounded bg-muted" />
                    <div className="h-8 w-3/4 rounded bg-muted" />
                    <div className="h-8 w-3/4 rounded bg-muted" />
                  </div>
                  
                  {/* Main View */}
                  <div className="col-span-3 space-y-6">
                    <div className="flex items-center justify-between font-bold">
                      <div className="h-8 w-32 rounded bg-muted" />
                      <div className="h-8 w-24 rounded bg-primary/10" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 rounded-xl border bg-card p-4">
                        <div className="h-3 w-12 rounded bg-muted mb-4 text-xs font-semibold">RECEITA</div>
                        <div className="h-6 w-20 rounded bg-success/20" />
                      </div>
                      <div className="h-24 rounded-xl border bg-card p-4">
                        <div className="h-3 w-12 rounded bg-muted mb-4 text-xs font-semibold">DESPESAS</div>
                        <div className="h-6 w-20 rounded bg-destructive/20" />
                      </div>
                      <div className="h-24 rounded-xl border bg-card p-4">
                        <div className="h-3 w-12 rounded bg-muted mb-4 text-xs font-semibold">SALDO</div>
                        <div className="h-6 w-20 rounded bg-primary/20" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-2 h-48 rounded-xl border bg-card p-4">
                        <div className="h-4 w-32 rounded bg-muted mb-6" />
                        <div className="flex items-end gap-2 h-24">
                          <div className="h-1/2 w-full rounded bg-primary/10" />
                          <div className="h-3/4 w-full rounded bg-primary/20" />
                          <div className="h-2/3 w-full rounded bg-primary/10" />
                          <div className="h-full w-full rounded bg-primary/30" />
                        </div>
                      </div>
                      <div className="h-48 rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col items-center justify-center text-center">
                        <div className="relative mb-2 h-24 w-24">
                          <svg className="h-full w-full" viewBox="0 0 100 100">
                            <circle className="text-muted stroke-current" strokeWidth="8" fill="transparent" r="40" cx="50" cy="50" />
                            <circle className="text-primary stroke-current" strokeWidth="8" strokeDasharray="180 251" strokeLinecap="round" fill="transparent" r="40" cx="50" cy="50" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">75%</div>
                        </div>
                        <div className="h-3 w-16 rounded bg-primary/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mx-auto mt-24 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Simplicidade de Fluxo</h3>
              <p className="text-sm text-muted-foreground">
                Importe seu extrato bancário (OFX) e categorize tudo em segundos.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-success/10 p-3">
                <BarChart3 className="h-6 w-6 text-success" />
              </div>
              <h3 className="mb-2 font-semibold">Metas de Crescimento</h3>
              <p className="text-sm text-muted-foreground">
                Defina quanto quer faturar e visualize seu progresso gamificado.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Fisco em Dia</h3>
              <p className="text-sm text-muted-foreground">
                Alertas de DAS e controle do limite anual de R$ 81k.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-success/10 p-3">
                <Zap className="h-6 w-6 text-success" />
              </div>
              <h3 className="mb-2 font-semibold">Nota Fiscal Fácil</h3>
              <p className="text-sm text-muted-foreground">
                Assistente de emissão integrado ao Portal Nacional.
              </p>
            </div>
          </div>

          {/* How it Works */}
          <div className="mx-auto mt-32 max-w-4xl text-center">
            <h2 className="mb-12 text-3xl font-bold">Como funciona</h2>
            <div className="grid gap-8 md:grid-cols-4">
              <div className="space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold">1</div>
                <h4 className="font-bold text-sm">Registre tudo</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Lançamento rápido de receitas e despesas.</p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold">2</div>
                <h4 className="font-bold text-sm">Monitore o Limite</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Não corra o risco de desenquadrar do MEI.</p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold">3</div>
                <h4 className="font-bold text-sm">Pague o DAS</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Lembretes automáticos para não esquecer o imposto.</p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold">4</div>
                <h4 className="font-bold text-sm">Use Links Oficiais</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Acesso direto ao Portal do Governo e NFS-e.</p>
              </div>
            </div>
          </div>

          {/* Pricing Preview */}
          <div className="mx-auto mt-32 max-w-4xl">
            <h2 className="mb-4 text-center text-3xl font-bold">
              Planos e Preços
            </h2>
            <p className="mb-12 text-center text-muted-foreground">O empurrão que seu negócio precisa para crescer.</p>
            
            <div className="grid gap-8 md:grid-cols-2">
              {/* Free Plan */}
              <div className="rounded-2xl border bg-card p-8 flex flex-col">
                <h3 className="mb-2 text-2xl font-bold tracking-tight">Free</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">R$ 0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="mb-8 space-y-4 flex-1">
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="h-3 w-3 text-primary" />
                    </div>
                    Até 50 transações/mês
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="h-3 w-3 text-primary" />
                    </div>
                    Controle de metas básicas
                  </li>
                  <li className="flex items-center gap-3 text-sm text-muted-foreground italic">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                      <Shield className="h-3 w-3" />
                    </div>
                    Ideal para quem está começando
                  </li>
                </ul>
                <Button className="w-full h-11 font-bold" variant="outline" asChild>
                  <Link href="/register">Começar Grátis</Link>
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="rounded-2xl border-2 border-primary bg-card p-8 flex flex-col relative scale-105 shadow-xl">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] font-bold text-primary-foreground uppercase tracking-widest">
                  Mais Popular
                </div>
                <h3 className="mb-2 text-2xl font-bold tracking-tight">PRO</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">R$ 39</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="mb-8 space-y-4 flex-1">
                  <li className="flex items-center gap-3 text-sm font-semibold">
                    <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    Transações ilimitadas
                  </li>
                  <li className="flex items-center gap-3 text-sm font-semibold text-primary">
                    <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    Importe o extrato do banco em segundos
                  </li>
                  <li className="flex items-center gap-3 text-sm font-semibold text-primary">
                    <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    Saiba quanto precisa faturar todo mês
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    Envie dados direto para o contador
                  </li>
                  <li className="flex items-center gap-3 text-sm opacity-80">
                    <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    14 dias grátis para testar
                  </li>
                </ul>
                <Button className="w-full h-11 font-bold shadow-lg" asChild>
                  <Link href="/register">Garantir Plano PRO</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground group">
          <p>© 2026 MEIKon. Feito para MEI brasileiro 🇧🇷</p>
          <p className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Pensado para quem trabalha sozinho.</p>
        </div>
      </footer>
    </div>
  )
}
