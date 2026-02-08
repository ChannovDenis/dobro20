import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Phone, Video, MessageSquare, FileText, Briefcase, Users, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { experts } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { addDays, format, isToday, isTomorrow } from "date-fns";
import { ru } from "date-fns/locale";

type ConsultationType = "online" | "chat";

export default function ExpertDetail() {
  const { id, expertId } = useParams();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<ConsultationType>("online");

  const serviceExperts = experts[id || ""] || [];
  const expert = serviceExperts.find(e => e.id === expertId);

  // Generate next 7 days
  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  }, []);

  if (!expert) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Эксперт не найден</p>
      </div>
    );
  }

  const formatDateLabel = (date: Date) => {
    if (isToday(date)) return "Сегодня";
    if (isTomorrow(date)) return "Завтра";
    return format(date, "EEE", { locale: ru });
  };

  const price = consultationType === "online" ? expert.price : (expert.priceChat || expert.price);

  const handleBooking = () => {
    if (!selectedTime) return;
    // TODO: Implement actual booking
    alert(`Запись к ${expert.name} на ${format(selectedDate, "d MMMM", { locale: ru })} в ${selectedTime}`);
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 px-4 py-4 safe-top"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="p-2 rounded-full glass"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <h1 className="text-lg font-semibold text-foreground">Запись к эксперту</h1>
      </motion.header>

      {/* Expert Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-2"
      >
        <div className="text-center">
          <Avatar className="w-24 h-24 mx-auto border-4 border-primary/30">
            <AvatarImage src={expert.avatar} alt={expert.name} />
            <AvatarFallback className="text-2xl">{expert.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-bold text-foreground mt-4">{expert.name}</h2>
          
          <div className="flex items-center justify-center gap-2 mt-1 text-muted-foreground">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-medium text-foreground">{expert.rating}</span>
            <span>·</span>
            <span>{expert.specialty}</span>
          </div>
          
          {expert.bio && (
            <p className="text-sm text-muted-foreground mt-3 max-w-xs mx-auto">
              {expert.bio}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 mt-6">
          {expert.experience && (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center mx-auto">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground mt-2">{expert.experience}</p>
              <p className="text-xs text-muted-foreground">Опыт</p>
            </div>
          )}
          {expert.consultations && (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center mx-auto">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground mt-2">{expert.consultations}+</p>
              <p className="text-xs text-muted-foreground">Консультаций</p>
            </div>
          )}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full glass flex items-center justify-center mx-auto">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-sm font-medium text-foreground mt-2">{expert.rating}</p>
            <p className="text-xs text-muted-foreground">Рейтинг</p>
          </div>
        </div>

        {/* Communication icons */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="p-3 rounded-full glass text-muted-foreground hover:text-primary transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-full glass text-muted-foreground hover:text-primary transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-full glass text-muted-foreground hover:text-primary transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-full glass text-muted-foreground hover:text-primary transition-colors">
            <FileText className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Date Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 px-4"
      >
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Выберите дату
        </h3>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {dates.map((date) => {
            const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            return (
              <button
                key={date.toISOString()}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                className={cn(
                  "flex flex-col items-center min-w-[60px] p-3 rounded-xl transition-all",
                  isSelected
                    ? "gradient-primary text-primary-foreground"
                    : "glass text-foreground hover:bg-secondary/30"
                )}
              >
                <span className="text-xs opacity-80">{formatDateLabel(date)}</span>
                <span className="text-lg font-bold">{format(date, "d")}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Time Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 px-4"
      >
        <h3 className="text-base font-semibold text-foreground mb-3">Выберите время</h3>
        {expert.timeSlots && expert.timeSlots.length > 0 ? (
          <div className="grid grid-cols-4 gap-2">
            {expert.timeSlots.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={cn(
                    "py-3 rounded-xl text-sm font-medium transition-all",
                    isSelected
                      ? "gradient-primary text-primary-foreground"
                      : "glass text-foreground hover:bg-secondary/30"
                  )}
                >
                  {time}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-4 text-center text-muted-foreground text-sm">
            Нет доступных слотов на эту дату
          </div>
        )}
      </motion.div>

      {/* Consultation Type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 px-4"
      >
        <h3 className="text-base font-semibold text-foreground mb-3">Тип консультации</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setConsultationType("online")}
            className={cn(
              "p-4 rounded-xl transition-all text-left",
              consultationType === "online"
                ? "glass border-2 border-primary"
                : "glass hover:bg-secondary/30"
            )}
          >
            <Video className={cn(
              "w-6 h-6 mb-2",
              consultationType === "online" ? "text-primary" : "text-muted-foreground"
            )} />
            <p className="font-medium text-foreground">Онлайн</p>
            <p className="text-sm text-primary mt-1">{expert.price}</p>
          </button>
          
          <button
            onClick={() => setConsultationType("chat")}
            className={cn(
              "p-4 rounded-xl transition-all text-left",
              consultationType === "chat"
                ? "glass border-2 border-primary"
                : "glass hover:bg-secondary/30"
            )}
          >
            <MessageSquare className={cn(
              "w-6 h-6 mb-2",
              consultationType === "chat" ? "text-primary" : "text-muted-foreground"
            )} />
            <p className="font-medium text-foreground">Чат</p>
            <p className="text-sm text-primary mt-1">{expert.priceChat || expert.price}</p>
          </button>
        </div>
      </motion.div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8">
        <Button
          className="w-full h-14 text-base font-semibold"
          disabled={!selectedTime}
          onClick={handleBooking}
        >
          Записаться · {price}
        </Button>
      </div>
    </div>
  );
}
