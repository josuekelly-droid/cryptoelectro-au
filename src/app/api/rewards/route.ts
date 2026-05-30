import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production"
);

const TIERS = {
  BRONZE: { min: 0, discount: 0, color: "bronze", label: "Bronze" },
  SILVER: { min: 200, discount: 3, color: "silver", label: "Silver" },
  GOLD: { min: 500, discount: 5, color: "gold", label: "Gold" },
  PLATINUM: { min: 1000, discount: 10, color: "platinum", label: "Platinum" },
  DIAMOND: { min: 2500, discount: 15, color: "diamond", label: "Diamond" },
};

function getTier(points: number) {
  if (points >= 2500) return "DIAMOND";
  if (points >= 1000) return "PLATINUM";
  if (points >= 500) return "GOLD";
  if (points >= 200) return "SILVER";
  return "BRONZE";
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let userId: string;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    userId = payload.userId as string;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Récupérer ou créer le reward
  let reward = await prisma.reward.findUnique({ where: { userId } });

  if (!reward) {
    // Calculer les points depuis les commandes existantes
    const orders = await prisma.order.findMany({
      where: { userId, status: { not: "CANCELLED" } },
    });
    const totalSpent = orders.reduce((s, o) => s + Number(o.total), 0);
    const points = Math.floor(totalSpent * 10);
    const tier = getTier(points);

    reward = await prisma.reward.create({
      data: { userId, points, tier },
    });
  }

  const tierInfo = TIERS[reward.tier as keyof typeof TIERS];
  const nextTierKey = Object.keys(TIERS).find(
    (k) => TIERS[k as keyof typeof TIERS].min > reward!.points
  );
  const nextTier = nextTierKey
    ? TIERS[nextTierKey as keyof typeof TIERS]
    : null;
  const pointsToNext = nextTier ? nextTier.min - reward.points : 0;

  return NextResponse.json({
    points: reward.points,
    tier: reward.tier,
    tierInfo,
    nextTier: nextTier?.label || null,
    pointsToNext,
    discount: tierInfo.discount,
    allTiers: Object.entries(TIERS).map(([key, val]) => ({
      name: key,
      ...val,
      current: key === reward.tier,
      achieved: TIERS[key as keyof typeof TIERS].min <= reward.points,
    })),
  });
}