import { motion } from "framer-motion";
import { MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Topic } from "@/hooks/useTopics";
import { TopicActionsMenu } from "./TopicActionsMenu";

interface TopicContextBarProps {
  topic: Topic;
  messageCount: number;
  onRename: () => void;
  onClearMessages: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export function TopicContextBar({ 
  topic, 
  messageCount,
  onRename,
  onClearMessages,
  onArchive,
  onDelete,
}: TopicContextBarProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) return "сегодня";
    return format(date, 'd MMM', { locale: ru });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="px-4 py-2 border-b border-border/30 bg-secondary/30"
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground/80 truncate max-w-[180px]">
          {topic.title}
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{messageCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDate(topic.created_at)}</span>
          </div>
          <TopicActionsMenu
            topic={topic}
            onRename={onRename}
            onClearMessages={onClearMessages}
            onArchive={onArchive}
            onDelete={onDelete}
          />
        </div>
      </div>
    </motion.div>
  );
}
