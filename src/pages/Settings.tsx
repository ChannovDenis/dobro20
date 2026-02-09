import { motion } from "framer-motion";
import { 
  Crown, Bell, Shield, Info, LogOut,
  Moon, Globe, Trash2, ExternalLink,
  Instagram, Send, Palette, BarChart3, User
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/layout/BottomNav";
import { ProfileHeader } from "@/components/settings/ProfileHeader";
import { SuperAppGrid } from "@/components/settings/SuperAppGrid";
import { SettingsSection, SettingsItem } from "@/components/settings/SettingsSection";
import { ThemeSwitcher } from "@/components/settings/ThemeSwitcher";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    promotions: true,
  });

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Ошибка при выходе');
    } else {
      toast.success('Вы вышли из аккаунта');
      navigate('/auth', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Profile Hero */}
      <ProfileHeader />

      {/* SuperApp Grid */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground px-4 mb-3">
          Сервисы
        </h3>
        <SuperAppGrid />
      </div>

      {/* Settings Sections */}
      <div className="space-y-3 px-4">
        {/* Subscription */}
        <SettingsSection icon={<Crown className="w-5 h-5" />} title="Подписка">
          <SettingsItem label="Премиум статус" value="Активна" />
          <SettingsItem label="Продлить подписку" />
          <SettingsItem label="История платежей" />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection icon={<Bell className="w-5 h-5" />} title="Уведомления" defaultOpen>
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
        </SettingsSection>

        {/* Security */}
        <SettingsSection icon={<Shield className="w-5 h-5" />} title="Безопасность">
          <SettingsItem label="Сменить пароль" />
          <SettingsItem label="Активные устройства" value="2" />
          <SettingsItem label="Двухфакторная аутентификация" />
        </SettingsSection>

        {/* Theme */}
        <SettingsSection icon={<Palette className="w-5 h-5" />} title="Тема оформления" defaultOpen>
          <ThemeSwitcher />
        </SettingsSection>

        {/* Partner Admin */}
        <SettingsSection icon={<BarChart3 className="w-5 h-5" />} title="Партнёрам">
          <SettingsItem 
            label="Панель партнёра" 
            action={<ExternalLink className="w-4 h-4 text-muted-foreground" />}
            onClick={() => navigate('/admin')}
          />
        </SettingsSection>

        {/* App Settings */}
        <SettingsSection icon={<Moon className="w-5 h-5" />} title="Приложение">
          <SettingsItem 
            label="Язык" 
            value="Русский" 
            action={<Globe className="w-4 h-4 text-muted-foreground" />}
          />
          <SettingsItem 
            label="Очистить кэш" 
            action={<Trash2 className="w-4 h-4 text-muted-foreground" />}
          />
        </SettingsSection>

        {/* About */}
        <SettingsSection icon={<Info className="w-5 h-5" />} title="О приложении">
          <SettingsItem label="Версия" value="1.0.0" />
          <SettingsItem 
            label="Политика конфиденциальности" 
            action={<ExternalLink className="w-4 h-4 text-muted-foreground" />}
          />
          <SettingsItem 
            label="Условия использования" 
            action={<ExternalLink className="w-4 h-4 text-muted-foreground" />}
          />
        </SettingsSection>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4 py-4"
        >
          <button className="p-3 rounded-full glass text-muted-foreground hover:text-foreground transition-colors">
            <Instagram className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-full glass text-muted-foreground hover:text-foreground transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Auth Section */}
        {user ? (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full glass-card p-4 flex items-center justify-center gap-2 text-destructive"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Выйти из аккаунта</span>
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/auth')}
            className="w-full glass-card p-4 flex items-center justify-center gap-2 text-primary"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Войти в аккаунт</span>
          </motion.button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
