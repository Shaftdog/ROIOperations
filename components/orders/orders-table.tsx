"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ColumnDef, RowSelectionState, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { Order } from "@/types/orders";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, Filter, ListFilter, MoreHorizontal, Printer, RefreshCw } from "lucide-react";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";
import { VoiceInputButton } from "@/components/ui/voice-input-button";

const PAGE_SIZE = 25;

interface OrdersTableProps {
  initialData?: Order[];
}

interface FiltersState {
  status: string[];
  priority: string[];
  propertyType: string[];
  clientIds: string[];
  assignedTo: string[];
  dateRange?: {
    start: string;
    end: string;
    field: "ordered_date" | "due_date";
  };
}

export function OrdersTable({ initialData = [] }: OrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    status: [],
    priority: [],
    propertyType: [],
    clientIds: [],
    assignedTo: [],
  });
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pullStart = useRef<number | null>(null);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handlePullStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0) {
      pullStart.current = event.touches[0].clientY;
    }
  };

  const handlePullEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (pullStart.current === null) return;
    const delta = event.changedTouches[0].clientY - pullStart.current;
    if (delta > 80) {
      navigator?.vibrate?.(25);
      void refetch();
    }
    pullStart.current = null;
  };

  const { data, fetchNextPage, hasNextPage, isFetching, refetch } = useInfiniteQuery({
    queryKey: ["orders", debouncedSearch, filters],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        limit: PAGE_SIZE.toString(),
        cursor: pageParam ?? "",
        search: debouncedSearch,
      });
      if (filters.status.length) params.append("status", filters.status.join(","));
      if (filters.priority.length) params.append("priority", filters.priority.join(","));
      if (filters.propertyType.length) params.append("propertyType", filters.propertyType.join(","));
      if (filters.clientIds.length) params.append("clients", filters.clientIds.join(","));
      if (filters.assignedTo.length) params.append("assigned", filters.assignedTo.join(","));
      if (filters.dateRange) {
        params.append("dateField", filters.dateRange.field);
        params.append("dateStart", filters.dateRange.start);
        params.append("dateEnd", filters.dateRange.end);
      }

      const response = await fetch(`/api/orders?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to load orders");
      }
      const json = await response.json();
      return json as { orders: Order[]; nextCursor?: string };
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialData: {
      pageParams: [undefined],
      pages: [{ orders: initialData, nextCursor: undefined }],
    },
  });

  const orders = useMemo(() => data?.pages.flatMap((page) => page.orders) ?? [], [data]);

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        size: 32,
      },
      {
        accessorKey: "order_number",
        header: () => "Order #",
        cell: ({ row }) => <span className="font-semibold">{row.original.order_number}</span>,
      },
      {
        accessorKey: "property_address",
        header: () => "Property address",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.property_address}</p>
            <p className="text-xs text-slate-500">
              {row.original.property_city}, {row.original.property_state} {row.original.property_zip}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "client_id",
        header: () => "Client",
        cell: ({ row }) => <span>{row.original.metadata?.client_name ?? row.original.client_id}</span>,
      },
      {
        accessorKey: "status",
        header: () => "Status",
        cell: ({ row }) => <OrderStatusBadge status={row.original.status} />, 
      },
      {
        accessorKey: "due_date",
        header: () => "Due date",
        cell: ({ row }) => <span>{formatDate(row.original.due_date)}</span>,
      },
      {
        accessorKey: "assigned_to",
        header: () => "Assigned to",
        cell: ({ row }) => <Badge variant="secondary">{row.original.metadata?.assigned_name ?? "Unassigned"}</Badge>,
      },
      {
        accessorKey: "fee_amount",
        header: () => "Fee",
        cell: ({ row }) => formatCurrency(row.original.total_amount ?? row.original.fee_amount),
      },
      {
        id: "actions",
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => window.location.assign(`/orders/${row.original.id}`)}>View</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => window.location.assign(`/orders/${row.original.id}?edit=1`)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => console.log("Clone", row.original.id)}>Clone</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => console.log("Delete", row.original.id)} className="text-danger">
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: orders,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  const selectedRows = table.getSelectedRowModel().rows;

  const handleExport = () => {
    const csvHeader = "Order #,Address,Client,Status,Due Date,Fee";
    const csvRows = selectedRows.length ? selectedRows : table.getRowModel().rows;
    const csvData = csvRows
      .map((row) => [
        row.original.order_number,
        `${row.original.property_address} ${row.original.property_city} ${row.original.property_state} ${row.original.property_zip}`,
        row.original.metadata?.client_name ?? row.original.client_id,
        row.original.status,
        formatDate(row.original.due_date ?? ""),
        formatCurrency(row.original.total_amount ?? row.original.fee_amount ?? 0),
      ].join(","))
      .join("\n");
    const blob = new Blob([[csvHeader, csvData].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.click();
    URL.revokeObjectURL(url);
    navigator?.vibrate?.(20);
  };

  const handleSwipe = (order: Order, direction: "left" | "right") => {
    if (direction === "right") {
      navigator?.vibrate?.(30);
      console.log("Marking order complete", order.id);
    } else {
      navigator?.vibrate?.(20);
      console.log("Open actions", order.id);
    }
  };

  const renderMobileCards = () => (
    <InfiniteScroll
      dataLength={orders.length}
      next={fetchNextPage}
      hasMore={Boolean(hasNextPage)}
      loader={<div className="p-4 text-center text-xs text-slate-500">Loading more orders...</div>}
      endMessage={<div className="p-4 text-center text-xs text-slate-400">All caught up!</div>}
      className="space-y-4 lg:hidden"
    >
      {orders.map((order) => {
        let touchStartX = 0;
        let touchEndX = 0;
        return (
          <div
            key={order.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition active:scale-[0.99] dark:border-slate-800 dark:bg-slate-900"
            onTouchStart={(event) => {
              touchStartX = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              touchEndX = event.changedTouches[0].clientX;
              const delta = touchEndX - touchStartX;
              if (Math.abs(delta) > 60) {
                handleSwipe(order, delta > 0 ? "right" : "left");
              }
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{order.order_number}</p>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="mt-1 text-sm font-medium">{order.property_address}</p>
            <p className="text-xs text-slate-500">
              {order.property_city}, {order.property_state}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>{formatDate(order.due_date)}</span>
              <span>{formatCurrency(order.total_amount ?? order.fee_amount)}</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <Button size="sm" variant="outline" className="text-xs" onClick={() => window.location.assign(`/orders/${order.id}`)}>
                View
              </Button>
              <Button size="sm" variant="ghost" className="text-xs" onClick={() => console.log("Actions", order.id)}>
                Actions
              </Button>
            </div>
          </div>
        );
      })}
    </InfiniteScroll>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="relative w-[320px]">
            <Input
              placeholder="Search by order #, address, client, borrower"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {isFetching && <Skeleton className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />}
          </div>
          <VoiceInputButton onTranscript={setSearch} />
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => setFiltersOpen(!filtersOpen)}>
          <Filter className="mr-2 h-4 w-4" /> Advanced filters
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
        {selectedRows.length > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
            {selectedRows.length} selected
            <Button variant="ghost" size="sm" onClick={handleExport}>
              Export CSV
            </Button>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              <ListFilter className="mr-2 h-4 w-4" /> Columns <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {table.getAllLeafColumns().map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filtersOpen && (
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-subtle dark:border-slate-800 dark:bg-slate-900 md:grid-cols-3">
          <div>
            <Label>Status</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["new", "assigned", "scheduled", "in_progress", "in_review", "revisions", "completed", "delivered", "cancelled"].map((status) => (
                <Badge
                  key={status}
                  variant={filters.status.includes(status) ? "default" : "outline"}
                  className={cn("cursor-pointer capitalize", filters.status.includes(status) && "bg-primary text-white")}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      status: prev.status.includes(status)
                        ? prev.status.filter((item) => item !== status)
                        : [...prev.status, status],
                    }))
                  }
                >
                  {status.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <Label>Priority</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["rush", "high", "normal", "low"].map((priority) => (
                <Badge
                  key={priority}
                  variant={filters.priority.includes(priority) ? "default" : "outline"}
                  className={cn("cursor-pointer capitalize", filters.priority.includes(priority) && "bg-primary text-white")}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      priority: prev.priority.includes(priority)
                        ? prev.priority.filter((item) => item !== priority)
                        : [...prev.priority, priority],
                    }))
                  }
                >
                  {priority}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <Label>Property type</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["single_family", "condo", "multi_family", "commercial", "land", "manufactured"].map((type) => (
                <Badge
                  key={type}
                  variant={filters.propertyType.includes(type) ? "default" : "outline"}
                  className={cn("cursor-pointer capitalize", filters.propertyType.includes(type) && "bg-primary text-white")}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      propertyType: prev.propertyType.includes(type)
                        ? prev.propertyType.filter((item) => item !== type)
                        : [...prev.propertyType, type],
                    }))
                  }
                >
                  {type.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {isMobile && renderMobileCards()}
      <div
        id="orders-table-scroll"
        ref={scrollRef}
        className="hidden rounded-2xl border border-slate-200 bg-white shadow-subtle dark:border-slate-800 dark:bg-slate-900 lg:block"
        onTouchStart={handlePullStart}
        onTouchEnd={handlePullEnd}
      >
        <InfiniteScroll
          dataLength={orders.length}
          next={fetchNextPage}
          hasMore={Boolean(hasNextPage)}
          loader={<div className="p-4 text-center text-sm text-slate-500">Loading more orders...</div>}
          endMessage={<div className="p-4 text-center text-xs text-slate-400">You have reached the end of the list.</div>}
          scrollableTarget="orders-table-scroll"
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="bg-white">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-sm text-slate-500">
                    No orders found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </InfiniteScroll>
      </div>
    </div>
  );
}
