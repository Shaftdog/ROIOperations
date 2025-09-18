import Link from "next/link";
import type { Order } from "@/types/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { formatDate, formatCurrency } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent orders</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/orders">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Fee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-semibold">
                  <Link href={`/orders/${order.id}`} className="text-primary hover:underline">
                    {order.order_number}
                  </Link>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{order.property_address}</p>
                  <p className="text-xs text-slate-500">
                    {order.property_city}, {order.property_state}
                  </p>
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>{formatDate(order.due_date)}</TableCell>
                <TableCell>{formatCurrency(order.total_amount ?? order.fee_amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
