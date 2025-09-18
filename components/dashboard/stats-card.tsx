import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface StatsCardProps {
  title: string;
  description?: string;
  value: string | number;
  trend?: {
    value: string;
    label: string;
    positive?: boolean;
  };
  icon?: React.ReactNode;
}

export function StatsCard({ title, description, value, trend, icon }: StatsCardProps) {
  return (
    <Card className="border-0 bg-gradient-to-br from-white via-white to-slate-50 shadow-subtle dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {icon && <div className="rounded-full bg-primary/10 p-3 text-primary">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{value}</div>
        {trend && (
          <p className={cn("mt-2 text-xs font-medium", trend.positive ? "text-green-600" : "text-danger")}>{trend.value}{" "}{trend.label}</p>
        )}
      </CardContent>
    </Card>
  );
}
