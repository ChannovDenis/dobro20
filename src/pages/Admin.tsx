import { motion } from "framer-motion";
import { 
  ArrowLeft, TrendingUp, BarChart3, AlertTriangle, ShieldX, Loader2
} from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { MetricsGrid } from "@/components/admin/MetricsGrid";
import { ActivityChart } from "@/components/admin/ActivityChart";
import { TopServicesTable } from "@/components/admin/TopServicesTable";
import { RecentEscalations } from "@/components/admin/RecentEscalations";
import { useTenant } from "@/hooks/useTenant";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function Admin() {
  const navigate = useNavigate();
  const { tenant } = useTenant();
  const { user, isLoading, isAdmin, error } = useAdminAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Not authorized - show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Доступ запрещён</h2>
          <p className="text-muted-foreground mb-6">
            У вас нет прав для просмотра панели партнёра. Обратитесь к администратору.
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium"
          >
            Вернуться на главную
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-sm">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="text-primary underline"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

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
            Активность за месяц
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
