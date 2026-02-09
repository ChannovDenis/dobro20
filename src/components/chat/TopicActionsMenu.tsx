import { useState } from "react";
import { MoreVertical, Pencil, Archive, Trash2, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Topic } from "@/hooks/useTopics";

interface TopicActionsMenuProps {
  topic: Topic;
  onRename: () => void;
  onClearMessages: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export function TopicActionsMenu({
  topic,
  onRename,
  onClearMessages,
  onArchive,
  onDelete,
}: TopicActionsMenuProps) {
  const [open, setOpen] = useState(false);

  const handleAction = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="p-1 rounded-full text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
          aria-label="Действия с чатом"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border border-border shadow-lg z-50">
        <DropdownMenuItem 
          onClick={() => handleAction(onRename)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Pencil className="w-4 h-4" />
          <span>Переименовать</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleAction(onClearMessages)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Очистить сообщения</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => handleAction(onArchive)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Archive className="w-4 h-4" />
          <span>{topic.status === 'archived' ? 'Вернуть из архива' : 'В архив'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleAction(onDelete)}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
          <span>Удалить чат</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
