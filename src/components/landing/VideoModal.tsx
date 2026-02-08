import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal = ({ isOpen, onClose }: VideoModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-card rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-foreground/20 hover:bg-foreground/30 text-white"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Video placeholder */}
            <div className="aspect-video bg-foreground flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-primary/30 transition-colors">
                  <Play className="w-10 h-10 text-primary fill-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Veja como o FinMEI funciona
                </h3>
                <p className="text-white/60">
                  Vídeo demonstrativo em breve
                </p>
              </div>
            </div>

            {/* Modal content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Controle financeiro descomplicado
              </h3>
              <p className="text-muted-foreground">
                Em 2 minutos, você vai entender como o FinMEI pode transformar a gestão do seu negócio.
                Cadastre receitas, acompanhe despesas e nunca mais perca o controle do seu caixa.
              </p>
              <div className="mt-4 flex gap-4">
                <Button className="btn-shadow" asChild>
                  <a href="#cta-final" onClick={onClose}>
                    Começar Grátis
                  </a>
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Fechar
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
