import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, Calendar, Briefcase, MessageSquare, HelpCircle } from "lucide-react";
import { Scale, Heart, Brain, Wallet, Dumbbell, Shield, Dog, Sparkles, Bot, Sprout, Stethoscope, TrendingUp, ShieldCheck, PawPrint, Home, Palette } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { services, experts, Expert } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

const iconMap: Record<string, React.ElementType> = {
  Scale, Heart, Brain, Wallet, Dumbbell, Shield, Dog, Sparkles, Bot, Sprout,
  Stethoscope, TrendingUp, ShieldCheck, PawPrint, Home, Palette,
};

type FilterType = "all" | "online" | "top";

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "online", label: "Онлайн" },
  { id: "top", label: "Топ рейтинг" },
];

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const service = services.find(s => s.id === id);
  const serviceExperts = experts[id || ""] || [];

  // Filter and sort experts
  const filteredExperts = useMemo(() => {
    let result = [...serviceExperts];
    
    if (activeFilter === "online") {
      result = result.filter(e => e.available);
    } else if (activeFilter === "top") {
      result = result.sort((a, b) => b.rating - a.rating);
    }
    
    return result;
  }, [serviceExperts, activeFilter]);

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Сервис не найден</p>
      </div>
    );
  }

  const Icon = iconMap[service.icon] || HelpCircle;

  const handleExpertClick = (expert: Expert) => {
    navigate(`/service/${id}/expert/${expert.id}`);
  };

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

      {/* Filters */}
      <div className="px-4 mt-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeFilter === filter.id
                  ? "gradient-primary text-primary-foreground"
                  : "glass text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Experts */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Эксперты</h3>
          <span className="text-sm text-muted-foreground">
            {filteredExperts.length} специалистов
          </span>
        </div>
        
        {filteredExperts.length > 0 ? (
          <div className="space-y-3">
            {filteredExperts.map((expert, index) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="glass-card p-4 cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={() => handleExpertClick(expert)}
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16 border-2 border-primary/30">
                      <AvatarImage src={expert.avatar} alt={expert.name} />
                      <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    {expert.available && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{expert.name}</h4>
                        <p className="text-sm text-muted-foreground">{expert.specialty}</p>
                      </div>
                      <div className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium flex-shrink-0",
                        expert.available 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {expert.available ? "Онлайн" : "Офлайн"}
                      </div>
                    </div>
                    
                    {/* Stats row */}
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-foreground">{expert.rating}</span>
                        <span className="text-muted-foreground">({expert.reviews})</span>
                      </div>
                      {expert.experience && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>{expert.experience}</span>
                        </div>
                      )}
                      {expert.consultations && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{expert.consultations}+</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Price and next slot */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-medium text-primary">{expert.price}</span>
                      {expert.available && expert.nextSlot && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Ближайший: {expert.nextSlot}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                {expert.available && (
                  <div className="mt-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExpertClick(expert);
                      }}
                    >
                      <Calendar className="w-4 h-4" />
                      Записаться
                    </Button>
                    <Button 
                      className="flex-1 gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExpertClick(expert);
                      }}
                    >
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
              {activeFilter === "online" 
                ? "Нет экспертов онлайн. Попробуйте позже."
                : "Эксперты скоро появятся. Пока воспользуйтесь AI-ассистентом."}
            </p>
            <Button 
              className="mt-4"
              onClick={() => navigate(`/chat?service=${id}`)}
            >
              Открыть AI-чат
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
