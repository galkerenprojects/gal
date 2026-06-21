import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { ensureDb } from "./init-db";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function makePrisma() {
  const url = process.env.DATABASE_URL || "file:/tmp/dev.db";
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || makePrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getDb() {
  await ensureDb();
  return prisma;
}
