import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getDataSource } from "@/app/api/connection";
import { UsersService } from "@/app/api/services/user.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const sessionWithItems = await stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: ["line_items.data.price"],
      },
    );

    const lineItems = sessionWithItems.line_items?.data;
    const priceId = lineItems?.[0].price?.id;

    const userEmail = session.customer_email;

    console.log(userEmail);

    if (userEmail && priceId) {
      const ds = await getDataSource();
      const userService = new UsersService(ds);

      const user = await userService.getUserByEmail(userEmail);
      if (!user) throw new Error("User not found");

      if (
        priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY ||
        priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY
      )
        user.plan = "PRO";
      else if (
        priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_CREATOR_YEARLY ||
        priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_CREATOR_MONTHLY
      )
        user.plan = "CREATOR";
      else if (
        priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_FREE_YEARLY ||
        priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_FREE_MONTHLY
      )
        user.plan = "FREE";
      await ds.getRepository("User").save(user);
      console.log(`Updated plan for ${user.email} to ${user.plan}`);
    }
  }

  return new NextResponse("Webhook received", { status: 200 });
}
