import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "TEST OK - Order API is working!" });
}

export async function GET() {
  return NextResponse.json({ message: "TEST GET OK" });
}