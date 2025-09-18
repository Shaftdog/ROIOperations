"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-use";
import { Search, PlusCircle, RefreshCw, Timer } from "lucide-react";
import { useCommandPalette } from "@/lib/store/command-palette";
import { useAppStore } from "@/lib/store/app-store";
import { useOrdersSearch } from "@/lib/hooks/use-orders-search";
import { formatOrderNumber } from "@/lib/utils/format";

export function CommandPalette() {
  const router = useRouter();
  const { open, setOpen, query, setQuery } = useCommandPalette();
  const recentSearches = useAppStore((state) => state.recentSearches);
  const pushRecentSearch = useAppStore((state) => state.pushRecentSearch);
  const { data: results } = useOrdersSearch(query);

  useHotkeys(
    ["meta+k", "ctrl+k"],
    (event) => {
      event.preventDefault();
      setOpen(!open);
    },
    [open]
  );

  const handleSelect = (value: string) => {
    if (value.startsWith("order:")) {
      const id = value.replace("order:", "");
      router.push(`/orders/${id}`);
    } else if (value === "new-order") {
      router.push("/orders/new");
    } else if (value.startsWith("status:")) {
      const [, status] = value.split(":");
      router.push(`/orders?status=${status}`);
    }
    pushRecentSearch(query);
    setOpen(false);
    setQuery("");
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global search"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-24 backdrop-blur"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-subtle dark:bg-slate-900">
        <Command.Input
          autoFocus
          value={query}
          onValueChange={setQuery}
          placeholder="Search orders, clients, addresses..."
          className="h-14 w-full border-b border-slate-200 bg-transparent px-4 text-lg outline-none"
        />
        <Command.List className="max-h-[420px] overflow-y-auto">
          <Command.Empty className="py-12 text-center text-sm text-slate-500">
            No results found. Try a different query.
          </Command.Empty>
          <Command.Group heading="Quick Actions">
            <Command.Item value="new-order" onSelect={handleSelect} className="flex items-center gap-3 px-4 py-3">
              <PlusCircle className="h-4 w-4 text-primary" />
              <span>Create new order</span>
            </Command.Item>
            <Command.Item value="refresh" onSelect={() => window.location.reload()} className="flex items-center gap-3 px-4 py-3">
              <RefreshCw className="h-4 w-4 text-primary" />
              <span>Refresh data</span>
            </Command.Item>
          </Command.Group>
          {Boolean(results?.length) && (
            <Command.Group heading="Search results">
              {results?.map((order) => (
                <Command.Item key={order.id} value={`order:${order.id}`} onSelect={handleSelect} className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium">{formatOrderNumber(order.order_number)}</p>
                      <p className="text-xs text-slate-500">
                        {order.property_address}, {order.property_city}, {order.property_state}
                      </p>
                    </div>
                    <div className="ml-auto text-xs capitalize text-slate-400">{order.status.replace(/_/g, " ")}</div>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}
          {!!recentSearches.length && (
            <Command.Group heading="Recent searches">
              {recentSearches.map((item) => (
                <Command.Item key={item} value={item} onSelect={() => setQuery(item)} className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Timer className="h-4 w-4 text-slate-400" />
                    <span>{item}</span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
