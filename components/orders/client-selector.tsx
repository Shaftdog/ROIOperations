"use client";

import * as React from "react";
import { Command } from "cmdk";
import { ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Client } from "@/types/orders";

interface ClientSelectorProps {
  clients: Client[];
  value?: string;
  onChange: (clientId: string) => void;
  onQuickAdd?: () => void;
  label?: string;
}

export function ClientSelector({ clients, value, onChange, onQuickAdd }: ClientSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const selectedClient = clients.find((client) => client.id === value);
  const [search, setSearch] = React.useState("");

  const filteredClients = React.useMemo(() => {
    if (!search) return clients;
    const query = search.toLowerCase();
    return clients.filter(
      (client) =>
        client.company_name.toLowerCase().includes(query) ||
        client.primary_contact?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query)
    );
  }, [clients, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedClient ? selectedClient.company_name : "Select client"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0">
        <Command>
          <div className="border-b border-slate-200 px-3 py-2">
            <Input placeholder="Search clients..." value={search} onChange={(event) => setSearch(event.target.value)} className="h-9" />
          </div>
          <ScrollArea className="max-h-80">
            <Command.List>
              <Command.Empty className="p-4 text-sm text-slate-500">
                No clients found.
                {onQuickAdd && (
                  <Button variant="link" className="mt-2 h-auto px-0" onClick={onQuickAdd}>
                    <Plus className="mr-1 h-4 w-4" /> Add new client
                  </Button>
                )}
              </Command.Empty>
              <Command.Group heading="Recent clients">
                {filteredClients.map((client) => (
                  <Command.Item
                    key={client.id}
                    value={client.id}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    <div>
                      <p className="text-sm font-medium">{client.company_name}</p>
                      <p className="text-xs text-slate-500">{client.primary_contact}</p>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
