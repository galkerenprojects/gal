import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const source = await prisma.source.create({ data });
  return NextResponse.json(source, { status: 201 });
}
