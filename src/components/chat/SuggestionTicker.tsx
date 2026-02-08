import { motion } from "framer-motion";

interface Suggestion {
  icon: string;
  label: string;
  prompt: string;
}

interface SuggestionTickerProps {
  onSuggestionClick: (prompt: string) => void;
}

const SUGGESTIONS: Suggestion[] = [
  // Row 1
  { icon: "🌱", label: "Что сажать?", prompt: "Что сейчас сажать в моём регионе?" },
  { icon: "⚖️", label: "Возврат товара", prompt: "Помоги с возвратом товара" },
  { icon: "🩺", label: "Симптомы", prompt: "Какие симптомы у простуды?" },
  { icon: "💰", label: "Бюджет", prompt: "Как начать копить деньги?" },
  { icon: "👗", label: "Мой стиль", prompt: "Подбери мне образ" },
  { icon: "🍳", label: "Рецепты", prompt: "Что приготовить на ужин?" },
  // Row 2
  { icon: "🧠", label: "Стресс", prompt: "Как справиться со стрессом?" },
  { icon: "🐕", label: "Питомец", prompt: "Чем кормить щенка?" },
  { icon: "🏋️", label: "Фитнес", prompt: "Упражнения для дома" },
  { icon: "📄", label: "Документы", prompt: "Проверь мой договор" },
  { icon: "💊", label: "Лекарства", prompt: "Аналоги лекарств" },
  { icon: "🎁", label: "Подарок", prompt: "Что подарить маме?" },
  // Row 3
  { icon: "🔒", label: "Мошенники", prompt: "Как распознать мошенников?" },
  { icon: "💼", label: "Работа", prompt: "Права работника" },
  { icon: "🏠", label: "ЖКХ", prompt: "Как снизить счета ЖКХ?" },
  { icon: "✈️", label: "Отпуск", prompt: "Куда поехать зимой?" },
  { icon: "🎓", label: "Обучение", prompt: "Как выучить новое?" },
  { icon: "🚗", label: "Авто", prompt: "Как выбрать машину?" },
];

// Split into 3 rows
const row1 = SUGGESTIONS.slice(0, 6);
const row2 = SUGGESTIONS.slice(6, 12);
const row3 = SUGGESTIONS.slice(12, 18);

function SuggestionChip({ 
  suggestion, 
  onClick 
}: { 
  suggestion: Suggestion; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 glass rounded-full text-xs text-foreground/90 hover:bg-secondary/50 hover:text-foreground transition-all duration-200 whitespace-nowrap"
    >
      <span>{suggestion.icon}</span>
      <span>{suggestion.label}</span>
    </button>
  );
}

function TickerRow({ 
  items, 
  reverse = false,
  onSuggestionClick 
}: { 
  items: Suggestion[];
  reverse?: boolean;
  onSuggestionClick: (prompt: string) => void;
}) {
  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items];

  return (
    <div className="overflow-hidden py-1">
      <div 
        className={`flex gap-2 ${reverse ? 'ticker-row-reverse' : 'ticker-row'}`}
        style={{ width: 'max-content' }}
      >
        {duplicatedItems.map((item, index) => (
          <SuggestionChip
            key={`${item.label}-${index}`}
            suggestion={item}
            onClick={() => onSuggestionClick(item.prompt)}
          />
        ))}
      </div>
    </div>
  );
}

export function SuggestionTicker({ onSuggestionClick }: SuggestionTickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-md space-y-1"
    >
      <TickerRow items={row1} onSuggestionClick={onSuggestionClick} />
      <TickerRow items={row2} reverse onSuggestionClick={onSuggestionClick} />
      <TickerRow items={row3} onSuggestionClick={onSuggestionClick} />
    </motion.div>
  );
}
