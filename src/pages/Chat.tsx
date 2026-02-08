import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Bot } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { QuickActions } from "@/components/chat/QuickActions";
import { useChat } from "@/hooks/useChat";
import { ChatAction } from "@/types/chat";
import { WELCOME_ACTIONS } from "@/constants/chatActions";
import { ActionButtons } from "@/components/chat/ActionButtons";

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

  const handleSend = (content: string) => {
    sendMessage(content);
  };

  const handleActionClick = (action: string) => {
    handleAction(action as ChatAction);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2 px-4 py-4 safe-top"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">
            {isStyleMode ? "Стилист Лиза" : "Добросервис AI"}
          </h1>
        </div>
      </motion.header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
        {!hasMessages ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            {/* Welcome */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="p-4 rounded-2xl gradient-primary mb-6"
            >
              <Bot className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            
            <p className="text-muted-foreground text-sm mb-6 text-center max-w-xs">
              Спроси что угодно — помогу с любым вопросом
            </p>

            {/* Quick actions */}
            <QuickActions onActionClick={handleSend} />

            {/* Style-specific welcome actions */}
            <div className="mt-6">
              <p className="text-xs text-muted-foreground text-center mb-3">
                Или попробуй функции стилиста
              </p>
              <ActionButtons
                buttons={WELCOME_ACTIONS}
                onAction={handleActionClick}
              />
            </div>
          </motion.div>
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
        onSend={handleSend}
        isLoading={isLoading}
        onImageSelect={handleImageUpload}
        uploadedPhotoUrl={uploadedPhoto?.url}
        onClearPhoto={clearUploadedPhoto}
      />
      <BottomNav />
    </div>
  );
}
