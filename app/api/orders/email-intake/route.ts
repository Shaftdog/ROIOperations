import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  console.log("Email intake", payload.subject);
  return NextResponse.json({ ok: true, message: "Email processed" });
}
