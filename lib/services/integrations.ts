import type { Order } from "@/types/orders";

export async function sendTwilioSms(to: string, message: string) {
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.info("Twilio not configured. SMS skipped.");
    return;
  }
  console.log(`Sending SMS to ${to}: ${message}`);
}

export async function sendSendGridEmail(to: string, subject: string, body: string) {
  if (!process.env.SENDGRID_API_KEY) {
    console.info("SendGrid not configured. Email skipped.");
    return;
  }
  console.log(`Sending email to ${to}: ${subject}`);
}

export async function createCalendarEvent(order: Order) {
  if (!process.env.GOOGLE_CALENDAR_ID) {
    console.info("Calendar not configured. Event skipped.");
    return;
  }
  console.log(`Creating calendar event for order ${order.order_number}`);
}

export async function processStripePayment(order: Order, amount: number) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.info("Stripe not configured. Payment skipped.");
    return;
  }
  console.log(`Processing Stripe payment for order ${order.order_number} amount ${amount}`);
}
