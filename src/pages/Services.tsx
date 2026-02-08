import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Scale, Heart, Brain, Wallet, Dumbbell, Shield, 
  Dog, Sparkles, FileText, Calculator, Bot, Settings,
  ChevronRight, Crown, Bell, Gift, TrendingUp, Zap,
  CreditCard, QrCode, Percent, Star, ArrowRight, X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { userProfile, services } from "@/data/mockData";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Scale, Heart, Brain, Wallet, Dumbbell, Shield, Dog, Sparkles, FileText, Calculator, Bot, Settings,
};

// Featured promotions (business value)
const promotions = [
  {
    id: "premium",
    title: "Премиум на 30 дней",
    subtitle: "Попробуй бесплатно",
    icon: Crown,
    gradient: "from-amber-500 to-orange-600",
    action: "Активировать",
  },
  {
    id: "referral",
    title: "Пригласи друга",
    subtitle: "Получи 500₽ на счёт",
    icon: Gift,
    gradient: "from-pink-500 to-rose-600",
    action: "Поделиться",
  },
];

// Quick actions (user value)
const quickActions = [
  { id: "scan", icon: QrCode, label: "Сканер", color: "primary" },
  { id: "pay", icon: CreditCard, label: "Оплата", color: "finance" },
  { id: "cashback", icon: Percent, label: "Кэшбэк", color: "wellness" },
  { id: "bonus", icon: Star, label: "Бонусы", color: "style" },
];

// Service categories
const categories = [
  { id: "popular", label: "Популярное", services: ["lawyer", "doctor", "psychologist"] },
  { id: "finance", label: "Финансы", services: ["finance", "security"] },
  { id: "lifestyle", label: "Образ жизни", services: ["wellness", "stylist", "vet"] },
];

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto pb-8">
      {/* Modal Header with close button */}
      <header className="sticky top-0 z-10 px-4 pt-4 pb-2 safe-top bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <Avatar className="w-10 h-10 border-2 border-primary/30">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs text-muted-foreground">Привет,</p>
              <h1 className="text-sm font-bold text-foreground">{userProfile.name.split(" ")[0]}</h1>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full glass relative"
            >
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/settings")}
              className="p-2 rounded-full glass"
            >
              <Settings className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Promotions carousel (business value) */}
      <section className="px-4 py-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {promotions.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex-shrink-0 w-[280px] p-4 rounded-2xl bg-gradient-to-br",
                  promo.gradient
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-xl bg-white/20">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full text-xs"
                  >
                    {promo.action}
                  </Button>
                </div>
                <h3 className="text-lg font-bold text-white">{promo.title}</h3>
                <p className="text-sm text-white/80">{promo.subtitle}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Quick actions (user value) */}
      <section className="px-4 py-2">
        <div className="flex justify-around glass-card p-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2"
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  `bg-category-${action.color}`
                )}>
                  <Icon className={cn("w-5 h-5", `text-category-${action.color}`)} />
                </div>
                <span className="text-xs font-medium text-foreground">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* AI Assistant promo */}
      <section className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/chat")}
          className="glass-card p-4 flex items-center gap-4 cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center glow">
            <Zap className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground">AI-ассистент</h3>
            <p className="text-sm text-muted-foreground">Ответит на любой вопрос за секунды</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Service categories */}
      {categories.map((category, catIndex) => (
        <section key={category.id} className="px-4 py-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: catIndex * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-muted-foreground">{category.label}</h2>
              <button className="text-xs text-primary font-medium">Все</button>
            </div>
            
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {category.services.map((serviceId, index) => {
                const service = services.find(s => s.id === serviceId);
                if (!service) return null;
                
                const IconComponent = iconMap[service.icon] || Bot;
                
                return (
                  <motion.button
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/service/${service.id}`)}
                    className="flex-shrink-0 glass-card p-4 w-[140px] text-left"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                      `bg-category-${service.color}`
                    )}>
                      <IconComponent className={cn("w-5 h-5", `text-category-${service.color}`)} />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{service.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{service.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </section>
      ))}

      {/* Stats / Achievements (engagement) */}
      <section className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Твоя активность</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground">Консультаций</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">₽2,340</p>
              <p className="text-xs text-muted-foreground">Сэкономлено</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">47</p>
              <p className="text-xs text-muted-foreground">Дней с нами</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
