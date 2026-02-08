import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const FinalCTA = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail("");
    
    toast({
      title: "Conta criada com sucesso! 🎉",
      description: "Enviamos um email com as instruções de acesso.",
    });
  };

  return (
    <section
      id="cta-final"
      className="section-padding relative overflow-hidden"
      style={{ background: "var(--gradient-primary)" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Comece a Organizar Suas Finanças Hoje
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-10">
            Junte-se a mais de 2.000 MEIs que já transformaram sua gestão financeira. 
            Grátis por 14 dias, sem cartão de crédito.
          </p>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Você está na lista! 🎉
              </h3>
              <p className="text-white/80">
                Verifique seu email para acessar sua conta.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Seu melhor email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-14 px-6 text-lg bg-white border-0 text-foreground placeholder:text-muted-foreground"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 text-lg bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    Criar Conta Grátis
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          )}

          <p className="text-white/60 text-sm mt-6">
            Ao se cadastrar, você concorda com nossos{" "}
            <a href="#" className="underline hover:text-white">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="#" className="underline hover:text-white">
              Política de Privacidade
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
