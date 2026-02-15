import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/layout/BottomNav";
import { NewConsultationSheet } from "@/components/chat/NewConsultationSheet";
import { useTopics, Topic } from "@/hooks/useTopics";
import { getAssistant, AI_ASSISTANTS } from "@/constants/aiAssistants";
import { supabase } from "@/integrations/supabase/client";
import { getSupabaseWithSession } from "@/lib/supabaseWithSession";

type FilterType = "all" | "active" | "archived" | "escalated";

const filters: { id: FilterType; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "active", label: "Активные" },
  { id: "archived", label: "Архив" },
  { id: "escalated", label: "С экспертом" },
];

interface TopicWithLastMessage extends Topic {
  last_message?: string | null;
  last_message_at?: string | null;
}

export default function Chats() {
  const navigate = useNavigate();
  const { topics, isLoading } = useTopics({ autoLoad: true });
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [topicsWithMessages, setTopicsWithMessages] = useState<TopicWithLastMessage[]>([]);

  // Fetch last messages for all topics
  useEffect(() => {
    if (topics.length === 0) {
      setTopicsWithMessages([]);
      return;
    }

    const fetchLastMessages = async () => {
      const client = getSupabaseWithSession();
      const topicIds = topics.map(t => t.id);
      
      const { data: messages } = await client
        .from("topic_messages")
        .select("topic_id, content, created_at")
        .in("topic_id", topicIds)
        .order("created_at", { ascending: false });

      // Get the latest message per topic
      const lastMessageMap = new Map<string, { content: string; created_at: string }>();
      if (messages) {
        for (const msg of messages) {
          if (!lastMessageMap.has(msg.topic_id)) {
            lastMessageMap.set(msg.topic_id, { content: msg.content, created_at: msg.created_at! });
          }
        }
      }

      const enriched: TopicWithLastMessage[] = topics.map(t => ({
        ...t,
        last_message: lastMessageMap.get(t.id)?.content ?? null,
        last_message_at: lastMessageMap.get(t.id)?.created_at ?? t.updated_at,
      }));

      // Sort by last_message_at desc
      enriched.sort((a, b) => {
        const dateA = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
        const dateB = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
        return dateB - dateA;
      });

      setTopicsWithMessages(enriched);
    };

    fetchLastMessages();
  }, [topics]);

  // Filter and search
  const filteredTopics = useMemo(() => {
    let result = topicsWithMessages;

    // Status filter
    if (activeFilter !== "all") {
      result = result.filter(t => t.status === activeFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => {
        const assistant = getAssistant(t.service_type);
        return (
          assistant.name.toLowerCase().includes(q) ||
          (t.last_message && t.last_message.toLowerCase().includes(q)) ||
          (t.title && t.title.toLowerCase().includes(q))
        );
      });
    }

    return result;
  }, [topicsWithMessages, activeFilter, search]);

  return (
    <div className="min-h-[100dvh] bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 px-4 pt-4 pb-3 safe-top bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-foreground">Мои консультации</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSheetOpen(true)}
            className="p-2 rounded-full glass"
          >
            <Plus className="w-5 h-5 text-foreground" />
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по консультациям"
            className="pl-9 bg-secondary/50 border-border/50"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeFilter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      {/* Topic list */}
      <div className="px-4 pt-2">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.8 }}
                  className="w-2.5 h-2.5 rounded-full bg-primary"
                />
              ))}
            </div>
          </div>
        ) : filteredTopics.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <MessageSquare className="w-12 h-12 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">У вас пока нет консультаций</p>
            <Button
              onClick={() => navigate("/chat")}
              className="gradient-primary text-primary-foreground rounded-full"
            >
              Задать первый вопрос
            </Button>
          </motion.div>
        ) : (
          <div>
            {filteredTopics.map((topic, index) => {
              const assistant = getAssistant(topic.service_type);
              const Icon = assistant.icon;
              const timeAgo = topic.last_message_at
                ? formatDistanceToNow(new Date(topic.last_message_at), { addSuffix: false, locale: ru })
                : "";

              return (
                <motion.button
                  key={topic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => navigate(`/chat?topicId=${topic.id}`)}
                  className="w-full flex items-center gap-3 py-3 border-b border-border/50 text-left"
                >
                  {/* Assistant icon */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, hsl(${assistant.color}), hsl(${assistant.color} / 0.7))` }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Center content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {assistant.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {topic.last_message || "Нет сообщений"}
                    </p>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[11px] text-muted-foreground">{timeAgo}</span>
                    {topic.status === "escalated" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400">
                        Эксперт
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* New consultation sheet */}
      <NewConsultationSheet open={sheetOpen} onOpenChange={setSheetOpen} />

      <BottomNav />
    </div>
  );
}
