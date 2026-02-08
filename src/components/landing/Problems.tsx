import { motion } from "framer-motion";
import { HelpCircle, Shuffle, Bell } from "lucide-react";

const problems = [
  {
    icon: HelpCircle,
    title: "Não sei quanto dinheiro tenho no caixa",
    description: "Você perde horas tentando descobrir se pode fazer uma compra ou pagar um fornecedor.",
  },
  {
    icon: Shuffle,
    title: "Misturo gastos pessoais e da empresa",
    description: "Aquele almoço foi despesa ou dinheiro seu? No fim do mês, vira uma bagunça.",
  },
  {
    icon: Bell,
    title: "Esqueço de cobrar clientes",
    description: "Clientes atrasam pagamentos e você só descobre quando precisa do dinheiro.",
  },
];

const Problems = () => {
  return (
    <section id="problemas" className="section-padding bg-secondary/30">
      <div className="container-narrow mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            O Problema
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Se identificou com algum desses?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Você não está sozinho. 8 em cada 10 MEIs enfrentam esses problemas todos os dias.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-2xl p-8 h-full border border-border hover:border-destructive/30 transition-all duration-300 hover:shadow-lg">
                <div className="w-14 h-14 bg-destructive/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <problem.icon className="w-7 h-7 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problems;
