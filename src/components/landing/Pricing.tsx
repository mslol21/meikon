import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Gratuito",
    description: "Para começar a organizar suas finanças",
    price: "R$ 0",
    period: "/mês",
    features: [
      "Até 20 transações por mês",
      "Dashboard básico",
      "Categorização de gastos",
      "Relatório mensal simples",
      "Suporte por email",
    ],
    popular: false,
    cta: "Começar Grátis",
  },
  {
    name: "PRO",
    description: "Para MEIs que querem crescer",
    price: "R$ 39",
    period: "/mês",
    features: [
      "Transações ilimitadas",
      "Dashboard completo",
      "Separação pessoa física/empresa",
      "Lembretes de pagamentos",
      "Relatórios avançados",
      "Exportação de dados",
      "Suporte prioritário",
      "Acesso a novos recursos",
    ],
    popular: true,
    cta: "Começar Agora",
  },
];

const Pricing = () => {
  return (
    <section id="precos" className="section-padding">
      <div className="container-narrow mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Preços
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Planos que cabem no seu bolso
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comece grátis e faça upgrade quando precisar. Sem surpresas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Mais Popular
                  </span>
                </div>
              )}

              <div
                className={`rounded-2xl p-8 h-full ${
                  plan.popular
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-card border border-border"
                }`}
              >
                <div className="mb-6">
                  <h3
                    className={`text-2xl font-bold ${
                      plan.popular ? "" : "text-foreground"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`mt-1 ${
                      plan.popular
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span
                    className={
                      plan.popular
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }
                  >
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          plan.popular ? "text-accent" : "text-accent"
                        }`}
                      />
                      <span
                        className={
                          plan.popular
                            ? "text-primary-foreground/90"
                            : "text-muted-foreground"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-6 text-lg ${
                    plan.popular
                      ? "bg-white text-primary hover:bg-white/90"
                      : "btn-shadow"
                  }`}
                  asChild
                >
                  <a href="#cta-final">{plan.cta}</a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-muted-foreground mt-8"
        >
          ✓ 14 dias grátis no plano PRO • ✓ Cancele quando quiser • ✓ Sem taxa de cancelamento
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
