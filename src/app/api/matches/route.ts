import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const prisma = await getDb();
  const matches = await prisma.match.findMany({
    where: { isInterestingForScouting: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(matches);
}

export async function POST(req: NextRequest) {
  const prisma = await getDb();
  const data = await req.json();
  const match = await prisma.match.create({ data });
  return NextResponse.json(match, { status: 201 });
}
