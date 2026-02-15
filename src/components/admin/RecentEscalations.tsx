import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { tenantEscalations } from "@/data/tenantEscalations";
import { useTenant } from "@/hooks/useTenant";

export function RecentEscalations() {
  const { tenantId } = useTenant();
  const escalations = tenantEscalations[tenantId ?? 'dobroservice'] ?? tenantEscalations.dobroservice;

  return (
    <div className="glass-card divide-y divide-border overflow-hidden">
      {escalations.map((item) => (
        <div key={item.id} className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10 border border-border">
              <AvatarImage src={item.avatar} alt={item.user} />
              <AvatarFallback>{item.user.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{item.user}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    item.priority === 'high' 
                      ? 'bg-destructive/20 text-destructive' 
                      : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {item.priority === 'high' ? 'Высокий' : 'Средний'}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                </div>
              </div>
              <p className="text-xs text-primary mt-0.5">{item.service}</p>
              <p className="text-sm text-muted-foreground mt-1 truncate">{item.reason}</p>
            </div>
          </div>
        </div>
      ))}
      
      {escalations.length === 0 && (
        <div className="p-8 text-center text-muted-foreground text-sm">
          Нет активных эскалаций
        </div>
      )}
    </div>
  );
}
