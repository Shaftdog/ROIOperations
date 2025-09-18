import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const payload = await request.json();
  console.log("Assign order", params.id, payload);
  return NextResponse.json({ ok: true });
}
