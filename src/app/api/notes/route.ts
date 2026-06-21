import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const prisma = await getDb();
  const data = await req.json();
  const note = await prisma.scoutNote.create({ data });
  return NextResponse.json(note, { status: 201 });
}
