import { motion } from "framer-motion";
import { 
  User, Bell, Shield, Info, ChevronRight, 
  Crown, Settings as SettingsIcon, LogOut 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/layout/BottomNav";
import { userProfile, services } from "@/data/mockData";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Settings() {
  const [enabledServices, setEnabledServices] = useState<string[]>(
    services.map(s => s.id)
  );
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    promotions: true,
  });

  const toggleService = (serviceId: string) => {
    setEnabledServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-4 safe-top"
      >
        <h1 className="text-2xl font-bold text-foreground">Настройки</h1>
      </motion.header>

      <div className="space-y-6 px-4">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary/30">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">{userProfile.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-primary">{userProfile.subscription}</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </motion.div>

        {/* Services Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            Управление сервисами
          </h3>
          <div className="glass-card divide-y divide-border">
            {services.slice(0, 5).map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4">
                <span className="text-sm font-medium text-foreground">{service.name}</span>
                <Switch
                  checked={enabledServices.includes(service.id)}
                  onCheckedChange={() => toggleService(service.id)}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Уведомления
          </h3>
          <div className="glass-card divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-medium text-foreground">Push-уведомления</span>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-medium text-foreground">Email-рассылка</span>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-medium text-foreground">Акции и скидки</span>
              <Switch
                checked={notifications.promotions}
                onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
              />
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Безопасность
          </h3>
          <div className="glass-card divide-y divide-border">
            <button className="flex items-center justify-between p-4 w-full text-left">
              <span className="text-sm font-medium text-foreground">Сменить пароль</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="flex items-center justify-between p-4 w-full text-left">
              <span className="text-sm font-medium text-foreground">Устройства</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            О приложении
          </h3>
          <div className="glass-card divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-medium text-foreground">Версия</span>
              <span className="text-sm text-muted-foreground">1.0.0</span>
            </div>
            <button className="flex items-center justify-between p-4 w-full text-left">
              <span className="text-sm font-medium text-foreground">Политика конфиденциальности</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="flex items-center justify-between p-4 w-full text-left">
              <span className="text-sm font-medium text-foreground">Условия использования</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
          className="w-full glass-card p-4 flex items-center justify-center gap-2 text-destructive"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Выйти из аккаунта</span>
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
