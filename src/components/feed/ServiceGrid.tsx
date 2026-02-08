import { Scale, Heart, Brain, Wallet, Dumbbell, Shield, Dog, Sparkles, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { services } from "@/data/mockData";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Scale,
  Heart,
  Brain,
  Wallet,
  Dumbbell,
  Shield,
  Dog,
  Sparkles,
  Bot,
};

export function ServiceGrid() {
  const navigate = useNavigate();

  return (
    <div className="px-4">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Сервисы</h2>
      <div className="grid grid-cols-3 gap-3">
        {services.map((service, index) => {
          const Icon = iconMap[service.icon];
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/service/${service.id}`)}
              className={cn(
                "glass-card p-4 flex flex-col items-center gap-2 cursor-pointer",
                "hover:border-primary/50 transition-colors"
              )}
            >
              <div className={cn(
                "p-3 rounded-2xl",
                `bg-category-${service.color}`
              )}>
                <Icon className={cn(
                  "w-6 h-6",
                  `text-category-${service.color}`
                )} />
              </div>
              <span className="text-xs font-medium text-foreground text-center">
                {service.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
