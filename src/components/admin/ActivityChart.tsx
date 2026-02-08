import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const DATA = [
  { day: "Пн", ai: 1200, experts: 45 },
  { day: "Вт", ai: 1450, experts: 52 },
  { day: "Ср", ai: 1320, experts: 48 },
  { day: "Чт", ai: 1680, experts: 61 },
  { day: "Пт", ai: 1890, experts: 73 },
  { day: "Сб", ai: 980, experts: 32 },
  { day: "Вс", ai: 750, experts: 28 },
];

export function ActivityChart() {
  return (
    <div className="glass-card p-4">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              dataKey="day" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
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
              dataKey="ai"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#aiGradient)"
              name="AI-запросы"
            />
            <Area
              type="monotone"
              dataKey="experts"
              stroke="hsl(280 80% 50%)"
              strokeWidth={2}
              fill="url(#expertGradient)"
              name="К экспертам"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">AI-запросы</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(280 80% 50%)' }} />
          <span className="text-xs text-muted-foreground">К экспертам</span>
        </div>
      </div>
    </div>
  );
}
