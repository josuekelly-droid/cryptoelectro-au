import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret") || "";
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  try {
    const carts = await prisma.abandonedCart.findMany({
      where: {
        isCompleted: false,
        reminderCount: 0,
        lastActivity: { lte: twoHoursAgo },
      },
      include: { user: { select: { email: true, firstName: true } } },
    });

    // Envoyer les emails en arrière-plan sans attendre
    for (const cart of carts) {
      if (cart.user?.email) {
        fetch(`${process.env.NEXTAUTH_URL || "https://cryptoelectro-au.vercel.app"}/api/send-cart-reminder`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cart.user.email, firstName: cart.user.firstName, cartId: cart.id, type: "first" }),
        }).catch(() => {});
      }
    }

    return NextResponse.json({ message: `Queued ${carts.length} reminders` });
  } catch (error: any) {
    return NextResponse.json({ error: "OK" });
  }
}