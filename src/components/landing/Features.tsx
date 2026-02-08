import { motion } from "framer-motion";
import { Wallet, Split, BellRing, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Controle de Caixa em Tempo Real",
    description: "Saiba exatamente quanto tem disponível a qualquer momento. Dashboard simples e visual.",
    color: "primary",
  },
  {
    icon: Split,
    title: "Separação Automática de Gastos",
    description: "Categorize receitas e despesas automaticamente. Pessoa física separada da empresa.",
    color: "accent",
  },
  {
    icon: BellRing,
    title: "Lembretes de Pagamentos",
    description: "Nunca mais esqueça de cobrar um cliente. Receba alertas de contas a pagar e receber.",
    color: "primary",
  },
];

const Features = () => {
  return (
    <section id="funcionalidades" className="section-padding">
      <div className="container-narrow mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            A Solução
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ferramentas simples e poderosas feitas especialmente para o dia a dia do MEI.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-8 h-full hover:scale-105 transition-all duration-300">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    feature.color === "primary"
                      ? "bg-primary/10"
                      : "bg-accent/10"
                  }`}
                >
                  <feature.icon
                    className={`w-7 h-7 ${
                      feature.color === "primary" ? "text-primary" : "text-accent"
                    }`}
                  />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <a
                  href="#cta-final"
                  className="inline-flex items-center text-primary font-medium group-hover:gap-2 transition-all"
                >
                  Saiba mais
                  <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
