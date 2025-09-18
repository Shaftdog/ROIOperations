import { NextResponse } from "next/server";
import { mockOrderDocuments } from "@/lib/utils/mock-data";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ documents: mockOrderDocuments.filter((doc) => doc.order_id === params.id) });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const formData = await request.formData();
  console.log("Upload document", params.id, formData.get("file"));
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { documentId } = await request.json();
  console.log("Delete document", params.id, documentId);
  return NextResponse.json({ ok: true });
}
