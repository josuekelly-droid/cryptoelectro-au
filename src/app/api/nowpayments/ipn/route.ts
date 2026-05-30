import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 IPN Received:", body);

    const {
      payment_id,
      payment_status,
      order_id,
      price_amount,
      pay_currency,
    } = body;

    // Vérifier le statut du paiement
    if (payment_status === "finished" || payment_status === "confirmed") {
      // Trouver la commande par paymentId
      const order = await prisma.order.findFirst({
        where: { paymentId: String(payment_id) },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "CONFIRMED",
            status: "CONFIRMED",
          },
        });
        console.log(`✅ Order ${order.orderNumber} confirmed via IPN`);
      } else {
        // Chercher par orderNumber si paymentId ne correspond pas
        const orderByNumber = await prisma.order.findFirst({
          where: { orderNumber: String(order_id) },
        });

        if (orderByNumber) {
          await prisma.order.update({
            where: { id: orderByNumber.id },
            data: {
              paymentStatus: "CONFIRMED",
              status: "CONFIRMED",
              paymentId: String(payment_id),
            },
          });
          console.log(`✅ Order ${order_id} confirmed via IPN`);
        }
      }
    } else if (payment_status === "expired" || payment_status === "failed") {
      const order = await prisma.order.findFirst({
        where: { paymentId: String(payment_id) },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: payment_status.toUpperCase(),
          },
        });
        console.log(`❌ Order ${order.orderNumber} payment ${payment_status}`);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("IPN Error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}