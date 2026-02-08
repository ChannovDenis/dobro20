import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Bot } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { ChatAction } from "@/types/chat";

const SUGGESTIONS = [
  { icon: "👗", text: "Подбери мне образ" },
  { icon: "🎨", text: "Определи мой цветотип" },
  { icon: "✨", text: "Что модно в 2026?" },
  { icon: "💼", text: "Как одеться на собеседование" },
];

export default function Chat() {
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2 px-4 py-3 safe-top border-b border-border/30"
      >
        <Sparkles className="w-4 h-4 text-primary" />
        <h1 className="text-base font-medium text-foreground">
          {isStyleMode ? "Стилист Лиза" : "Добросервис AI"}
        </h1>
      </motion.header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
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
      />
      <BottomNav />
    </div>
  );
}
