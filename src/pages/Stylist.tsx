import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Plus, Loader2, Sparkles, Shirt, Palette, Flame, HelpCircle, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const stylistAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop";

const quickActions = [
  { id: "outfit", icon: Shirt, label: "Примерить образ", gradient: true },
  { id: "colortype", icon: Palette, label: "Узнать цветотип", gradient: true },
  { id: "trends", icon: Flame, label: "Тренды 2026", gradient: false },
  { id: "help", icon: HelpCircle, label: "Как это работает?", gradient: false },
];

export default function Stylist() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Привет! 💜 Загрузи фото — подскажу какие цвета и стили тебе идут!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(content),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("цветотип") || lowerQuery.includes("цвет")) {
      return "Чтобы определить твой цветотип, мне нужно фото при естественном освещении! 📸 Загрузи селфи без макияжа, и я подскажу — ты Весна, Лето, Осень или Зима 🎨";
    }
    if (lowerQuery.includes("тренд")) {
      return "Тренды 2026 🔥\n\n• **Неоновые акценты** — яркие детали на базовых вещах\n• **Оверсайз блейзеры** — структурированные плечи\n• **Эко-кожа** — матовые текстуры\n• **Y2K возвращение** — низкая посадка, блестки";
    }
    if (lowerQuery.includes("образ") || lowerQuery.includes("примерить")) {
      return "Отлично! Загрузи своё фото в полный рост, и я покажу как на тебе будут смотреться разные образы 👗✨";
    }
    if (lowerQuery.includes("как") && lowerQuery.includes("работает")) {
      return "Всё просто! 🌟\n\n1. Загрузи своё фото\n2. Я проанализирую твой типаж\n3. Подберу идеальные цвета и стили\n4. Покажу как образы смотрятся на тебе\n\nГотов начать?";
    }
    
    return "Интересный вопрос! 💜 Расскажи подробнее, что тебя интересует — цветотип, подбор образа или актуальные тренды?";
  };

  const handleQuickAction = (actionId: string) => {
    const prompts: Record<string, string> = {
      outfit: "Хочу примерить образ",
      colortype: "Определи мой цветотип",
      trends: "Расскажи про тренды 2026",
      help: "Как это работает?",
    };
    handleSend(prompts[actionId] || "");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 safe-top border-b border-border">
        <div>
          <h1 className="text-lg font-bold text-foreground">Стилист</h1>
          <p className="text-xs text-muted-foreground">AI-помощник по стилю</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full glass"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4 max-w-lg mx-auto">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
            >
              {message.role === "assistant" && (
                <Avatar className="w-10 h-10 border-2 border-primary/30">
                  <AvatarImage src={stylistAvatar} alt="Лиза" />
                  <AvatarFallback>Л</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] ${
                  message.role === "assistant"
                    ? "glass-card rounded-2xl rounded-tl-md px-4 py-3"
                    : "gradient-primary rounded-2xl rounded-tr-md px-4 py-3"
                }`}
              >
                {message.role === "assistant" && (
                  <span className="text-xs font-semibold text-primary block mb-1">Лиза</span>
                )}
                <p className={`text-sm whitespace-pre-line ${
                  message.role === "user" ? "text-primary-foreground" : "text-foreground"
                }`}>
                  {message.content}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Quick Actions - only show after welcome */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-2 justify-center pt-4"
            >
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant={action.gradient ? "gradient" : "glass"}
                    size="default"
                    onClick={() => handleQuickAction(action.id)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </Button>
                );
              })}
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <Avatar className="w-10 h-10 border-2 border-primary/30">
                <AvatarImage src={stylistAvatar} alt="Лиза" />
                <AvatarFallback>Л</AvatarFallback>
              </Avatar>
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
      </div>

      {/* Input */}
      <div className="px-4 pb-6 pt-2 safe-bottom">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2 glass-card p-2 max-w-lg mx-auto"
        >
          <Button
            type="button"
            variant="glass"
            size="icon-sm"
            className="flex-shrink-0"
          >
            <Plus className="w-5 h-5" />
          </Button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Сообщение..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm py-2"
          />

          <Button
            type="submit"
            variant="gradient"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
