import type { Client, Order } from "@/types/orders";
import { addDays, formatISO } from "date-fns";
import { randomUUID } from "crypto";

export const mockClients: Client[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    company_name: "Summit Lending",
    primary_contact: "Jordan Blake",
    email: "jordan@summitlending.com",
    phone: "(206) 555-1234",
    address: "500 Pine St, Seattle, WA",
    billing_address: "500 Pine St, Seattle, WA",
    payment_terms: 30,
    fee_schedule: { single_family: 650 },
    preferred_turnaround: 7,
    special_requirements: "Rush orders flagged",
    is_active: true,
    created_at: formatISO(new Date()),
    updated_at: formatISO(new Date()),
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    company_name: "Northwest Credit Union",
    primary_contact: "Morgan Lee",
    email: "morgan@ncu.org",
    phone: "(425) 555-9876",
    address: "200 Market St, Portland, OR",
    billing_address: "200 Market St, Portland, OR",
    payment_terms: 30,
    fee_schedule: { condo: 700 },
    preferred_turnaround: 5,
    special_requirements: "Send borrower updates via SMS",
    is_active: true,
    created_at: formatISO(new Date()),
    updated_at: formatISO(new Date()),
  },
];

export const mockOrders: Order[] = Array.from({ length: 12 }).map((_, index) => {
  const dueDate = addDays(new Date(), index % 5);
  return {
    id: randomUUID(),
    order_number: `APR-2024-${String(index + 1).padStart(4, "0")}`,
    status: ["new", "assigned", "in_progress", "in_review", "completed", "delivered"][(index + 2) % 6] as Order["status"],
    priority: ["rush", "high", "normal", "low"][index % 4] as Order["priority"],
    order_type: ["purchase", "refinance", "estate", "tax_appeal"][(index + 1) % 4] as Order["order_type"],
    property_address: `${420 + index} Market Street`,
    property_city: index % 2 === 0 ? "Seattle" : "Portland",
    property_state: index % 2 === 0 ? "WA" : "OR",
    property_zip: index % 2 === 0 ? "98101" : "97204",
    property_type: ["single_family", "condo", "commercial", "land"][(index + 3) % 4] as Order["property_type"],
    loan_number: `LN-${1000 + index}`,
    loan_type: "Conventional",
    loan_amount: 350000 + index * 5000,
    client_id: mockClients[index % mockClients.length].id,
    lender_name: "Summit Lending",
    loan_officer: "Jordan Blake",
    loan_officer_email: "jordan@summitlending.com",
    loan_officer_phone: "(206) 555-1234",
    processor_name: "Robin Chen",
    processor_email: "robin@summitlending.com",
    processor_phone: "(206) 555-7890",
    borrower_name: `Borrower ${index + 1}`,
    borrower_email: `borrower${index + 1}@example.com`,
    borrower_phone: "(206) 555-4567",
    property_contact_name: `Contact ${index + 1}`,
    property_contact_phone: "(206) 555-1111",
    property_contact_email: `contact${index + 1}@example.com`,
    access_instructions: "Lockbox code 2468",
    special_instructions: "Call borrower before arriving",
    due_date: formatISO(dueDate),
    ordered_date: formatISO(addDays(new Date(), -index)),
    completed_date: index % 6 > 3 ? formatISO(addDays(dueDate, -1)) : undefined,
    delivered_date: index % 6 > 4 ? formatISO(addDays(dueDate, 1)) : undefined,
    fee_amount: 650 + index * 25,
    tech_fee: 35,
    total_amount: 650 + index * 25 + 35,
    assigned_to: "33333333-3333-3333-3333-333333333333",
    assigned_date: formatISO(addDays(new Date(), -index + 1)),
    created_by: "33333333-3333-3333-3333-333333333333",
    created_at: formatISO(addDays(new Date(), -index)),
    updated_at: formatISO(addDays(new Date(), -index + 1)),
    metadata: {
      client_name: mockClients[index % mockClients.length].company_name,
      assigned_name: index % 2 === 0 ? "Taylor Appraiser" : "Devon Field",
      lat: 47.6 + index * 0.01,
      lng: -122.33 - index * 0.01,
    },
  };
});

export const mockOrderHistory = mockOrders.slice(0, 1).map((order) => [
  {
    id: randomUUID(),
    order_id: order.id,
    action: "status_changed",
    from_value: "new",
    to_value: order.status,
    changed_by: "Taylor Appraiser",
    notes: "Order moved through workflow",
    created_at: order.created_at ?? formatISO(new Date()),
  },
  {
    id: randomUUID(),
    order_id: order.id,
    action: "document_uploaded",
    from_value: null,
    to_value: "Purchase agreement",
    changed_by: "Morgan Lee",
    notes: "Uploaded purchase agreement",
    created_at: formatISO(new Date()),
  },
] as const).flat();

export const mockOrderNotes = mockOrders.slice(0, 1).map((order) => [
  {
    id: randomUUID(),
    order_id: order.id,
    note: "Borrower prefers morning appointments.",
    is_internal: false,
    created_by: "Taylor Appraiser",
    created_at: formatISO(new Date()),
  },
  {
    id: randomUUID(),
    order_id: order.id,
    note: "Client requested rush turn time.",
    is_internal: true,
    created_by: "Coordinator",
    created_at: formatISO(new Date()),
  },
] as const).flat();

export const mockOrderDocuments = mockOrders.slice(0, 1).map((order) => [
  {
    id: randomUUID(),
    order_id: order.id,
    document_type: "contract",
    file_name: "PurchaseAgreement.pdf",
    file_url: "https://example.com/PurchaseAgreement.pdf",
    file_size: 254000,
    uploaded_by: "Morgan Lee",
    uploaded_at: formatISO(new Date()),
  },
] as const).flat();

export const mockOrderTemplates = [
  {
    id: randomUUID(),
    name: "Rush purchase",
    client_id: mockClients[0].id,
    defaults: {
      priority: "rush",
      fee_amount: 750,
      tech_fee: 35,
      special_instructions: "Rush order - notify QC immediately.",
    },
    created_by: "33333333-3333-3333-3333-333333333333",
    created_at: formatISO(new Date()),
  },
];
