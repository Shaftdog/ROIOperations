import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/services/orders-service";
import { mockOrders, mockOrderHistory, mockOrderNotes, mockOrderDocuments } from "@/lib/utils/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { DocumentsManager } from "@/components/orders/documents-manager";
import { NotesPanel } from "@/components/orders/notes-panel";
import { SimilarOrders } from "@/components/orders/similar-orders";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const workflowSteps = ["new", "assigned", "scheduled", "in_progress", "in_review", "completed", "delivered"] as const;

async function fetchOrderSafe(id: string) {
  try {
    const data = await getOrderById(id);
    return data ?? null;
  } catch (error) {
    return mockOrders.find((order) => order.id === id) ?? null;
  }
}

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await fetchOrderSafe(params.id);
  if (!order) {
    notFound();
  }

  const timelineEntries = mockOrderHistory.filter((entry) => entry.order_id === order.id);
  const notes = mockOrderNotes.filter((note) => note.order_id === order.id);
  const documents = mockOrderDocuments.filter((doc) => doc.order_id === order.id);
  const similarOrders = mockOrders.filter(
    (item) => item.id !== order.id && (item.property_address === order.property_address || item.client_id === order.client_id)
  ).slice(0, 3);

  const currentStepIndex = workflowSteps.findIndex((step) => step === order.status);
  const progressValue = ((currentStepIndex + 1) / workflowSteps.length) * 100;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Orders", href: "/orders" }, { label: order.order_number }]} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{order.order_number}</CardTitle>
              <p className="text-sm text-slate-500">
                {order.property_address}, {order.property_city}, {order.property_state} {order.property_zip}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Progress value={progressValue} />
              <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-slate-400">
                {workflowSteps.map((step, index) => (
                  <span key={step} className={index <= currentStepIndex ? "text-primary" : ""}>
                    {step.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Client</h4>
                <p className="mt-2 text-sm font-semibold">{order.metadata?.client_name ?? order.client_id}</p>
                <p className="text-xs text-slate-500">Loan officer: {order.loan_officer}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Financial</h4>
                <p className="mt-2 text-sm">Loan: {order.loan_number}</p>
                <p className="text-xs text-slate-500">{formatCurrency(order.loan_amount)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Due</h4>
                <p className="mt-2 text-lg font-bold text-primary">{formatDate(order.due_date)}</p>
                <p className="text-xs text-slate-500">Priority: {order.priority}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Change status</Button>
              <Button size="sm" variant="outline">
                Assign appraiser
              </Button>
              <Button size="sm" variant="outline">
                Schedule inspection
              </Button>
              <Button size="sm" variant="outline">
                Print package
              </Button>
            </div>
          </CardContent>
        </Card>
        <SimilarOrders orders={similarOrders} />
      </div>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Workflow activity</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderTimeline entries={timelineEntries} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Assignment details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>Assigned to: {order.metadata?.assigned_name ?? "Unassigned"}</p>
                <p>Borrower: {order.borrower_name}</p>
                <p>Contact: {order.property_contact_name}</p>
                <p>Phone: {order.property_contact_phone}</p>
                <p>Email: {order.property_contact_email}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="documents">
          <DocumentsManager documents={documents} />
        </TabsContent>
        <TabsContent value="communication">
          <div className="grid gap-6 lg:grid-cols-2">
            <NotesPanel notes={notes} />
            <Card>
              <CardHeader>
                <CardTitle>Email & SMS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-600">
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <h4 className="font-semibold">Latest email</h4>
                  <p className="mt-2 text-xs text-slate-500">From lender@mortgageco.com • Yesterday</p>
                  <p className="mt-2">Can we confirm the inspection time for tomorrow morning?</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <h4 className="font-semibold">SMS thread</h4>
                  <p className="mt-2 text-xs text-slate-500">Borrower • Today 9:12 AM</p>
                  <p>Appraiser will arrive at 9:30 AM. Please have pets secured.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Audit trail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              {timelineEntries.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{entry.action.replace(/_/g, " ")}</span>
                    <span>{formatDate(entry.created_at)}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{entry.notes}</p>
                  <div className="mt-1 text-xs text-slate-500">
                    {entry.from_value && <span className="mr-2 line-through">From {entry.from_value}</span>}
                    {entry.to_value && <span>To {entry.to_value}</span>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
