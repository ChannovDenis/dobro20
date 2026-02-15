import { motion } from "framer-motion";
import { MessageSquare, AlertTriangle, ThumbsUp, Clock, LucideIcon } from "lucide-react";
import { dashboardMetrics } from "@/data/tenantMetrics";
import { useTenant } from "@/hooks/useTenant";

interface MetricCard {
  id: string;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
}

function buildMetrics(tenantId: string): MetricCard[] {
  const m = dashboardMetrics[tenantId] ?? dashboardMetrics.dobroservice;
  return [
    {
      id: 'aiRequests',
      label: 'AI-обращения',
      value: m.aiRequests.value.toLocaleString('ru-RU'),
      change: `${m.aiRequests.change > 0 ? '+' : ''}${m.aiRequests.change}%`,
      positive: m.aiRequests.change > 0,
      icon: MessageSquare,
    },
    {
      id: 'escalations',
      label: 'Эскалации',
      value: m.escalations.value.toLocaleString('ru-RU'),
      change: `${m.escalations.change > 0 ? '+' : ''}${m.escalations.change}%`,
      positive: m.escalations.change < 0, // fewer escalations = good
      icon: AlertTriangle,
    },
    {
      id: 'nps',
      label: 'NPS',
      value: `${m.nps.value}%`,
      change: `${m.nps.change > 0 ? '+' : ''}${m.nps.change}%`,
      positive: m.nps.change > 0,
      icon: ThumbsUp,
    },
    {
      id: 'avgTime',
      label: 'Ср. время',
      value: `${m.avgTime.value} мин`,
      change: `${m.avgTime.change > 0 ? '+' : ''}${m.avgTime.change}%`,
      positive: m.avgTime.change < 0, // less time = good
      icon: Clock,
    },
  ];
}

export function MetricsGrid() {
  const { tenantId } = useTenant();
  const metrics = buildMetrics(tenantId ?? 'dobroservice');

  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((metric, index) => {
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
