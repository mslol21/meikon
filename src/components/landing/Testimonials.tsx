import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marina Costa",
    role: "Confeiteira • São Paulo",
    avatar: "MC",
    content:
      "Antes eu usava caderninho e vivia perdida. Com o FinMEI, sei exatamente quanto lucro por encomenda. Já aumentei meu faturamento em 40%!",
    rating: 5,
  },
  {
    name: "Carlos Eduardo",
    role: "Eletricista • Rio de Janeiro",
    avatar: "CE",
    content:
      "Finalmente separei o dinheiro da empresa do meu. Os lembretes de cobrança me fizeram recuperar quase R$ 2.000 de clientes que tinham esquecido de pagar.",
    rating: 5,
  },
  {
    name: "Juliana Mendes",
    role: "Designer Freelancer • Belo Horizonte",
    avatar: "JM",
    content:
      "Simples de usar e faz exatamente o que promete. Em 5 minutos eu estava cadastrando minhas primeiras receitas. Recomendo demais!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-narrow mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mais de 2.000 MEIs já transformaram suas finanças com o FinMEI.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-card rounded-2xl p-8 h-full border border-border hover:shadow-lg transition-shadow relative">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-star fill-star"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground mb-6 relative z-10">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
