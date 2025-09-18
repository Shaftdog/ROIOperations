import { getOrders } from "@/lib/services/orders-service";
import { mockOrders } from "@/lib/utils/mock-data";
import { OrdersTable } from "@/components/orders/orders-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Upload } from "lucide-react";
import { QuickEntryModal } from "@/components/orders/quick-entry-modal";
import { Breadcrumb } from "@/components/ui/breadcrumb";

async function fetchOrdersSafe() {
  try {
    const data = await getOrders();
    return data.length ? data : mockOrders;
  } catch (error) {
    return mockOrders;
  }
}

export default async function OrdersPage() {
  const orders = await fetchOrdersSafe();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Orders" }]} />
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Orders</h1>
          <p className="text-sm text-slate-500">Search, filter, and manage your entire appraisal pipeline.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <QuickEntryModal>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" /> Quick entry
            </Button>
          </QuickEntryModal>
          <Button asChild size="sm">
            <Link href="/orders/new">
              <Plus className="mr-2 h-4 w-4" /> New order
            </Link>
          </Button>
        </div>
      </div>
      <OrdersTable initialData={orders.slice(0, 25)} />
      <Button asChild className="fixed bottom-24 right-6 z-40 h-14 w-14 rounded-full shadow-lg lg:hidden" size="icon">
        <Link href="/orders/new">
          <Plus className="h-6 w-6" />
        </Link>
      </Button>
    </div>
  );
}
