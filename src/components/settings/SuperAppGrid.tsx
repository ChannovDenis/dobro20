import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Scale, Heart, Brain, Wallet, Dumbbell, Shield, 
  Dog, Sparkles, FileText, Calculator, Bot, Settings 
} from "lucide-react";
import { superAppItems } from "@/data/mockData";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Scale,
  Heart,
  Brain,
  Wallet,
  Dumbbell,
  Shield,
  Dog,
  Sparkles,
  FileText,
  Calculator,
  Bot,
  Settings,
};

export function SuperAppGrid() {
  const navigate = useNavigate();

  const handleItemClick = (id: string) => {
    if (id === "settings") return;
    if (["documents", "calculator"].includes(id)) {
      // These could be mini-apps
      navigate(`/mini-app/${id}`);
    } else {
      navigate(`/service/${id}`);
    }
  };

  return (
    <div className="px-4 pb-6">
      <div className="grid grid-cols-4 gap-3">
        {superAppItems.map((item, index) => {
          const IconComponent = iconMap[item.icon] || Bot;
          
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleItemClick(item.id)}
              className="flex flex-col items-center gap-2 p-3"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center",
                `bg-category-${item.color}`
              )}>
                <IconComponent className={cn(
                  "w-6 h-6",
                  `text-category-${item.color}`
                )} />
              </div>
              <span className="text-xs font-medium text-foreground text-center leading-tight">
                {item.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
