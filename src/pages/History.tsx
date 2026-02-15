import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Calendar, Video, MessageSquare,
  Bot, X, CheckCircle2, XCircle, ChevronRight, Loader2
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getBookings, updateBookingStatus, Booking } from "@/types/booking";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";

type FilterType = "all" | "upcoming" | "completed" | "ai";

interface AIConsultation {
  id: string;
  serviceId: string;
  serviceName: string;
  messageCount: number;
  date: string;
}

function getMockAIConsultations(): AIConsultation[] {
  try {
    const chatHistory = localStorage.getItem("dobro-chat-history");
    if (chatHistory) {
      const messages = JSON.parse(chatHistory);
      if (messages.length > 0) {
        return [{
          id: "ai-1",
          serviceId: "default",
          serviceName: "Добро-ассистент",
          messageCount: messages.length,
          date: new Date().toISOString(),
        }];
      }
    }
  } catch {
    // ignore
  }

  return [
    {
      id: "ai-demo-1",
      serviceId: "lawyer",
      serviceName: "AI-юрист",
      messageCount: 12,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "ai-demo-2",
      serviceId: "doctor",
      serviceName: "AI-доктор",
      messageCount: 8,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function getMockBookings(): Booking[] {
  const now = new Date();
  return [
    {
      id: "demo-1",
      expertId: "exp-1",
      expertName: "Мария Сидорова",
      specialty: "Терапевт",
      serviceId: "doctor",
      serviceName: "Врач",
      date: format(new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      time: "14:00",
      type: "online",
      price: "2 500 ₽",
      status: "upcoming",
      createdAt: now.toISOString(),
    },
    {
      id: "demo-2",
      expertId: "exp-2",
      expertName: "Алексей Петров",
      specialty: "Семейное право",
      serviceId: "lawyer",
      serviceName: "Юрист",
      date: format(new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      time: "10:30",
      type: "chat",
      price: "1 800 ₽",
      status: "upcoming",
      createdAt: now.toISOString(),
    },
    {
      id: "demo-3",
      expertId: "exp-3",
      expertName: "Анна Козлова",
      specialty: "Психотерапевт",
      serviceId: "psychologist",
      serviceName: "Психолог",
      date: format(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      time: "16:00",
      type: "online",
      price: "3 000 ₽",
      status: "completed",
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

export default function History() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>("all");
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const aiConsultations = useMemo(() => getMockAIConsultations(), []);

  // Load bookings async
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    getBookings().then((bookings) => {
      if (cancelled) return;
      setAllBookings(bookings.length > 0 ? bookings : getMockBookings());
      setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, [refreshKey]);

  const filteredItems = useMemo(() => {
    const now = new Date();

    let bookings = allBookings;

    if (filter === "upcoming") {
      bookings = allBookings.filter(b =>
        b.status === "upcoming" && isAfter(parseISO(b.date), now)
      );
      return { bookings, ai: [] };
    }

    if (filter === "completed") {
      bookings = allBookings.filter(b =>
        b.status === "completed" || isBefore(parseISO(b.date), now)
      );
      return { bookings, ai: [] };
    }

    if (filter === "ai") {
      return { bookings: [], ai: aiConsultations };
    }

    return { bookings, ai: aiConsultations };
  }, [allBookings, aiConsultations, filter]);

  const handleClose = () => {
    navigate("/services");
  };

  const handleCancelBooking = useCallback(async (bookingId: string) => {
    await updateBookingStatus(bookingId, "cancelled");
    toast.success("Запись отменена");
    setRefreshKey(k => k + 1);
  }, []);

  const handleReschedule = (bookingId: string) => {
    toast.info("Функция переноса скоро будет доступна");
  };

  const handleJoinCall = (booking: Booking) => {
    if (booking.type === "online") {
      toast.info("Видеозвонок скоро будет доступен");
    } else {
      navigate(`/chat?service=${booking.serviceId}`);
    }
  };

  const handleOpenAIChat = (consultation: AIConsultation) => {
    navigate(`/chat?service=${consultation.serviceId}`);
  };

  const formatBookingDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "d MMM", { locale: ru });
    } catch {
      return dateStr;
    }
  };

  const isUpcoming = (booking: Booking) => {
    return booking.status === "upcoming" && isAfter(parseISO(booking.date), new Date());
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 safe-top bg-background/80 backdrop-blur-md border-b border-border/30"
      >
        <button
          onClick={handleClose}
          className="p-2 rounded-full text-muted-foreground hover:bg-accent transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Мои консультации</h1>
        <div className="w-9" />
      </motion.header>

      {/* Filter */}
      <div className="px-4 py-4">
        <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
          <SelectTrigger className="w-full glass border-border/30">
            <SelectValue placeholder="Все консультации" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все консультации</SelectItem>
            <SelectItem value="upcoming">Предстоящие</SelectItem>
            <SelectItem value="completed">Завершённые</SelectItem>
            <SelectItem value="ai">С AI-ассистентом</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <div className="px-4 space-y-3">
          {/* Expert bookings */}
          {filteredItems.bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isUpcoming(booking) ? (
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                  ) : booking.status === "cancelled" ? (
                    <XCircle className="w-4 h-4 text-destructive" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {formatBookingDate(booking.date)}, {booking.time}
                  </span>
                </div>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  isUpcoming(booking)
                    ? "bg-green-500/20 text-green-400"
                    : booking.status === "cancelled"
                    ? "bg-destructive/20 text-destructive"
                    : "bg-muted text-muted-foreground"
                )}>
                  {isUpcoming(booking) ? "Предстоящая" :
                   booking.status === "cancelled" ? "Отменена" : "Завершена"}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-12 h-12 border border-border/30">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {booking.expertName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">{booking.expertName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.serviceName} · {booking.specialty}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  {booking.type === "online" ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <MessageSquare className="w-4 h-4" />
                  )}
                  {booking.type === "online" ? "Онлайн" : "Чат"}
                </span>
                <span>{booking.price}</span>
              </div>

              {isUpcoming(booking) && booking.status !== "cancelled" && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Отменить
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleReschedule(booking.id)}
                  >
                    Перенести
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleJoinCall(booking)}
                  >
                    {booking.type === "online" ? "Войти" : "Открыть"}
                  </Button>
                </div>
              )}
            </motion.div>
          ))}

          {/* AI consultations */}
          {filteredItems.ai.map((consultation, index) => (
            <motion.div
              key={consultation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (filteredItems.bookings.length + index) * 0.05 }}
              className="glass-card p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {formatBookingDate(consultation.date)}
                  </span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                  AI
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">
                    Чат с {consultation.serviceName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {consultation.messageCount} сообщений
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenAIChat(consultation)}
                  className="gap-1"
                >
                  Открыть
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}

          {/* Empty state */}
          {filteredItems.bookings.length === 0 && filteredItems.ai.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                Нет консультаций
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {filter === "upcoming"
                  ? "У вас пока нет запланированных консультаций"
                  : filter === "completed"
                  ? "У вас пока нет завершённых консультаций"
                  : "История консультаций пуста"}
              </p>
              <Button onClick={() => navigate("/services")}>
                Найти эксперта
              </Button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
