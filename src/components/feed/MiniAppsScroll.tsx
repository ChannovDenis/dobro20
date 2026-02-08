import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { miniApps } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function MiniAppsScroll() {
  const navigate = useNavigate();

  return (
    <div className="px-4">
      <h2 className="text-lg font-semibold mb-4 text-foreground">AI Мини-приложения</h2>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {miniApps.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/mini-app/${app.id}`)}
            className={cn(
              "glass-card p-4 flex-shrink-0 w-32 cursor-pointer",
              "hover:border-primary/50 transition-colors"
            )}
          >
            <div className="text-3xl mb-2">{app.icon}</div>
            <h3 className="text-sm font-medium text-foreground mb-1">{app.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{app.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
