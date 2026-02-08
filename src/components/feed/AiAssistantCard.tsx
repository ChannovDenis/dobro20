import { Bot, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function AiAssistantCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate("/chat")}
      className="mx-4 p-5 rounded-3xl gradient-primary cursor-pointer relative overflow-hidden"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/40 blur-2xl" />
      
      <div className="relative flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-foreground/20 backdrop-blur-sm">
          <Bot className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-primary-foreground">Добросервис AI</h3>
            <Sparkles className="w-4 h-4 text-accent-foreground" />
          </div>
          <p className="text-sm text-primary-foreground/80">
            Задайте любой вопрос — получите экспертный ответ
          </p>
        </div>
        
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="p-2 rounded-full bg-foreground/20"
        >
          <ArrowRight className="w-5 h-5 text-primary-foreground" />
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-foreground/10 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-secondary/30 blur-2xl" />
    </motion.div>
  );
}
