import { NextResponse } from "next/server";
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;
const priceId = process.env.STRIPE_PRICE_ID;
const siteUrl = process.env.SITE_URL || "http://localhost:3000";

export async function POST() {
  if (!secretKey || !priceId) {
    return NextResponse.json({ error: "Missing Stripe configuration" }, { status: 500 });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2024-06-20",
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/cancel`,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
