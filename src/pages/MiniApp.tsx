import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { miniApps } from "@/data/mockData";
import { Button } from "@/components/ui/button";

export default function MiniApp() {
  const { id } = useParams();
  const navigate = useNavigate();

  const app = miniApps.find(a => a.id === id);

  if (!app) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Приложение не найдено</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 px-4 py-4 safe-top border-b border-border"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="p-2 rounded-full glass"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{app.icon}</span>
          <h1 className="text-lg font-bold text-foreground">{app.name}</h1>
        </div>
      </motion.header>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4"
      >
        <div className="glass-card p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-6xl mb-4"
          >
            {app.icon}
          </motion.div>
          
          <h2 className="text-xl font-bold text-foreground mb-2">{app.name}</h2>
          <p className="text-muted-foreground mb-6">{app.description}</p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Powered by AI</span>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full"
              onClick={() => navigate("/chat")}
            >
              Открыть в чате
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(-1)}
            >
              Назад
            </Button>
          </div>
        </div>

        {/* Features preview */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Что умеет</h3>
          {getAppFeatures(app.id).map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass-card p-4 flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm text-foreground">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function getAppFeatures(appId: string): string[] {
  const features: Record<string, string[]> = {
    "calorie-counter": [
      "Подсчёт калорий по фото",
      "База из 100,000+ продуктов",
      "Персональные рекомендации",
      "История питания",
    ],
    "document-check": [
      "Анализ договоров",
      "Поиск подводных камней",
      "Сравнение с образцами",
      "Рекомендации по правкам",
    ],
    "budget-planner": [
      "Отслеживание расходов",
      "Цели накоплений",
      "Аналитика по категориям",
      "Советы по экономии",
    ],
    "symptom-checker": [
      "Анализ симптомов",
      "Возможные диагнозы",
      "Рекомендации по действиям",
      "Когда идти к врачу",
    ],
    "gpb-architect": [
      "AI-анализ фото комнаты",
      "Подбор стиля интерьера",
      "3D-визуализация результата",
      "Расчёт бюджета и сметы",
    ],
    "mes-protection": [
      "Распознавание квитанций (OCR)",
      "Аудит начислений ЖКХ",
      "Выявление переплат",
      "Генерация жалобы",
    ],
    "msb-skills": [
      "AI-юрист для бизнеса",
      "AI-бухгалтер и налоги",
      "AI-маркетолог и SMM",
      "AI-аналитик и прогнозы",
    ],
  };
  
  return features[appId] || ["Функция в разработке"];
}
