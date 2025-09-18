import { NextResponse } from "next/server";
import { mockOrders } from "@/lib/utils/mock-data";
import { createCalendarEvent, processStripePayment, sendSendGridEmail, sendTwilioSms } from "@/lib/services/integrations";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const order = mockOrders.find((item) => item.id === params.id);
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const payload = await request.json();
  if (payload.sms) {
    await sendTwilioSms(order.borrower_phone ?? "", payload.sms);
  }
  if (payload.email) {
    await sendSendGridEmail(order.loan_officer_email ?? "", payload.email.subject, payload.email.body);
  }
  if (payload.calendar) {
    await createCalendarEvent(order);
  }
  if (payload.paymentAmount) {
    await processStripePayment(order, payload.paymentAmount);
  }
  return NextResponse.json({ ok: true });
}
