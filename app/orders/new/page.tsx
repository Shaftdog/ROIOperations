import { getOrderTemplates } from "@/lib/services/orders-service";
import { mockClients, mockOrderTemplates } from "@/lib/utils/mock-data";
import { OrderForm } from "@/components/orders/order-form";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default async function NewOrderPage() {
  const templates = (await getOrderTemplates().catch(() => mockOrderTemplates)) ?? mockOrderTemplates;
  const clients = mockClients;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Orders", href: "/orders" }, { label: "New order" }]} />
      <OrderForm clients={clients} templates={templates} />
    </div>
  );
}
