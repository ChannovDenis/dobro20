import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { activityChartData } from "@/data/tenantMetrics";
import { useTenant } from "@/hooks/useTenant";

export function ActivityChart() {
  const { tenantId } = useTenant();
  const data = activityChartData[tenantId ?? 'dobroservice'] ?? activityChartData.dobroservice;

  return (
    <div className="glass-card p-4">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expertGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(280 80% 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(280 80% 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              interval={4}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Area
              type="monotone"
              dataKey="aiRequests"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#aiGradient)"
              name="AI-запросы"
            />
            <Area
              type="monotone"
              dataKey="escalations"
              stroke="hsl(280 80% 50%)"
              strokeWidth={2}
              fill="url(#expertGradient)"
              name="Эскалации"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">AI-запросы</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(280 80% 50%)' }} />
          <span className="text-xs text-muted-foreground">Эскалации</span>
        </div>
      </div>
    </div>
  );
}
