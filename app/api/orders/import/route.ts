import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  console.log("Bulk import", formData.get("file"));
  return NextResponse.json({ ok: true, summary: { imported: 5, failed: 0 } });
}
