import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const note = await prisma.scoutNote.create({ data });
  return NextResponse.json(note, { status: 201 });
}
