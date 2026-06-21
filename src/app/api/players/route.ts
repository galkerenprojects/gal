import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { calculateScore } from "@/lib/scoring";

export async function GET(req: NextRequest) {
  const prisma = await getDb();
  const params = req.nextUrl.searchParams;
  const where: Record<string, unknown> = {};

  if (params.get("birthYear")) where.birthYear = Number(params.get("birthYear"));
  if (params.get("region")) where.region = params.get("region");
  if (params.get("position")) where.position = params.get("position");
  if (params.get("grade")) where.grade = params.get("grade");
  if (params.get("realism")) where.realism = params.get("realism");
  if (params.get("formerTopClub") === "true") where.formerTopClub = true;
  if (params.get("stuckInU19") === "true") where.stuckInU19 = true;
  if (params.get("lateBloomer") === "true") where.lateBloomer = true;

  const players = await prisma.player.findMany({
    where,
    include: { currentClub: true, sources: true, scoutNotes: true },
    orderBy: { score: "desc" },
  });

  return NextResponse.json(players);
}

export async function POST(req: NextRequest) {
  const prisma = await getDb();
  const data = await req.json();

  const player = await prisma.player.create({
    data,
    include: { sources: true, scoutNotes: true },
  });

  const { score, grade } = calculateScore(player);
  const updated = await prisma.player.update({
    where: { id: player.id },
    data: { score, grade },
  });

  return NextResponse.json(updated, { status: 201 });
}
