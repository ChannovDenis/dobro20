import { motion } from "framer-motion";
import { ActionButton } from "@/types/chat";

interface ActionButtonsProps {
  buttons: ActionButton[];
  onAction: (action: string) => void;
  disabled?: boolean;
}

export function ActionButtons({ buttons, onAction, disabled }: ActionButtonsProps) {
  if (!buttons.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 mt-3"
    >
      {buttons.map((button, index) => (
        <motion.button
          key={button.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onAction(button.action)}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            transition-all duration-200 disabled:opacity-50
            ${button.variant === "primary"
              ? "gradient-primary text-primary-foreground shadow-lg"
              : "glass text-foreground hover:bg-secondary/50"
            }
          `}
        >
          <span>{button.icon}</span>
          <span>{button.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
