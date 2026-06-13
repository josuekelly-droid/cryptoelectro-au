import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "cryptoelectro-au-secret-key-change-in-production"
);


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";
  const isAdmin = searchParams.get("admin") === "true";

  
  if (all || isAdmin) {
    const token = req.cookies.get("auth-token")?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role === "ADMIN") {
          const testimonials = await prisma.testimonial.findMany({
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
            orderBy: { createdAt: "desc" },
          });
          return NextResponse.json({ testimonials });
        }
      } catch {}
    }
  }

  const testimonials = await prisma.testimonial.findMany({
    where: { isApproved: true },
    include: { user: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: "desc" },
    take: all ? undefined : 20,
  });

  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "You must be signed in to leave a review." }, { status: 401 });
  }

  let userId: string;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    userId = payload.userId as string;
  } catch {
    return NextResponse.json({ error: "Invalid session." }, { status: 401 });
  }

  const data = await req.json();

  if (!data.content || data.content.length < 10) {
    return NextResponse.json({ error: "Review must be at least 10 characters." }, { status: 400 });
  }

  if (!data.rating || data.rating < 1 || data.rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      userId,
      content: data.content,
      rating: Number(data.rating),
      role: data.role || null,
      location: data.location || null,
      isApproved: false,
    },
    include: { user: { select: { firstName: true, lastName: true } } },
  });

  return NextResponse.json({ testimonial }, { status: 201 });
}