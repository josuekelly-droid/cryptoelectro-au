import { NextRequest, NextResponse } from "next/server";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || "";
const PAYPAL_API = "https://api-m.paypal.com";


async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${auth}` },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId } = await req.json();
    const accessToken = await getAccessToken();

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          reference_id: orderId,
          amount: { currency_code: "AUD", value: amount.toFixed(2) },
        }],
        application_context: {
          return_url: `${process.env.NEXTAUTH_URL}/checkout?payment=success&order=${orderId}`,
          cancel_url: `${process.env.NEXTAUTH_URL}/checkout?payment=cancelled`,
        },
      }),
    });

    const data = await res.json();

    if (data.status === "CREATED") {
      const approveUrl = data.links.find((l: any) => l.rel === "approve")?.href;
      return NextResponse.json({ id: data.id, approveUrl });
    }

    return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "PayPal service error" }, { status: 500 });
  }
}