export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          order_number: string;
          status: string;
          priority: string;
          order_type: string;
          property_address: string;
          property_city: string;
          property_state: string;
          property_zip: string;
          property_type: string;
          loan_number: string | null;
          loan_type: string | null;
          loan_amount: number | null;
          client_id: string;
          lender_name: string | null;
          loan_officer: string | null;
          loan_officer_email: string | null;
          loan_officer_phone: string | null;
          processor_name: string | null;
          processor_email: string | null;
          processor_phone: string | null;
          borrower_name: string | null;
          borrower_email: string | null;
          borrower_phone: string | null;
          property_contact_name: string | null;
          property_contact_phone: string | null;
          property_contact_email: string | null;
          access_instructions: string | null;
          special_instructions: string | null;
          due_date: string | null;
          ordered_date: string | null;
          completed_date: string | null;
          delivered_date: string | null;
          fee_amount: number | null;
          tech_fee: number | null;
          total_amount: number | null;
          assigned_to: string | null;
          assigned_date: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string | null;
          metadata: Json | null;
        };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
      };
      clients: {
        Row: {
          id: string;
          company_name: string;
          primary_contact: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          billing_address: string | null;
          payment_terms: number | null;
          fee_schedule: Json | null;
          preferred_turnaround: number | null;
          special_requirements: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["clients"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["clients"]["Row"]>;
      };
      order_history: {
        Row: {
          id: string;
          order_id: string;
          action: string;
          from_value: string | null;
          to_value: string | null;
          changed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["order_history"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["order_history"]["Row"]>;
      };
      order_documents: {
        Row: {
          id: string;
          order_id: string;
          document_type: string;
          file_name: string;
          file_url: string;
          file_size: number;
          uploaded_by: string;
          uploaded_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["order_documents"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["order_documents"]["Row"]>;
      };
      order_notes: {
        Row: {
          id: string;
          order_id: string;
          note: string;
          is_internal: boolean;
          created_by: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["order_notes"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["order_notes"]["Row"]>;
      };
      order_templates: {
        Row: {
          id: string;
          name: string;
          client_id: string;
          defaults: Json;
          created_by: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["order_templates"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["order_templates"]["Row"]>;
      };
    };
  };
}
