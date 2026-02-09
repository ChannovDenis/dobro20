import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Message, ChatAction } from "@/types/chat";
import { ActionButtons } from "./ActionButtons";
import { ColorPalette } from "./ColorPalette";
import { TrendGallery } from "./TrendGallery";
import { EscalationCard } from "./EscalationCard";

interface ChatMessageProps {
  message: Message;
  onAction?: (action: ChatAction) => void;
}

export function ChatMessage({ message, onAction }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-primary" : "gradient-primary"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      <div className={cn("max-w-[80%]", isUser && "text-right")}>
        {/* User uploaded image */}
        {isUser && message.imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-2"
          >
            <img
              src={message.imageUrl}
              alt="Uploaded"
              className="w-32 h-32 rounded-xl object-cover ml-auto"
            />
          </motion.div>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-md"
              : "glass-card rounded-tl-md"
          )}
        >
          {isUser ? (
            <p className="text-sm">{message.content}</p>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Result image (e.g., from try-on) */}
        {!isUser && message.resultImageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3"
          >
            <img
              src={message.resultImageUrl}
              alt="Result"
              className="w-full max-w-xs rounded-xl object-cover"
            />
          </motion.div>
        )}

        {/* Color palette */}
        {!isUser && message.colorPalette && (
          <ColorPalette data={message.colorPalette} />
        )}

        {/* Trend gallery */}
        {!isUser && message.trendGallery && message.trendGallery.length > 0 && (
          <TrendGallery items={message.trendGallery} />
        )}

        {/* Escalation card */}
        {!isUser && message.escalation && (
          <EscalationCard data={message.escalation} />
        )}

        {/* Action buttons */}
        {!isUser && message.buttons && message.buttons.length > 0 && onAction && (
          <ActionButtons buttons={message.buttons} onAction={onAction} />
        )}
      </div>
    </motion.div>
  );
}
