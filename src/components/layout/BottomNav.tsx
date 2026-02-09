import { Home, MessageCircle, Grid3X3 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ActiveFeedContext } from "@/pages/Feed";

interface BottomNavProps {
  activeFeedItem?: ActiveFeedContext | null;
}

const navItems = [
  { icon: Home, label: "Лента", path: "/feed" },
  { icon: MessageCircle, label: "Чат", path: "/chat", special: true },
  { icon: Grid3X3, label: "Сервисы", path: "/services" },
];

export function BottomNav({ activeFeedItem }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (item: typeof navItems[0]) => {
    // Special handling for Chat button when on Feed page with active item
    if (item.path === "/chat" && location.pathname === "/feed" && activeFeedItem) {
      const prompt = `Расскажи подробнее про: ${activeFeedItem.title}`;
      navigate(`/chat?prompt=${encodeURIComponent(prompt)}&context=${encodeURIComponent(activeFeedItem.title)}`);
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-t-3xl safe-bottom">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          // Special styling for Chat button (center-left position now)
          if (item.special) {
            return (
              <motion.button
                key={item.path}
                onClick={() => handleNavClick(item)}
                className="relative -mt-6"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                  className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg glow"
                >
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </motion.div>
                <span className={cn(
                  "text-xs font-medium block text-center mt-1",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.path}
              onClick={() => handleNavClick(item)}
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
