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
      <section className="flex-1 overflow-x-hidden">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              O único gestor MEI que te ajuda a{" "}
              <span className="text-primary">bater suas metas</span>
            </h1>
            <p className="mb-8 text-lg md:text-xl text-muted-foreground leading-relaxed">
              Acompanhe seu progresso, organize seus impostos automaticamente e tenha 
              o controle total do seu negócio em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-0">
              <Button size="lg" className="gap-2 h-12 md:h-14 px-8 text-base font-bold shadow-lg shadow-primary/20" asChild>
                <Link href="/register">
                  Começar Grátis <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 md:h-14 px-8 text-base" asChild>
                <Link href="/login">Fazer Login</Link>
              </Button>
            </div>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="relative mx-auto mt-16 md:mt-24 lg:mt-32 max-w-5xl px-2 sm:px-0">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-success/20 blur-3xl opacity-50" />
            <div className="relative rounded-2xl border bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden">
              {/* Browser Header */}
              <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/50" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                  <div className="h-3 w-3 rounded-full bg-green-500/50" />
                </div>
                <div className="mx-auto h-5 w-32 sm:w-64 rounded bg-muted/50" />
              </div>
              
              {/* Dashboard Content Mockup */}
              <div className="p-4 sm:p-6 md:p-10 lg:p-12">
                <div className="grid gap-6 md:grid-cols-4">
                  {/* Fake Sidebar */}
                  <div className="hidden space-y-4 md:block">
                    <div className="h-10 w-full rounded bg-primary/20 mb-6" />
                    <div className="h-8 w-3/4 rounded bg-muted/50" />
                    <div className="h-8 w-3/4 rounded bg-muted/50" />
                    <div className="h-8 w-3/4 rounded bg-muted/50" />
                    <div className="h-8 w-3/4 rounded bg-muted/50" />
                  </div>
                  
                  {/* Main View */}
                  <div className="md:col-span-3 space-y-6 sm:space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-32 sm:w-48 rounded bg-muted/50" />
                      <div className="h-10 w-24 sm:w-32 rounded bg-primary/10" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="h-28 rounded-2xl border bg-card p-5 shadow-sm">
                        <div className="h-3 w-12 rounded bg-muted/50 mb-4 text-[10px] font-bold uppercase tracking-wider">RECEITA</div>
                        <div className="h-8 w-24 rounded bg-success/20" />
                      </div>
                      <div className="h-28 rounded-2xl border bg-card p-5 shadow-sm">
                        <div className="h-3 w-12 rounded bg-muted/50 mb-4 text-[10px] font-bold uppercase tracking-wider">DESPESAS</div>
                        <div className="h-8 w-24 rounded bg-destructive/20" />
                      </div>
                      <div className="h-28 rounded-2xl border bg-card p-5 shadow-sm">
                        <div className="h-3 w-12 rounded bg-muted/50 mb-4 text-[10px] font-bold uppercase tracking-wider">SALDO</div>
                        <div className="h-8 w-24 rounded bg-primary/20" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 h-56 rounded-2xl border bg-card p-6 shadow-sm">
                        <div className="h-5 w-32 rounded bg-muted/50 mb-10" />
                        <div className="flex items-end gap-3 h-24 px-4">
                          <div className="h-1/2 w-full rounded-t-lg bg-primary/10" />
                          <div className="h-3/4 w-full rounded-t-lg bg-primary/20" />
                          <div className="h-2/3 w-full rounded-t-lg bg-primary/10" />
                          <div className="h-full w-full rounded-t-lg bg-primary/30" />
                          <div className="h-1/2 w-full rounded-t-lg bg-primary/10" />
                        </div>
                      </div>
                      <div className="h-56 rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col items-center justify-center text-center shadow-inner">
                        <div className="relative mb-4 h-28 w-28">
                          <svg className="h-full w-full" viewBox="0 0 100 100">
                            <circle className="text-muted/20 stroke-current" strokeWidth="8" fill="transparent" r="40" cx="50" cy="50" />
                            <circle className="text-primary stroke-current" strokeWidth="8" strokeDasharray="180 251" strokeLinecap="round" fill="transparent" r="40" cx="50" cy="50" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-primary">75%</div>
                        </div>
                        <div className="h-3 w-24 rounded bg-primary/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mx-auto mt-24 md:mt-40 grid max-w-5xl gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4">
            <div className="flex flex-col items-center text-center group">
              <div className="mb-6 rounded-2xl bg-primary/10 p-4 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Simplicidade de Fluxo</h3>
              <p className="text-base text-muted-foreground max-w-[240px] leading-relaxed">
                Importe seu extrato bancário (OFX) e categorize tudo em segundos.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="mb-6 rounded-2xl bg-success/10 p-4 transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-300">
                <BarChart3 className="h-8 w-8 text-success" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Metas de Crescimento</h3>
              <p className="text-base text-muted-foreground max-w-[240px] leading-relaxed">
                Defina quanto quer faturar e visualize seu progresso gamificado.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="mb-6 rounded-2xl bg-primary/10 p-4 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Fisco em Dia</h3>
              <p className="text-base text-muted-foreground max-w-[240px] leading-relaxed">
                Alertas de DAS e controle do limite anual de R$ 81k.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="mb-6 rounded-2xl bg-success/10 p-4 transition-transform group-hover:scale-110 group-hover:-rotate-3 duration-300">
                <Zap className="h-8 w-8 text-success" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Nota Fiscal Fácil</h3>
              <p className="text-base text-muted-foreground max-w-[240px] leading-relaxed">
                Assistente de emissão integrado ao Portal Nacional.
              </p>
            </div>
          </div>

          {/* How it Works */}
          <div className="mx-auto mt-32 md:mt-48 max-w-5xl text-center px-4">
            <h2 className="mb-16 text-3xl md:text-4xl font-black tracking-tight">Como funciona</h2>
            <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
              <div className="space-y-4 relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white text-xl font-black shadow-lg shadow-primary/20">1</div>
                <h4 className="font-bold text-lg">Registre tudo</h4>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">Lançamento rápido de receitas e despesas.</p>
              </div>
              <div className="space-y-4 relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white text-xl font-black shadow-lg shadow-primary/20">2</div>
                <h4 className="font-bold text-lg">Monitore o Limite</h4>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">Não corra o risco de desenquadrar do MEI.</p>
              </div>
              <div className="space-y-4 relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white text-xl font-black shadow-lg shadow-primary/20">3</div>
                <h4 className="font-bold text-lg">Pague o DAS</h4>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">Lembretes automáticos para não esquecer o imposto.</p>
              </div>
              <div className="space-y-4 relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white text-xl font-black shadow-lg shadow-primary/20">4</div>
                <h4 className="font-bold text-lg">Use Links Oficiais</h4>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">Acesso direto ao Portal do Governo e NFS-e.</p>
              </div>
            </div>
          </div>

          {/* Pricing Preview */}
          <div id="prices" className="mx-auto mt-32 md:mt-48 max-w-5xl px-4 mb-24">
            <h2 className="mb-4 text-center text-3xl md:text-4xl font-black tracking-tight">
              Planos e Preços
            </h2>
            <p className="mb-16 text-center text-lg text-muted-foreground">O empurrão que seu negócio precisa para crescer.</p>
            
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-8">
              {/* Free Plan */}
              <div className="w-full max-w-sm rounded-3xl border bg-card p-8 md:p-10 flex flex-col transition-all hover:border-primary/50 duration-300">
                <h3 className="mb-2 text-2xl font-bold tracking-tight">Free</h3>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter">R$ 0</span>
                  <span className="text-muted-foreground font-medium">/mês</span>
                </div>
                <ul className="mb-10 space-y-5 flex-1">
                  <li className="flex items-center gap-4 text-base font-medium">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                    </div>
                    Até 50 transações/mês
                  </li>
                  <li className="flex items-center gap-4 text-base font-medium">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                    </div>
                    Controle de metas básicas
                  </li>
                  <li className="flex items-center gap-4 text-sm text-muted-foreground italic font-medium">
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Shield className="h-3.5 w-3.5" />
                    </div>
                    Ideal para quem está começando
                  </li>
                </ul>
                <Button className="w-full h-14 text-base font-black rounded-2xl" variant="outline" asChild>
                  <Link href="/register">Começar Grátis</Link>
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="w-full max-w-sm rounded-3xl border-4 border-primary bg-card p-8 md:p-10 flex flex-col relative lg:scale-110 shadow-2xl shadow-primary/20 z-10 transition-transform duration-300">
                <div className="absolute -top-4 left-1/2 -track-wide -translate-x-1/2 rounded-full bg-primary px-6 py-1.5 text-xs font-black text-primary-foreground uppercase tracking-[0.15em] shadow-lg">
                  Mais Popular
                </div>
                <h3 className="mb-2 text-2xl font-bold tracking-tight">PRO</h3>
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter">R$ 39</span>
                  <span className="text-muted-foreground font-medium">/mês</span>
                </div>
                <ul className="mb-10 space-y-5 flex-1">
                  <li className="flex items-center gap-4 text-base font-bold">
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    Transações ilimitadas
                  </li>
                  <li className="flex items-center gap-4 text-base font-bold text-primary">
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    Importe seu extrato em segundos
                  </li>
                  <li className="flex items-center gap-4 text-base font-bold text-primary">
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    Metas de faturamento detalhadas
                  </li>
                  <li className="flex items-center gap-4 text-base">
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    Exporte dados para o contador
                  </li>
                  <li className="flex items-center gap-4 text-base font-medium opacity-90">
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    14 dias grátis para testar
                  </li>
                </ul>
                <Button className="w-full h-14 text-lg font-black rounded-2xl shadow-lg shadow-primary/30" asChild>
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
