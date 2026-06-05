import { NextRequest, NextResponse } from "next/server";

// ============ CONVERSION AUD → USD DYNAMIQUE ============
async function getAudToUsdRate(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd,aud",
      { cache: "no-store" }
    );
    const data = await res.json();
    const usdtUsd = data.tether?.usd || 1;
    const usdtAud = data.tether?.aud || 1.5;
    return usdtUsd / usdtAud; // 1 AUD = X USD
  } catch {
    return 0.66; // fallback
  }
}

export async function POST(req: NextRequest) {
  try {
    const { price, currency, orderId } = await req.json();

    // Minimum 5$ pour NowPayments (en AUD)
    const finalPriceAUD = Math.max(Number(price), 5);

    // Taux AUD → USD dynamique
    const audToUsd = await getAudToUsdRate();
    const finalPriceUSD = parseFloat((finalPriceAUD * audToUsd).toFixed(2));

    console.log("NOWPAYMENTS_DEBUG", {
      priceAUD: finalPriceAUD,
      audToUsd,
      priceUSD: finalPriceUSD,
      currency,
      orderId,
      timestamp: new Date().toISOString(),
    });

    const response = await fetch("https://api.nowpayments.io/v1/payment", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: finalPriceUSD,
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