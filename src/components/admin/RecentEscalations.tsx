import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";

const ESCALATIONS = [
  {
    id: "1",
    user: "Анна М.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    service: "Юрист",
    reason: "Сложный вопрос по наследству",
    time: "15 мин назад",
  },
  {
    id: "2",
    user: "Дмитрий К.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    service: "Врач",
    reason: "Требуется очная консультация",
    time: "42 мин назад",
  },
  {
    id: "3",
    user: "Елена В.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    service: "Психолог",
    reason: "Кризисная ситуация",
    time: "1 час назад",
  },
];

export function RecentEscalations() {
  return (
    <div className="glass-card divide-y divide-border overflow-hidden">
      {ESCALATIONS.map((item) => (
        <div key={item.id} className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10 border border-border">
              <AvatarImage src={item.avatar} alt={item.user} />
              <AvatarFallback>{item.user.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{item.user}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </span>
              </div>
              <p className="text-xs text-primary mt-0.5">{item.service}</p>
              <p className="text-sm text-muted-foreground mt-1 truncate">{item.reason}</p>
            </div>
          </div>
        </div>
      ))}
      
      {ESCALATIONS.length === 0 && (
        <div className="p-8 text-center text-muted-foreground text-sm">
          Нет активных эскалаций
        </div>
      )}
    </div>
  );
}
