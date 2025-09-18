import { Metadata } from "next";
import { getOrders } from "@/lib/services/orders-service";
import { mockOrders } from "@/lib/utils/mock-data";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { OrdersStatusChart } from "@/components/dashboard/orders-status-chart";
import { TodaysOrdersMap } from "@/components/dashboard/todays-orders-map";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Dashboard | ROI Operations",
};

async function fetchOrdersSafe() {
  try {
    const data = await getOrders();
    return data.length ? data : mockOrders;
  } catch (error) {
    console.warn("Falling back to mock orders", error);
    return mockOrders;
  }
}

export default async function DashboardPage() {
  const orders = await fetchOrdersSafe();
  const today = format(new Date(), "yyyy-MM-dd");
  const newOrdersToday = orders.filter((order) => order.ordered_date?.startsWith(today)).length;
  const inProgress = orders.filter((order) => ["assigned", "scheduled", "in_progress"].includes(order.status)).length;
  const dueToday = orders.filter((order) => order.due_date?.startsWith(today)).length;
  const overdue = orders.filter((order) => order.due_date && order.due_date < new Date().toISOString() && order.status !== "completed" && order.status !== "delivered").length;
  const statusCounts = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] ?? 0) + 1;
    return acc;
  }, {});
  const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
  const todaysOrders = orders.filter((order) => order.ordered_date?.startsWith(today));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Team performance overview</h1>
          <p className="text-sm text-slate-500">Monitor your pipeline, track due dates, and jump into action quickly.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search orders" className="w-64 rounded-full pl-9" />
          </div>
          <Button asChild>
            <Link href="/orders/new">
              <Plus className="mr-2 h-4 w-4" /> New order
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="New orders today" value={newOrdersToday} description="Orders created in the last 24 hours" icon={<Plus className="h-5 w-5" />} trend={{ value: "+12%", label: "vs yesterday", positive: true }} />
        <StatsCard title="In progress" value={inProgress} description="Assigned, scheduled and active" icon={<Search className="h-5 w-5" />} trend={{ value: "+4", label: "vs last week", positive: true }} />
        <StatsCard title="Due today" value={dueToday} description="Orders due in next 24 hours" icon={<Search className="h-5 w-5" />} trend={{ value: "-2", label: "vs average", positive: true }} />
        <StatsCard title="Overdue" value={overdue} description="Need immediate attention" icon={<Search className="h-5 w-5" />} trend={{ value: "+3", label: "vs target", positive: false }} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentOrders orders={orders.slice(0, 10)} />
        </div>
        <OrdersStatusChart data={statusChartData} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <TodaysOrdersMap orders={todaysOrders} />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Quick actions</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• Auto-assign rush orders to available appraisers</li>
            <li>• Send lender status update emails</li>
            <li>• Review flagged duplicate requests</li>
            <li>• Monitor SMS replies from borrowers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
