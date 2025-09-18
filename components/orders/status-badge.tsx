import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/orders";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const STATUS_COLORS: Record<OrderStatus, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  assigned: "bg-yellow-100 text-yellow-800 border-yellow-200",
  scheduled: "bg-purple-100 text-purple-800 border-purple-200",
  in_progress: "bg-orange-100 text-orange-800 border-orange-200",
  in_review: "bg-indigo-100 text-indigo-800 border-indigo-200",
  revisions: "bg-amber-100 text-amber-800 border-amber-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  delivered: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  new: "Order received and pending triage",
  assigned: "Assigned to an appraiser",
  scheduled: "Inspection scheduled with contact",
  in_progress: "Appraisal is in progress",
  in_review: "Internal review is underway",
  revisions: "Awaiting requested revisions",
  completed: "Appraisal completed",
  delivered: "Report delivered to client",
  cancelled: "Order cancelled",
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`border ${STATUS_COLORS[status]} capitalize`}>{status.replace(/_/g, " ")}</Badge>
        </TooltipTrigger>
        <TooltipContent>{STATUS_DESCRIPTIONS[status]}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
