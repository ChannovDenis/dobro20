import { motion } from "framer-motion";
import { 
  ArrowLeft, Users, MessageSquare, Calendar, TrendingUp,
  BarChart3, Clock, AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MetricsGrid } from "@/components/admin/MetricsGrid";
import { ActivityChart } from "@/components/admin/ActivityChart";
import { TopServicesTable } from "@/components/admin/TopServicesTable";
import { RecentEscalations } from "@/components/admin/RecentEscalations";
import { useTenant } from "@/hooks/useTenant";

export default function Admin() {
  const navigate = useNavigate();
  const { tenant } = useTenant();

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 px-4 py-4 safe-top border-b border-border/30"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="p-2 rounded-full glass"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <div>
          <h1 className="text-lg font-bold text-foreground">Панель партнёра</h1>
          <p className="text-xs text-muted-foreground">{tenant?.name || "Добросервис"}</p>
        </div>
      </motion.header>

      <div className="px-4 space-y-6 mt-4">
        {/* Metrics Grid */}
        <MetricsGrid />

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Активность за неделю
          </h2>
          <ActivityChart />
        </motion.div>

        {/* Top Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Популярные сервисы
          </h2>
          <TopServicesTable />
        </motion.div>

        {/* Recent Escalations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            Последние эскалации
          </h2>
          <RecentEscalations />
        </motion.div>
      </div>
    </div>
  );
}
