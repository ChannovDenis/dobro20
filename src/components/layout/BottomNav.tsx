import { Home, MessageCircle, LayoutGrid, Bot } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Лента", path: "/feed" },
  { icon: MessageCircle, label: "Чаты", path: "/chats" },
  { icon: Bot, label: "", path: "/chat", special: true },
  { icon: LayoutGrid, label: "Сервисы", path: "/services" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-t-3xl safe-bottom">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.special) {
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative -mt-6"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                  className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg glow"
                >
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </motion.div>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Icon className="w-6 h-6" />
              </motion.div>
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
