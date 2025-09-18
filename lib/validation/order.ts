import { z } from "zod";

export const orderFormSchema = z
  .object({
    property_address: z.string().min(3),
    property_city: z.string().min(2),
    property_state: z.string().length(2),
    property_zip: z.string().min(5),
    property_type: z.string(),
    access_instructions: z.string().optional(),
    special_instructions: z.string().optional(),
    loan_type: z.string().optional(),
    loan_number: z.string().optional(),
    loan_amount: z.coerce.number().min(0).optional(),
    order_type: z.string(),
    client_id: z.string().uuid("Client is required"),
    loan_officer: z.string().optional(),
    loan_officer_email: z.string().email().optional(),
    loan_officer_phone: z.string().optional(),
    processor_name: z.string().optional(),
    processor_email: z.string().email().optional(),
    processor_phone: z.string().optional(),
    borrower_name: z.string().min(3),
    borrower_email: z.string().email().optional(),
    borrower_phone: z.string().optional(),
    property_contact_name: z.string().optional(),
    property_contact_phone: z.string().optional(),
    property_contact_email: z.string().email().optional(),
    priority: z.string(),
    due_date: z.coerce.date(),
    fee_amount: z.coerce.number().min(0),
    tech_fee: z.coerce.number().min(0).optional(),
    assigned_to: z.string().uuid().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.due_date < new Date()) {
      ctx.addIssue({
        path: ["due_date"],
        code: z.ZodIssueCode.custom,
        message: "Due date must be in the future",
      });
    }
  });

export type OrderFormValues = z.infer<typeof orderFormSchema> & {
  total_amount?: number;
};
