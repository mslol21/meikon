import { motion } from "framer-motion";
import { PlusCircle, BarChart3, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: PlusCircle,
    step: "01",
    title: "Cadastre suas receitas e despesas",
    description: "Em poucos cliques, registre tudo que entra e sai. Simples como anotar no papel.",
  },
  {
    icon: BarChart3,
    step: "02",
    title: "Visualize gráficos automáticos",
    description: "Veja claramente para onde vai seu dinheiro com gráficos fáceis de entender.",
  },
  {
    icon: Lightbulb,
    step: "03",
    title: "Tome decisões baseadas em dados reais",
    description: "Saiba o momento certo de investir, economizar ou fazer aquela compra importante.",
  },
];

const HowItWorks = () => {
  return (
    <section className="section-padding bg-primary text-primary-foreground overflow-hidden">
      <div className="container-narrow mx-auto relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 relative z-10"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            Como Funciona
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            3 passos para o controle total
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Comece em menos de 5 minutos e veja resultados imediatos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-white/20" />
              )}

              <div className="text-center">
                <div className="relative inline-flex mb-6">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <step.icon className="w-10 h-10" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-primary-foreground/80">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
