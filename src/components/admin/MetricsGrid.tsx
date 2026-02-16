import { motion } from "framer-motion";
import { Users, MessageSquare, Calendar, TrendingUp } from "lucide-react";

const METRICS = [
  {
    id: "dau",
    label: "DAU",
    value: "1,234",
    change: "+12%",
    positive: true,
    icon: Users,
  },
  {
    id: "ai_requests",
    label: "AI-обращения",
    value: "8,567",
    change: "+24%",
    positive: true,
    icon: MessageSquare,
  },
  {
    id: "bookings",
    label: "Записи",
    value: "342",
    change: "+8%",
    positive: true,
    icon: Calendar,
  },
  {
    id: "conversion",
    label: "Конверсия",
    value: "4.2%",
    change: "-0.3%",
    positive: false,
    icon: TrendingUp,
  },
];

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {METRICS.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                metric.positive 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-destructive/20 text-destructive"
              }`}>
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{metric.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
