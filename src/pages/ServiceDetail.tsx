import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, Calendar } from "lucide-react";
import { Scale, Heart, Brain, Wallet, Dumbbell, Shield, Dog, Sparkles, Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { services, experts } from "@/data/mockData";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Scale, Heart, Brain, Wallet, Dumbbell, Shield, Dog, Sparkles, Bot,
};

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const service = services.find(s => s.id === id);
  const serviceExperts = experts[id || ""] || [];

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Сервис не найден</p>
      </div>
    );
  }

  const Icon = iconMap[service.icon];

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 px-4 py-4 safe-top"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="p-2 rounded-full glass"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <h1 className="text-xl font-bold text-foreground">{service.name}</h1>
      </motion.header>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-4 p-6 rounded-3xl gradient-primary relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="relative flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
            <Icon className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{service.name}</h2>
            <p className="text-white/80 mt-1">{service.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Experts */}
      <div className="px-4 mt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Эксперты</h3>
        
        {serviceExperts.length > 0 ? (
          <div className="space-y-3">
            {serviceExperts.map((expert, index) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 border-2 border-primary/30">
                    <AvatarImage src={expert.avatar} alt={expert.name} />
                    <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{expert.name}</h4>
                    <p className="text-sm text-muted-foreground">{expert.specialty}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium text-foreground">{expert.rating}</span>
                        <span className="text-xs text-muted-foreground">({expert.reviews})</span>
                      </div>
                      <span className="text-sm font-medium text-primary">{expert.price}</span>
                    </div>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    expert.available 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-red-500/20 text-red-400"
                  )}>
                    {expert.available ? "Онлайн" : "Офлайн"}
                  </div>
                </div>

                {expert.available && (
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Calendar className="w-4 h-4" />
                      Записаться
                    </Button>
                    <Button className="flex-1 gap-2">
                      <Clock className="w-4 h-4" />
                      Сейчас
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground">
              Эксперты скоро появятся. Пока воспользуйтесь AI-ассистентом.
            </p>
            <Button 
              className="mt-4"
              onClick={() => navigate("/chat")}
            >
              Открыть AI-чат
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
