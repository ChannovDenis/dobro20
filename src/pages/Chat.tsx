import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { ChatMessage, Message } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { QuickActions } from "@/components/chat/QuickActions";
import { useChat } from "@/hooks/useChat";

export default function Chat() {
  const { messages, isLoading, sendMessage } = useChat();
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 py-4 safe-top border-b border-border"
      >
        <div className="p-2 rounded-xl gradient-primary">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground">Добросервис AI</h1>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-xs text-muted-foreground">Ваш персональный помощник</p>
        </div>
      </motion.header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Welcome message */}
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex p-4 rounded-2xl gradient-primary mb-4"
              >
                <Bot className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Привет! Я Добросервис AI
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                Задайте любой вопрос — юридический, медицинский, финансовый или просто поболтаем
              </p>
            </div>

            {/* Quick actions */}
            <QuickActions onActionClick={handleSend} />
          </motion.div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
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
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={handleSend} isLoading={isLoading} />
      <BottomNav />
    </div>
  );
}
