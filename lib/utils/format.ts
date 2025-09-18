import { format, isValid, parseISO } from "date-fns";

export function formatCurrency(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function formatDate(value?: string | Date | null, fallback = "-") {
  if (!value) return fallback;
  const date = typeof value === "string" ? parseISO(value) : value;
  if (!isValid(date)) return fallback;
  return format(date, "MMM d, yyyy");
}

export function formatRelativeDate(value?: string | Date | null) {
  if (!value) return "Unknown";
  const date = typeof value === "string" ? parseISO(value) : value;
  if (!isValid(date)) return "Unknown";
  return format(date, "MMM d, yyyy h:mm a");
}

export function formatOrderNumber(orderNumber: string) {
  return orderNumber ?? "-";
}

export function formatPhoneNumber(value?: string | null) {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 10) return value;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
