import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-200", className)} {...props}>
      <div style={{ width: `${value}%` }} className="h-full bg-primary transition-all duration-300" />
    </div>
  );
}
