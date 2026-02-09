import { motion } from "framer-motion";
import { getAssistant, getDefaultSuggestions, Suggestion } from "@/constants/aiAssistants";

interface SuggestionTickerProps {
  onSuggestionClick: (prompt: string) => void;
  serviceId?: string;
}

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

export function SuggestionTicker({ onSuggestionClick, serviceId }: SuggestionTickerProps) {
  // Get suggestions based on service or use defaults
  const suggestions = serviceId 
    ? getAssistant(serviceId).suggestions 
    : getDefaultSuggestions();
  
  // Split into rows (2 for service-specific, 3 for default)
  const rowCount = serviceId ? 2 : 3;
  const itemsPerRow = Math.ceil(suggestions.length / rowCount);
  
  const row1 = suggestions.slice(0, itemsPerRow);
  const row2 = suggestions.slice(itemsPerRow, itemsPerRow * 2);
  const row3 = serviceId ? [] : suggestions.slice(itemsPerRow * 2, itemsPerRow * 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-md space-y-1"
    >
      <TickerRow items={row1} onSuggestionClick={onSuggestionClick} />
      <TickerRow items={row2} reverse onSuggestionClick={onSuggestionClick} />
      {row3.length > 0 && (
        <TickerRow items={row3} onSuggestionClick={onSuggestionClick} />
      )}
    </motion.div>
  );
}
