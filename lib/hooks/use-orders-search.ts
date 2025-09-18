"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import type { Order } from "@/types/orders";

async function fetchOrdersSearch(query: string): Promise<Order[]> {
  if (!query) return [];
  const response = await fetch(`/api/orders?search=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("Failed to search orders");
  }
  const data = await response.json();
  return data.orders as Order[];
}

export function useOrdersSearch(query: string) {
  const debouncedQuery = useDebouncedValue(query, 300);

  return useQuery({
    queryKey: ["orders-search", debouncedQuery],
    queryFn: () => fetchOrdersSearch(debouncedQuery),
    enabled: debouncedQuery.length > 1,
    staleTime: 1000 * 60,
  });
}
