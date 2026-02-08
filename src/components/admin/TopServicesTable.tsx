import { Scale, Heart, Brain, Wallet, Dumbbell, Sprout } from "lucide-react";

const SERVICES = [
  { id: "lawyer", name: "Юрист", requests: 2340, icon: Scale, color: "text-category-legal" },
  { id: "doctor", name: "Врач", requests: 1890, icon: Heart, color: "text-category-health" },
  { id: "psychologist", name: "Психолог", requests: 1560, icon: Brain, color: "text-category-psychology" },
  { id: "garden", name: "Доброградка", requests: 1230, icon: Sprout, color: "text-category-garden" },
  { id: "finance", name: "Финансы", requests: 980, icon: Wallet, color: "text-category-finance" },
];

export function TopServicesTable() {
  const maxRequests = Math.max(...SERVICES.map(s => s.requests));
  
  return (
    <div className="glass-card divide-y divide-border overflow-hidden">
      {SERVICES.map((service, index) => {
        const Icon = service.icon;
        const percentage = (service.requests / maxRequests) * 100;
        
        return (
          <div key={service.id} className="p-4 relative overflow-hidden">
            {/* Progress bar background */}
            <div 
              className="absolute inset-0 bg-primary/5"
              style={{ width: `${percentage}%` }}
            />
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-5">
                  {index + 1}
                </span>
                <div className={`p-2 rounded-lg bg-secondary/50`}>
                  <Icon className={`w-4 h-4 ${service.color}`} />
                </div>
                <span className="text-sm font-medium text-foreground">{service.name}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {service.requests.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
