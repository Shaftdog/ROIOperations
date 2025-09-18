import { NextResponse } from "next/server";
import { mockOrders } from "@/lib/utils/mock-data";
import type { Order } from "@/types/orders";

function filterOrders(orders: Order[], search?: string, status?: string[], priority?: string[]) {
  return orders.filter((order) => {
    const matchesSearch = search
      ? [order.order_number, order.property_address, order.metadata?.client_name, order.borrower_name]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(search.toLowerCase()))
      : true;
    const matchesStatus = status?.length ? status.includes(order.status) : true;
    const matchesPriority = priority?.length ? priority.includes(order.priority) : true;
    return matchesSearch && matchesStatus && matchesPriority;
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const status = searchParams.get("status")?.split(",").filter(Boolean);
  const priority = searchParams.get("priority")?.split(",").filter(Boolean);
  const duplicateCheck = searchParams.get("duplicate");

  if (duplicateCheck) {
    const duplicate = mockOrders.some((order) => order.property_address.toLowerCase() === duplicateCheck.toLowerCase());
    return NextResponse.json({ hasDuplicate: duplicate, message: duplicate ? "An order with this address was created recently." : null });
  }

  const filtered = filterOrders(mockOrders, search, status, priority);
  const limit = Number(searchParams.get("limit") ?? 25);
  const cursor = searchParams.get("cursor");
  const startIndex = cursor ? filtered.findIndex((order) => order.id === cursor) + 1 : 0;
  const pageItems = filtered.slice(startIndex, startIndex + limit);
  const nextCursor = pageItems.length === limit ? pageItems[pageItems.length - 1].id : undefined;

  return NextResponse.json({ orders: pageItems, nextCursor });
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log("Creating order", body.order_number);
  return NextResponse.json({ ok: true, order: body });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  console.log("Bulk update", body);
  return NextResponse.json({ ok: true });
}
