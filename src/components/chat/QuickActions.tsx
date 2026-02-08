import { motion } from "framer-motion";
import { quickActions } from "@/data/mockData";

interface QuickActionsProps {
  onActionClick: (prompt: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="px-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Быстрые действия</h3>
      <div className="grid grid-cols-3 gap-2">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onActionClick(action.prompt)}
            className="glass-card p-3 flex flex-col items-center gap-2 text-center"
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-xs font-medium text-foreground">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
