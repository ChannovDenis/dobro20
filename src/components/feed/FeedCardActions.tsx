import { motion } from "framer-motion";
import { Bot, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Map feed item tags to service types
const tagToServiceType: Record<string, string> = {
  "Сад": "garden",
  "Рассада": "garden",
  "Перец": "garden",
  "Семена": "garden",
  "ЗОЖ": "wellness",
  "Фитнес": "wellness",
  "Йога": "wellness",
  "Питание": "wellness",
  "Рецепт": "wellness",
  "Здоровье": "doctor",
  "Сон": "doctor",
  "Безопасность": "security",
  "Советы": "assistant",
  "Право": "lawyer",
  "Лайфхак": "lawyer",
  "Инструкция": "lawyer",
  "Психология": "psychologist",
  "Медитация": "psychologist",
  "Саморазвитие": "psychologist",
  "Финансы": "finance",
  "Инвестиции": "finance",
  "Питомцы": "vet",
};

interface FeedCardActionsProps {
  isActive: boolean;
  title: string;
  tags: string[];
}

export function FeedCardActions({ isActive, title, tags }: FeedCardActionsProps) {
  const navigate = useNavigate();

  // Get service type from first matching tag
  const serviceType = tags.reduce<string | null>((found, tag) => {
    if (found) return found;
    return tagToServiceType[tag] || null;
  }, null) || "assistant";

  const handleAskAI = () => {
    const prompt = `Расскажи подробнее про: ${title}`;
    navigate(`/chat?prompt=${encodeURIComponent(prompt)}&context=${encodeURIComponent(title)}`);
  };

  const handleBookExpert = () => {
    navigate(`/service/${serviceType}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: 0.5 }}
      className="absolute bottom-28 left-4 right-20 flex flex-col gap-2"
    >
      <button
        onClick={handleAskAI}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full gradient-primary text-primary-foreground text-sm font-medium shadow-lg w-fit"
      >
        <Bot className="w-4 h-4" />
        Спросить AI
      </button>
      
      <button
        onClick={handleBookExpert}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full glass border border-border text-foreground text-sm font-medium w-fit"
      >
        <Calendar className="w-4 h-4" />
        К эксперту
      </button>
    </motion.div>
  );
}
