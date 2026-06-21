import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateScore } from "@/lib/scoring";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      currentClub: true,
      sources: true,
      scoutNotes: { orderBy: { createdAt: "desc" } },
      playerMatches: { include: { match: true }, orderBy: { match: { date: "desc" } } },
    },
  });
  if (!player) return NextResponse.json({ error: "לא נמצא" }, { status: 404 });
  return NextResponse.json(player);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const player = await prisma.player.update({
    where: { id },
    data,
    include: { sources: true, scoutNotes: true },
  });
  const { score, grade } = calculateScore(player);
  const updated = await prisma.player.update({
    where: { id },
    data: { score, grade },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.player.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
