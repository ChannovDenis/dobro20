import { motion, AnimatePresence } from "framer-motion";
import { Camera } from "lucide-react";

const TEMPLATES = [
  { 
    icon: "⚖️", 
    label: "Юридическое обращение", 
    description: "Составить жалобу, претензию или заявление",
    prompt: "Помоги составить юридическое обращение. "
  },
  { 
    icon: "❤️", 
    label: "Вопрос про здоровье", 
    description: "Расшифровать анализы или описать симптомы",
    prompt: "У меня вопрос про здоровье. "
  },
  { 
    icon: "🧮", 
    label: "Проверить смету", 
    description: "Оценить стоимость ремонта или услуг",
    prompt: "Проверь смету и оцени стоимость: "
  },
  { 
    icon: "🧾", 
    label: "Анализ чека", 
    description: "Проверить чек на ошибки и переплаты",
    prompt: "Проверь этот чек на ошибки: "
  },
  { 
    icon: "✨", 
    label: "Подобрать стиль", 
    description: "Капсульный гардероб или образ",
    prompt: "Помоги подобрать стильный образ. "
  },
  { 
    icon: "🛡️", 
    label: "Проверить на мошенничество", 
    description: "Подозрительное сообщение или сайт",
    prompt: "Проверь на мошенничество: "
  },
  { 
    icon: "💰", 
    label: "Финансовый вопрос", 
    description: "Налоги, кредиты, инвестиции",
    prompt: "У меня финансовый вопрос: "
  },
  { 
    icon: "🐾", 
    label: "Вопрос про питомца", 
    description: "Здоровье, питание или поведение",
    prompt: "У меня вопрос про питомца: "
  },
];

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (prompt: string) => void;
  onPhotoClick?: () => void;
  showPhotoButton?: boolean;
}

export function TemplatesModal({ 
  isOpen, 
  onClose, 
  onSelectTemplate,
  onPhotoClick,
  showPhotoButton = true,
}: TemplatesModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 glass-card rounded-t-3xl p-4 max-h-[70vh] overflow-y-auto"
          >
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
            
            <h3 className="text-base font-semibold text-foreground mb-4 px-1">
              Выберите шаблон
            </h3>
            
            {/* Photo button */}
            {showPhotoButton && onPhotoClick && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onPhotoClick}
                className="w-full flex items-center gap-3 p-3 glass rounded-xl hover:bg-primary/10 transition-colors mb-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-medium text-foreground block">Загрузить фото</span>
                  <span className="text-xs text-muted-foreground">Анализ изображения</span>
                </div>
              </motion.button>
            )}

            {/* Templates grid */}
            <div className="space-y-2">
              {TEMPLATES.map((template) => (
                <motion.button
                  key={template.label}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSelectTemplate(template.prompt);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 glass rounded-xl hover:bg-primary/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-xl flex-shrink-0">
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground block truncate">
                      {template.label}
                    </span>
                    <span className="text-xs text-muted-foreground block truncate">
                      {template.description}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
