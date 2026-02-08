import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como funciona o teste grátis?",
    answer:
      "Você tem 14 dias para testar todas as funcionalidades do plano PRO sem pagar nada. Não pedimos cartão de crédito. Depois, você escolhe se quer continuar no PRO ou usar o plano Gratuito com até 20 transações por mês.",
  },
  {
    question: "Preciso de conhecimento técnico?",
    answer:
      "De jeito nenhum! O FinMEI foi feito para ser simples. Se você sabe usar o WhatsApp, vai saber usar o FinMEI. Em 5 minutos você já está cadastrando suas primeiras transações.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim! Usamos a mesma tecnologia de segurança dos grandes bancos. Seus dados são criptografados e armazenados em servidores seguros. Ninguém além de você tem acesso às suas informações financeiras.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer:
      "Claro! Não tem fidelidade, multa ou burocracia. Você cancela direto pelo app em 2 cliques. Seus dados ficam salvos por 30 dias caso você mude de ideia.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="section-padding">
      <div className="container-narrow mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tire suas dúvidas sobre o FinMEI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left text-lg font-medium text-foreground hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
