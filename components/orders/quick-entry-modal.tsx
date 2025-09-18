"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPhoneNumber } from "@/lib/utils/format";
import { toast } from "sonner";

interface QuickEntryForm {
  borrower_name: string;
  property_address: string;
  client_id: string;
  priority: "rush" | "high" | "normal" | "low";
  phone?: string;
  notes?: string;
}

const STORAGE_KEY = "roioperations-quick-entry";

interface QuickEntryModalProps {
  children: React.ReactNode;
}

export function QuickEntryModal({ children }: QuickEntryModalProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<QuickEntryForm>({
    borrower_name: "",
    property_address: "",
    client_id: "",
    priority: "normal",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setForm(JSON.parse(stored));
      } catch (error) {
        console.warn("Failed to parse quick entry draft", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const handleChange = (field: keyof QuickEntryForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: field === "phone" ? formatPhoneNumber(value) : value }));
  };

  const handleSubmit = async () => {
    await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        status: "new",
        source: "quick-entry",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast.success("Quick order draft saved");
    setForm({ borrower_name: "", property_address: "", client_id: "", priority: "normal", phone: "", notes: "" });
    localStorage.removeItem(STORAGE_KEY);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick order intake</DialogTitle>
          <DialogDescription>Capture essential details while on the phone. This draft can be converted later.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 px-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="quick-borrower">Borrower name</Label>
            <Input id="quick-borrower" value={form.borrower_name} onChange={(event) => handleChange("borrower_name", event.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quick-address">Property address</Label>
            <Input id="quick-address" value={form.property_address} onChange={(event) => handleChange("property_address", event.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quick-client">Client identifier</Label>
            <Input id="quick-client" value={form.client_id} onChange={(event) => handleChange("client_id", event.target.value)} placeholder="Client ID or name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quick-phone">Contact phone</Label>
            <Input id="quick-phone" value={form.phone} onChange={(event) => handleChange("phone", event.target.value)} placeholder="(555) 123-4567" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quick-notes">Notes</Label>
            <Textarea id="quick-notes" value={form.notes} onChange={(event) => handleChange("notes", event.target.value)} placeholder="Important details shared on the call" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save quick order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
