import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-slate-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center">
            {item.href && !isLast ? (
              <Link href={item.href} className="font-medium text-slate-500 transition hover:text-slate-900">
                {item.label}
              </Link>
            ) : (
              <span className={cn("font-medium", isLast ? "text-slate-900" : "")}>{item.label}</span>
            )}
            {!isLast && <ChevronRight className="mx-2 h-4 w-4" aria-hidden />}
          </span>
        );
      })}
    </nav>
  );
}
