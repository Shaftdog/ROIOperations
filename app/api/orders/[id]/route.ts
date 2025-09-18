import { NextResponse } from "next/server";
import { mockOrders } from "@/lib/utils/mock-data";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const order = mockOrders.find((item) => item.id === params.id);
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  console.log("Update order", params.id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  console.log("Soft delete order", params.id);
  return NextResponse.json({ ok: true });
}
