import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Order, OrderDocument, OrderHistoryEntry, OrderNote, OrderTemplate } from "@/types/orders";
import { redis } from "@/lib/cache/redis";

const ORDERS_CACHE_KEY = "orders:list";

export const getOrders = cache(async () => {
  const cached = await redis?.get(ORDERS_CACHE_KEY);
  if (cached) {
    return JSON.parse(cached) as Order[];
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("orders").select("*").order("ordered_date", { ascending: false });
  if (error) {
    console.error("Failed to fetch orders", error);
    throw error;
  }

  await redis?.set(ORDERS_CACHE_KEY, JSON.stringify(data), "EX", 60);

  return data as Order[];
});

export const getOrderById = cache(async (id: string) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `*,
      clients (*),
      order_documents (*),
      order_notes (*),
      order_history (*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch order", error);
    throw error;
  }

  return data as Order & {
    clients: Order["client_id"];
    order_documents: OrderDocument[];
    order_notes: OrderNote[];
    order_history: OrderHistoryEntry[];
  };
});

export const getOrderTemplates = cache(async () => {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("order_templates").select("*");
  return (data ?? []) as OrderTemplate[];
});
