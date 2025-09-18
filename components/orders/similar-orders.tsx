import type { Order } from "@/types/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatCurrency } from "@/lib/utils/format";
import Link from "next/link";

interface SimilarOrdersProps {
  orders: Order[];
}

export function SimilarOrders({ orders }: SimilarOrdersProps) {
  if (!orders.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border border-slate-200 p-3 hover:border-primary dark:border-slate-800">
            <div className="flex items-center justify-between">
              <Link href={`/orders/${order.id}`} className="font-semibold text-primary hover:underline">
                {order.order_number}
              </Link>
              <span>{formatCurrency(order.total_amount ?? order.fee_amount)}</span>
            </div>
            <p className="text-xs text-slate-500">Due {formatDate(order.due_date)}</p>
            <p className="text-xs text-slate-500">{order.property_address}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
