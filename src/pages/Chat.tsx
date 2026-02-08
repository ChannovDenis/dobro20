import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Bot, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { ChatAction } from "@/types/chat";
import { useTenant } from "@/hooks/useTenant";


const SUGGESTIONS = [
  { icon: "🌱", text: "Что сейчас сажать в моём регионе?" },
  { icon: "⚖️", text: "Помоги с возвратом товара" },
  { icon: "🩺", text: "Какие симптомы у простуды?" },
  { icon: "🧠", text: "Как справиться со стрессом?" },
  { icon: "💰", text: "Как начать копить деньги?" },
  { icon: "👗", text: "Подбери мне образ" },
  { icon: "🐕", text: "Чем кормить щенка?" },
];

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tenant } = useTenant();
  
  // Read context from URL params
  const contextParam = searchParams.get("context");
  const promptParam = searchParams.get("prompt");
  const [context, setContext] = useState<string | null>(contextParam);
  
  const {
    messages,
    isLoading,
    isStyleMode,
    uploadedPhoto,
    sendMessage,
    handleAction,
    handleImageUpload,
    clearUploadedPhoto,
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleActionClick = (action: string) => {
    handleAction(action as ChatAction);
  };

  const handleSuggestionClick = (text: string) => {
    sendMessage(text);
  };

  const hasMessages = messages.length > 0;

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Clear URL params when closing
    setSearchParams({});
    navigate('/feed');
  };

  const clearContext = () => {
    setContext(null);
    setSearchParams({});
  };

  // Get AI name from tenant config or use default
  const aiName = isStyleMode ? "Стилист Лиза" : (tenant?.ai_name || "Добросервис AI");

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Modal Header with close button */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between px-4 py-3 safe-top border-b border-border/30"
      >
        <button
          type="button"
          onClick={handleClose}
          className="p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h1 className="text-base font-medium text-foreground">
            {aiName}
          </h1>
        </div>
        <div className="w-8" /> {/* Spacer for centering */}
      </motion.header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 flex flex-col">
        {/* Context badge */}
        {context && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-2 glass rounded-xl text-sm">
              <span className="text-muted-foreground">Контекст:</span>
              <span className="text-foreground font-medium truncate max-w-[200px]">{context}</span>
              <button
                onClick={clearContext}
                className="p-0.5 rounded-full hover:bg-secondary/50 text-muted-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
        {!hasMessages ? (
          <div className="flex-1 flex flex-col items-center justify-center px-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                Чем могу помочь?
              </p>
            </motion.div>

            {/* Suggestion chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full max-w-sm space-y-2"
            >
              {SUGGESTIONS.map((suggestion, index) => (
                <motion.button
                  key={suggestion.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full flex items-center gap-3 p-3 glass rounded-xl text-left hover:bg-secondary/30 transition-colors"
                >
                  <span className="text-lg">{suggestion.icon}</span>
                  <span className="text-sm text-foreground">{suggestion.text}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onAction={handleActionClick}
              />
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="glass-card rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        onImageSelect={handleImageUpload}
        uploadedPhotoUrl={uploadedPhoto?.url}
        onClearPhoto={clearUploadedPhoto}
        initialPrompt={promptParam || undefined}
      />
    </div>
  );
}
