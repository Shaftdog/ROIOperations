"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderFormSchema, type OrderFormValues } from "@/lib/validation/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClientSelector } from "@/components/orders/client-selector";
import type { Client, OrderTemplate } from "@/types/orders";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import { formatCurrency, formatPhoneNumber } from "@/lib/utils/format";
import { toast } from "sonner";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "roioperations-order-form";

const steps = [
  { id: "property", label: "Property information" },
  { id: "loan", label: "Loan details" },
  { id: "contacts", label: "Contacts" },
  { id: "order", label: "Order details" },
  { id: "review", label: "Review & submit" },
] as const;

interface OrderFormProps {
  clients: Client[];
  templates?: OrderTemplate[];
  initialData?: Partial<OrderFormValues>;
  onSubmit?: (values: OrderFormValues) => Promise<void> | void;
}

export function OrderForm({ clients, templates = [], initialData, onSubmit }: OrderFormProps) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    mode: "onChange",
    defaultValues: {
      property_address: "",
      property_city: "",
      property_state: "",
      property_zip: "",
      property_type: "single_family",
      loan_type: "",
      loan_number: "",
      loan_amount: 0,
      order_type: "purchase",
      client_id: clients[0]?.id ?? "00000000-0000-0000-0000-000000000000",
      borrower_name: "",
      borrower_email: "",
      borrower_phone: "",
      priority: "normal",
      due_date: new Date(Date.now() + 1000 * 60 * 60 * 24),
      fee_amount: 0,
      tech_fee: 0,
      access_instructions: "",
      special_instructions: "",
      property_city: "",
      property_state: "",
      property_zip: "",
      property_contact_name: "",
      property_contact_phone: "",
      property_contact_email: "",
      processor_name: "",
      processor_email: "",
      processor_phone: "",
      loan_officer: "",
      loan_officer_email: "",
      loan_officer_phone: "",
      assigned_to: undefined,
      ...initialData,
    },
  });

  const [activeStep, setActiveStep] = useState(0);
  const [autoAssign, setAutoAssign] = useState(true);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const propertyAddress = form.watch("property_address");
  const debouncedAddress = useDebouncedValue(propertyAddress, 500);
  const techFee = form.watch("tech_fee");
  const feeAmount = form.watch("fee_amount");

  const totalAmount = useMemo(() => {
    const fee = Number(feeAmount) || 0;
    const tech = Number(techFee) || 0;
    return fee + tech;
  }, [feeAmount, techFee]);

  const values = form.watch();

  useEffect(() => {
    form.setValue("tech_fee", Number(techFee) || 0, { shouldValidate: false });
  }, [techFee, form]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && !initialData) {
      try {
        const parsed = JSON.parse(stored) as OrderFormValues;
        form.reset(parsed);
      } catch (error) {
        console.warn("Failed to parse order form draft", error);
      }
    }
  }, [form, initialData]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...values, total_amount: totalAmount }));
      toast.success("Draft auto-saved", { duration: 1500 });
    }, 30000);

    return () => window.clearInterval(interval);
  }, [values, totalAmount]);

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSimpleMode(mobile);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!debouncedAddress) {
      setDuplicateWarning(null);
      return;
    }

    const controller = new AbortController();
    const check = async () => {
      const response = await fetch(`/api/orders?duplicate=${encodeURIComponent(debouncedAddress)}`, {
        signal: controller.signal,
      });
      if (!response.ok) return;
      const data = await response.json();
      if (data.hasDuplicate) {
        setDuplicateWarning(data.message ?? "Possible duplicate order detected");
      } else {
        setDuplicateWarning(null);
      }
    };
    check();
    return () => controller.abort();
  }, [debouncedAddress]);

  useEffect(() => {
    if (initialData) return;
    const template = templates[0];
    if (template) {
      form.reset({ ...form.getValues(), ...template.defaults });
    }
  }, [templates, initialData, form]);

  const handleTemplateApply = (templateId: string) => {
    const template = templates.find((item) => item.id === templateId);
    if (!template) return;
    form.reset({ ...form.getValues(), ...template.defaults });
    toast.info(`Template "${template.name}" applied`);
  };

  const nextStep = () => setActiveStep((step) => Math.min(step + 1, steps.length - 1));
  const prevStep = () => setActiveStep((step) => Math.max(step - 1, 0));

  const handleSubmit = form.handleSubmit(async (formValues) => {
    const payload = { ...formValues, total_amount: totalAmount, autoAssign };
    if (onSubmit) {
      await onSubmit(payload);
    } else {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Order saved successfully");
  });

  const StepIndicator = () => (
    <div className="flex items-center justify-between gap-3">
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        return (
          <button
            key={step.id}
            type="button"
            className={cn(
              "flex-1 rounded-full border px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide transition",
              isActive
                ? "border-primary bg-primary/10 text-primary"
                : isCompleted
                  ? "border-green-200 bg-green-100 text-green-700"
                  : "border-slate-200 text-slate-500"
            )}
            onClick={() => setActiveStep(index)}
          >
            <span className="block text-sm font-semibold capitalize">{step.label}</span>
          </button>
        );
      })}
    </div>
  );

  if (isMobile && simpleMode) {
    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Quick mobile entry</h3>
          <p className="text-sm text-slate-500">Capture the essentials. Switch to full form for advanced details.</p>
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="mobile-address">Property address</Label>
              <Input id="mobile-address" {...form.register("property_address")} />
            </div>
            <div>
              <Label>Client</Label>
              <ClientSelector clients={clients} value={form.watch("client_id")} onChange={(value) => form.setValue("client_id", value)} />
            </div>
            <div>
              <Label htmlFor="mobile-borrower">Borrower</Label>
              <Input id="mobile-borrower" {...form.register("borrower_name")} />
            </div>
            <div>
              <Label htmlFor="mobile-due-date">Due date</Label>
              <Input id="mobile-due-date" type="date" {...form.register("due_date", { valueAsDate: true })} />
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={form.watch("priority")} onValueChange={(value) => form.setValue("priority", value as OrderFormValues["priority"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rush">Rush</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mobile-notes">Special instructions</Label>
              <Textarea id="mobile-notes" {...form.register("special_instructions")} rows={3} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={() => setSimpleMode(false)}>
            Switch to full form
          </Button>
          <Button type="submit">Submit order</Button>
        </div>
      </form>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Create new order</h2>
              <p className="text-sm text-slate-500">Multi-step workflow with auto-save and duplicate detection.</p>
            </div>
            {templates.length > 0 && (
              <Select onValueChange={handleTemplateApply}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Apply template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <StepIndicator />
        </div>
        {duplicateWarning && (
          <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {duplicateWarning}
          </div>
        )}
      </div>

      {activeStep === 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Property information</h3>
          <p className="text-sm text-slate-500">Use autocomplete-enabled address field for quick data entry.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="property_address">Property address</Label>
              <Input id="property_address" {...form.register("property_address")} placeholder="123 Main Street" autoComplete="street-address" />
            </div>
            <div>
              <Label htmlFor="property_city">City</Label>
              <Input id="property_city" {...form.register("property_city")} placeholder="Seattle" />
            </div>
            <div>
              <Label htmlFor="property_state">State</Label>
              <Input id="property_state" {...form.register("property_state")} placeholder="WA" maxLength={2} />
            </div>
            <div>
              <Label htmlFor="property_zip">ZIP</Label>
              <Input id="property_zip" {...form.register("property_zip")} placeholder="98101" />
            </div>
            <div>
              <Label>Property type</Label>
              <Select value={form.watch("property_type") ?? "single_family"} onValueChange={(value) => form.setValue("property_type", value as OrderFormValues["property_type"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single_family">Single family</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="multi_family">Multi-family</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="manufactured">Manufactured</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="access_instructions">Access instructions</Label>
              <Textarea id="access_instructions" {...form.register("access_instructions")} placeholder="Gate code, lockbox, etc." rows={3} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="special_instructions">Special instructions</Label>
              <Textarea id="special_instructions" {...form.register("special_instructions")} rows={4} placeholder="Any additional notes for the appraiser" />
            </div>
          </div>
        </section>
      )}

      {activeStep === 1 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Loan information</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="order_type">Order type</Label>
              <Select value={form.watch("order_type")} onValueChange={(value) => form.setValue("order_type", value as OrderFormValues["order_type"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="refinance">Refinance</SelectItem>
                  <SelectItem value="home_equity">Home equity</SelectItem>
                  <SelectItem value="estate">Estate</SelectItem>
                  <SelectItem value="divorce">Divorce</SelectItem>
                  <SelectItem value="tax_appeal">Tax appeal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="loan_type">Loan type</Label>
              <Input id="loan_type" {...form.register("loan_type")} placeholder="Conventional" />
            </div>
            <div>
              <Label htmlFor="loan_number">Loan number</Label>
              <Input id="loan_number" {...form.register("loan_number")} placeholder="123456" />
            </div>
            <div>
              <Label htmlFor="loan_amount">Loan amount</Label>
              <Input id="loan_amount" type="number" step="0.01" {...form.register("loan_amount", { valueAsNumber: true })} placeholder="250000" />
            </div>
          </div>
        </section>
      )}

      {activeStep === 2 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Contact information</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>Client</Label>
              <ClientSelector clients={clients} value={form.watch("client_id")} onChange={(value) => form.setValue("client_id", value)} />
            </div>
            <div>
              <Label htmlFor="loan_officer">Loan officer</Label>
              <Input id="loan_officer" {...form.register("loan_officer")} />
            </div>
            <div>
              <Label htmlFor="loan_officer_email">Loan officer email</Label>
              <Input id="loan_officer_email" type="email" {...form.register("loan_officer_email")} />
            </div>
            <div>
              <Label htmlFor="loan_officer_phone">Loan officer phone</Label>
              <Input
                id="loan_officer_phone"
                {...form.register("loan_officer_phone", {
                  onChange: (event) => {
                    form.setValue("loan_officer_phone", formatPhoneNumber(event.target.value));
                  },
                })}
              />
            </div>
            <div>
              <Label htmlFor="processor_name">Processor</Label>
              <Input id="processor_name" {...form.register("processor_name")} />
            </div>
            <div>
              <Label htmlFor="processor_email">Processor email</Label>
              <Input id="processor_email" type="email" {...form.register("processor_email")} />
            </div>
            <div>
              <Label htmlFor="processor_phone">Processor phone</Label>
              <Input
                id="processor_phone"
                {...form.register("processor_phone", {
                  onChange: (event) => {
                    form.setValue("processor_phone", formatPhoneNumber(event.target.value));
                  },
                })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="borrower_name">Borrower name</Label>
              <Input id="borrower_name" {...form.register("borrower_name")} />
            </div>
            <div>
              <Label htmlFor="borrower_email">Borrower email</Label>
              <Input id="borrower_email" type="email" {...form.register("borrower_email")} />
            </div>
            <div>
              <Label htmlFor="borrower_phone">Borrower phone</Label>
              <Input
                id="borrower_phone"
                {...form.register("borrower_phone", {
                  onChange: (event) => form.setValue("borrower_phone", formatPhoneNumber(event.target.value)),
                })}
              />
            </div>
            <div>
              <Label htmlFor="property_contact_name">Property contact</Label>
              <Input id="property_contact_name" {...form.register("property_contact_name")} placeholder="Contact for scheduling" />
            </div>
            <div>
              <Label htmlFor="property_contact_phone">Property contact phone</Label>
              <Input
                id="property_contact_phone"
                {...form.register("property_contact_phone", {
                  onChange: (event) => form.setValue("property_contact_phone", formatPhoneNumber(event.target.value)),
                })}
              />
            </div>
            <div>
              <Label htmlFor="property_contact_email">Property contact email</Label>
              <Input id="property_contact_email" type="email" {...form.register("property_contact_email")} />
            </div>
          </div>
        </section>
      )}

      {activeStep === 3 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Order details</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <Label>Priority</Label>
              <Select value={form.watch("priority")} onValueChange={(value) => form.setValue("priority", value as OrderFormValues["priority"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rush">Rush</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="due_date">Due date</Label>
              <Input id="due_date" type="datetime-local" {...form.register("due_date", { valueAsDate: true })} />
            </div>
            <div>
              <Label htmlFor="fee_amount">Base fee</Label>
              <Input id="fee_amount" type="number" step="0.01" {...form.register("fee_amount", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="tech_fee">Technology fee</Label>
              <Input id="tech_fee" type="number" step="0.01" {...form.register("tech_fee", { valueAsNumber: true })} />
            </div>
            <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/60">
              <p className="font-semibold">Total amount</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={autoAssign} onCheckedChange={setAutoAssign} id="autoAssign" />
              <Label htmlFor="autoAssign">Enable smart assignment (auto-select best appraiser)</Label>
            </div>
          </div>
        </section>
      )}

      {activeStep === 4 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Review and submit</h3>
          <div className="mt-6 space-y-4 text-sm">
            <p>Confirm the details below before submitting. Use the stepper to go back and adjust if necessary.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <h4 className="font-semibold">Property</h4>
                <p>{values.property_address}</p>
                <p>
                  {values.property_city}, {values.property_state} {values.property_zip}
                </p>
                <p className="text-xs text-slate-500 capitalize">{values.property_type?.replace(/_/g, " ")}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <h4 className="font-semibold">Financial</h4>
                <p>Loan type: {values.loan_type || "N/A"}</p>
                <p>Loan number: {values.loan_number || "N/A"}</p>
                <p>Loan amount: {formatCurrency(values.loan_amount)}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <h4 className="font-semibold">Borrower</h4>
                <p>{values.borrower_name}</p>
                <p>{values.borrower_email}</p>
                <p>{values.borrower_phone}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <h4 className="font-semibold">Totals</h4>
                <p>Base fee: {formatCurrency(values.fee_amount)}</p>
                <p>Tech fee: {formatCurrency(values.tech_fee)}</p>
                <p className="text-lg font-bold text-primary">Total: {formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" disabled={activeStep === 0} onClick={prevStep}>
          Previous
        </Button>
        {activeStep < steps.length - 1 ? (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" onClick={() => localStorage.setItem(STORAGE_KEY, JSON.stringify(values))}>
              Save as draft
            </Button>
            <Button type="submit">Submit order</Button>
          </div>
        )}
      </div>
    </form>
  );
}
