import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { price, currency, orderId } = await req.json();

    // Minimum 5$ pour NowPayments
    const finalPrice = Math.max(Number(price), 5);

    const response = await fetch("https://api.nowpayments.io/v1/payment", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: finalPrice,
        price_currency: "usd",
        pay_currency: currency.toLowerCase(),
        order_id: orderId,
        order_description: `Order ${orderId}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("NowPayments error:", data);
      return NextResponse.json(
        { error: data.message || "Payment creation failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("NowPayments exception:", error);
    return NextResponse.json(
      { error: "Payment service error" },
      { status: 500 }
    );
  }
}