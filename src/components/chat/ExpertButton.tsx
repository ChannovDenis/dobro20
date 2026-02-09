import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { experts } from "@/data/mockData";

interface ExpertButtonProps {
  serviceId: string | null;
}

export function ExpertButton({ serviceId }: ExpertButtonProps) {
  const navigate = useNavigate();
  
  if (!serviceId) return null;
  
  const serviceExperts = experts[serviceId] || [];
  const availableCount = serviceExperts.filter(e => e.available).length;
  
  const handleClick = () => {
    navigate(`/service/${serviceId}`);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
    >
      <User className="w-3.5 h-3.5 text-primary" />
      <span className="text-xs font-medium text-primary">
        {availableCount > 0 ? `${availableCount} онлайн` : "Эксперт"}
      </span>
    </motion.button>
  );
}
