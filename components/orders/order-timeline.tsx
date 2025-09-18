import { formatDistanceToNow } from "date-fns";
import { Avatar } from "@/components/ui/avatar";
import type { OrderHistoryEntry } from "@/types/orders";
import { Activity, CheckCircle2, Clock, FileText, RefreshCcw } from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  status_changed: CheckCircle2,
  assigned: Activity,
  updated: RefreshCcw,
  document_uploaded: FileText,
  scheduled: Clock,
};

interface OrderTimelineProps {
  entries: OrderHistoryEntry[];
}

export function OrderTimeline({ entries }: OrderTimelineProps) {
  return (
    <ol className="relative space-y-6 border-l border-slate-200 px-6 py-6 dark:border-slate-800">
      {entries.map((entry) => {
        const Icon = ICONS[entry.action] ?? Activity;
        return (
          <li key={entry.id} className="ml-6">
            <span className="absolute -left-[27px] flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold capitalize">{entry.action.replace(/_/g, " ")}</p>
              <span className="text-xs text-slate-500">
                {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
              </span>
            </div>
            {entry.notes && <p className="mt-1 text-sm text-slate-600">{entry.notes}</p>}
            {(entry.from_value || entry.to_value) && (
              <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/60">
                {entry.from_value && <p className="line-through">From: {entry.from_value}</p>}
                {entry.to_value && <p>To: {entry.to_value}</p>}
              </div>
            )}
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
              <Avatar fallback={entry.changed_by ?? "SYS"} className="h-7 w-7" />
              <span>{entry.changed_by ? `Updated by ${entry.changed_by}` : "System event"}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
