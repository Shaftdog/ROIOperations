import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function Avatar({ className, fallback, ...props }: AvatarProps) {
  if (props.src) {
    return <img className={cn("h-9 w-9 rounded-full object-cover", className)} alt={props.alt} {...props} />;
  }

  return (
    <div className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-medium text-slate-600", className)} aria-hidden>
      {fallback?.slice(0, 2).toUpperCase()}
    </div>
  );
}
