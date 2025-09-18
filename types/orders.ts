export type OrderStatus =
  | "new"
  | "assigned"
  | "scheduled"
  | "in_progress"
  | "in_review"
  | "revisions"
  | "completed"
  | "delivered"
  | "cancelled";

export type OrderPriority = "rush" | "high" | "normal" | "low";

export type OrderType =
  | "purchase"
  | "refinance"
  | "home_equity"
  | "estate"
  | "divorce"
  | "tax_appeal"
  | "other";

export type PropertyType =
  | "single_family"
  | "condo"
  | "multi_family"
  | "commercial"
  | "land"
  | "manufactured";

export type DocumentType =
  | "contract"
  | "report"
  | "invoice"
  | "photo"
  | "comparable"
  | "other";

export interface Client {
  id: string;
  company_name: string;
  primary_contact: string;
  email: string;
  phone?: string;
  address?: string;
  billing_address?: string;
  payment_terms?: number;
  fee_schedule?: Record<string, number>;
  preferred_turnaround?: number;
  special_requirements?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  priority: OrderPriority;
  order_type: OrderType;
  property_address: string;
  property_city: string;
  property_state: string;
  property_zip: string;
  property_type: PropertyType;
  loan_number?: string;
  loan_type?: string;
  loan_amount?: number;
  client_id: string;
  lender_name?: string;
  loan_officer?: string;
  loan_officer_email?: string;
  loan_officer_phone?: string;
  processor_name?: string;
  processor_email?: string;
  processor_phone?: string;
  borrower_name?: string;
  borrower_email?: string;
  borrower_phone?: string;
  property_contact_name?: string;
  property_contact_phone?: string;
  property_contact_email?: string;
  access_instructions?: string;
  special_instructions?: string;
  due_date?: string;
  ordered_date?: string;
  completed_date?: string;
  delivered_date?: string;
  fee_amount?: number;
  tech_fee?: number;
  total_amount?: number;
  assigned_to?: string;
  assigned_date?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, unknown>;
}

export interface OrderHistoryEntry {
  id: string;
  order_id: string;
  action: string;
  from_value?: string;
  to_value?: string;
  changed_by?: string;
  notes?: string;
  created_at: string;
}

export interface OrderNote {
  id: string;
  order_id: string;
  note: string;
  is_internal: boolean;
  created_by: string;
  created_at: string;
}

export interface OrderDocument {
  id: string;
  order_id: string;
  document_type: DocumentType;
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
}

export interface OrderTemplate {
  id: string;
  name: string;
  client_id: string;
  defaults: Partial<Order>;
  created_by: string;
  created_at: string;
}
