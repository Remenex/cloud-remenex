import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  return new Stripe(key, {
    apiVersion: "2026-03-25.dahlia",
  });
}

export async function POST(req: Request) {
  try {
    const { priceId, email } = await req.json();
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: process.env.NEXT_PUBLIC_SECCESS_URL,
      cancel_url: process.env.NEXT_PUBLIC_ERROR_URL,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Stripe checkout failed" }), {
      status: 500,
    });
  }
}
