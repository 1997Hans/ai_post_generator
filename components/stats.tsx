import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart, CheckCircle, Clock, XCircle } from "lucide-react";

interface StatsProps {
  name: string;
  value: number;
  description: string;
  trend: "up" | "down" | "neutral";
  increase: string;
  icon: string;
}

const Icons = {
  BarChart: BarChart,
  CheckCircle: CheckCircle,
  Clock: Clock,
  XCircle: XCircle,
};

export function Stats({
  name,
  value,
  description,
  trend,
  increase,
  icon,
}: StatsProps) {
  const IconComponent = Icons[icon as keyof typeof Icons] || BarChart;
  
  const trendColors = {
    up: "text-emerald-500",
    down: "text-rose-500",
    neutral: "text-amber-500"
  };
  
  const trendBgColors = {
    up: "bg-emerald-500/10",
    down: "bg-rose-500/10",
    neutral: "bg-amber-500/10"
  };
  
  const trendIcons = {
    up: "↑",
    down: "↓",
    neutral: "→"
  };

  return (
    <Card className="stats-card bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-primary/10 transition-all relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="text-sm font-medium text-muted-foreground">
          {name}
        </div>
        <div className={`rounded-full p-1.5 ${trendBgColors[trend]} ${trendColors[trend]}`}>
          <IconComponent className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex-grow flex flex-col justify-between">
        <div className="text-3xl font-bold text-foreground transition-transform group-hover:scale-105 duration-300">
          {value}
        </div>
        <div className="flex flex-col gap-1 mt-auto">
          <p className="text-xs text-muted-foreground">{description}</p>
          <div className="flex items-center mt-1">
            <span className={`flex items-center justify-center h-5 w-5 rounded-full ${trendColors[trend]} ${trendBgColors[trend]} mr-1.5`}>
              {trendIcons[trend]}
            </span>
            <span className={`text-xs font-medium ${trendColors[trend]}`}>
              {increase}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 