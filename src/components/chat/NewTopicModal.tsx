import { motion, AnimatePresence } from "framer-motion";
import { Camera, FolderOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTopics, Topic } from "@/hooks/useTopics";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const SERVICE_TEMPLATES = [
  { 
    id: "lawyer",
    icon: "⚖️", 
    label: "Юридический вопрос", 
    description: "Права, договоры, претензии",
    serviceType: "lawyer",
  },
  { 
    id: "doctor",
    icon: "❤️", 
    label: "Вопрос про здоровье", 
    description: "Симптомы, анализы, лечение",
    serviceType: "doctor",
  },
  { 
    id: "finance",
    icon: "💰", 
    label: "Финансовый вопрос", 
    description: "Налоги, кредиты, инвестиции",
    serviceType: "finance",
  },
  { 
    id: "psychologist",
    icon: "🧠", 
    label: "Психологическая помощь", 
    description: "Тревога, стресс, отношения",
    serviceType: "psychologist",
  },
  { 
    id: "security",
    icon: "🛡️", 
    label: "Проверка на мошенничество", 
    description: "Подозрительные сообщения или сайты",
    serviceType: "security",
  },
  { 
    id: "vet",
    icon: "🐾", 
    label: "Вопрос про питомца", 
    description: "Здоровье, питание, поведение",
    serviceType: "vet",
  },
  { 
    id: "garden",
    icon: "🌱", 
    label: "Садовый вопрос", 
    description: "Рассада, уход, урожай",
    serviceType: "garden",
  },
  { 
    id: "stylist",
    icon: "✨", 
    label: "Подобрать стиль", 
    description: "Капсульный гардероб, образ",
    serviceType: "stylist",
  },
];

interface NewTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoClick?: () => void;
  showPhotoButton?: boolean;
  onTopicCreated?: (topicId: string, serviceType: string) => void;
}

export function NewTopicModal({ 
  isOpen, 
  onClose, 
  onPhotoClick,
  showPhotoButton = true,
  onTopicCreated,
}: NewTopicModalProps) {
  const navigate = useNavigate();
  const { topics, createTopic, selectTopic } = useTopics();

  const activeTopics = topics.filter(t => t.status === 'active').slice(0, 3);

  const handleSelectService = async (template: typeof SERVICE_TEMPLATES[0]) => {
    const topic = await createTopic(
      template.label,
      template.serviceType,
      { initialTemplate: template.id }
    );
    
    if (topic) {
      onTopicCreated?.(topic.id, template.serviceType);
      onClose();
    }
  };

  const handleContinueTopic = async (topic: Topic) => {
    await selectTopic(topic);
    onClose();
    navigate(`/chat?topicId=${topic.id}&service=${topic.service_type || ''}`);
  };

  const formatTopicDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'd MMM', { locale: ru });
  };

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
            className="absolute bottom-0 left-0 right-0 glass-card rounded-t-3xl p-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
            
            <h3 className="text-base font-semibold text-foreground mb-4 px-1">
              Новый чат
            </h3>
            
            {/* Photo button */}
            {showPhotoButton && onPhotoClick && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onPhotoClick();
                  onClose();
                }}
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

            {/* Service templates grid */}
            <div className="space-y-2 mb-4">
              {SERVICE_TEMPLATES.map((template) => (
                <motion.button
                  key={template.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectService(template)}
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
                  <Plus className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </motion.button>
              ))}
            </div>

            {/* Active topics section */}
            {activeTopics.length > 0 && (
              <>
                <div className="flex items-center gap-2 px-1 mb-3">
                  <FolderOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Продолжить чат
                  </span>
                </div>
                <div className="space-y-2">
                  {activeTopics.map((topic) => (
                    <motion.button
                      key={topic.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleContinueTopic(topic)}
                      className="w-full flex items-center gap-3 p-3 glass rounded-xl hover:bg-accent/50 transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground block truncate">
                          {topic.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTopicDate(topic.updated_at)}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
