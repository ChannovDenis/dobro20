import { motion } from "framer-motion";
import { quickActions } from "@/data/mockData";

interface QuickActionsProps {
  onActionClick: (prompt: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center px-4">
      {quickActions.map((action, index) => (
        <motion.button
          key={action.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onActionClick(action.prompt)}
          className="px-4 py-2 rounded-full glass text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
        >
          {action.label}
        </motion.button>
      ))}
    </div>
  );
}
