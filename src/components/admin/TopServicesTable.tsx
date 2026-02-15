import { tenantServiceUsage } from "@/data/tenantServices";
import { useTenant } from "@/hooks/useTenant";

export function TopServicesTable() {
  const { tenantId } = useTenant();
  const services = tenantServiceUsage[tenantId ?? 'dobroservice'] ?? tenantServiceUsage.dobroservice;

  return (
    <div className="glass-card divide-y divide-border overflow-hidden">
      {services.map((service, index) => {
        const percentage = (service.requests / service.limit) * 100;

        return (
          <div key={service.id} className="p-4 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-primary/5"
              style={{ width: `${percentage}%` }}
            />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground w-5">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-foreground">{service.name}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {service.requests.toLocaleString('ru-RU')}{' '}
                <span className="text-muted-foreground font-normal">/ {service.limit.toLocaleString('ru-RU')}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
