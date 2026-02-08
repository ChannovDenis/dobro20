import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { FeedItem, services, miniApps } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PromoCardProps {
  item: FeedItem;
  isActive: boolean;
}

export function PromoCard({ item, isActive }: PromoCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (item.type === "service-promo" && item.serviceId) {
      navigate(`/service/${item.serviceId}`);
    } else if (item.type === "miniapp-promo" && item.miniAppId) {
      navigate(`/mini-app/${item.miniAppId}`);
    }
  };

  const targetService = item.serviceId 
    ? services.find(s => s.id === item.serviceId)
    : null;
  const targetMiniApp = item.miniAppId 
    ? miniApps.find(m => m.id === item.miniAppId)
    : null;

  return (
    <div className="relative h-[100dvh] w-full snap-start snap-always flex-shrink-0">
      {/* Background Image with stronger overlay */}
      <div className="absolute inset-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
      </div>

      {/* Promo badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        className="absolute top-20 left-4 z-10"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full gradient-primary">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
          <span className="text-xs font-bold text-primary-foreground uppercase tracking-wide">
            {item.type === "service-promo" ? "Сервис" : "Приложение"}
          </span>
        </div>
      </motion.div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mb-6 glow"
        >
          {targetMiniApp ? (
            <span className="text-4xl">{targetMiniApp.icon}</span>
          ) : (
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          )}
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-4"
        >
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium rounded-full glass"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Title and description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
          className="max-w-sm"
        >
          <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight">
            {item.title}
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            {item.description}
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleClick}
            size="lg"
            className="gradient-primary text-primary-foreground font-semibold px-8 py-6 rounded-2xl glow"
          >
            {item.ctaText || "Открыть"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
