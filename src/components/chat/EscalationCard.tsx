import { motion } from "framer-motion";
import { User, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { experts } from "@/data/mockData";
import { EscalationData } from "@/types/chat";

interface EscalationCardProps {
  data: EscalationData;
}

export function EscalationCard({ data }: EscalationCardProps) {
  const navigate = useNavigate();
  
  // Get first available expert for this service
  const serviceExperts = experts[data.serviceId] || [];
  const availableExpert = serviceExperts.find(e => e.available) || serviceExperts[0];
  
  if (!availableExpert) return null;

  const handleClick = () => {
    navigate(`/service/${data.serviceId}`);
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="w-full mt-3 p-3 glass rounded-xl hover:bg-primary/10 transition-colors text-left"
    >
      <div className="flex items-center gap-3">
        {/* Expert avatar */}
        <div className="relative flex-shrink-0">
          <img 
            src={availableExpert.avatar} 
            alt={availableExpert.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {availableExpert.available && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-background" />
          )}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="text-sm font-medium text-foreground truncate">
              Записаться к {getExpertTitle(data.serviceId)}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-primary font-medium">
              от {availableExpert.priceChat || availableExpert.price}
            </span>
            {availableExpert.nextSlot && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Сегодня {availableExpert.nextSlot}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Arrow */}
        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      </div>
    </motion.button>
  );
}

function getExpertTitle(serviceId: string): string {
  const titles: Record<string, string> = {
    lawyer: "юристу",
    doctor: "врачу",
    psychologist: "психологу",
    finance: "финансисту",
    garden: "агроному",
    vet: "ветеринару",
    stylist: "стилисту",
    security: "эксперту",
  };
  return titles[serviceId] || "эксперту";
}
