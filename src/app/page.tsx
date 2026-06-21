import { prisma } from "@/lib/db";
import Link from "next/link";
import { SeedButton } from "@/components/seed-button";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const total = await prisma.player.count();
  const aPlus = await prisma.player.count({ where: { grade: "A+" } });
  const a = await prisma.player.count({ where: { grade: "A" } });
  const needsVerification = await prisma.player.count({
    where: { verificationStatus: { in: ["דרוש וידאו", "דרוש גיליון משחק", "לא מספיק נתונים"] } },
  });

  const byRegion = await prisma.player.groupBy({ by: ["region"], _count: true, orderBy: { _count: { region: "desc" } } });
  const byPosition = await prisma.player.groupBy({ by: ["position"], _count: true, orderBy: { _count: { position: "desc" } } });
  const byYear = await prisma.player.groupBy({ by: ["birthYear"], _count: true });

  const topPlayers = await prisma.player.findMany({
    where: { grade: { in: ["A+", "A"] } },
    orderBy: { score: "desc" },
    take: 5,
    include: { currentClub: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">דשבורד סקאוטינג</h1>
        <SeedButton total={total} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="סה״כ שחקנים" value={total} />
        <StatCard label="שחקני A+" value={aPlus} color="text-green-600" />
        <StatCard label="שחקני A" value={a} color="text-blue-600" />
        <StatCard label="דרושים אימות" value={needsVerification} color="text-orange-600" />
      </div>

      {topPlayers.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">שחקנים מובילים</h2>
          <div className="space-y-3">
            {topPlayers.map((p) => (
              <Link
                key={p.id}
                href={`/players/${p.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border"
              >
                <div>
                  <span className="font-medium">{p.fullName}</span>
                  <span className="text-sm text-gray-500 mr-2">
                    {p.position} • {p.currentClub?.name || p.region}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono">{p.score}/100</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${p.grade === "A+" ? "bg-green-600" : "bg-blue-600"}`}>
                    {p.grade}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <GroupCard title="לפי אזור" data={byRegion.map((r) => ({ label: r.region, count: r._count }))} />
        <GroupCard title="לפי עמדה" data={byPosition.map((r) => ({ label: r.position, count: r._count }))} />
        <GroupCard title="לפי שנת לידה" data={byYear.map((r) => ({ label: String(r.birthYear), count: r._count }))} />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color || ""}`}>{value}</p>
    </div>
  );
}

function GroupCard({ title, data }: { title: string; data: { label: string; count: number }[] }) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-semibold mb-3">{title}</h3>
      {data.length === 0 ? (
        <p className="text-sm text-gray-400">אין נתונים</p>
      ) : (
        <div className="space-y-2">
          {data.map((d) => (
            <div key={d.label} className="flex justify-between text-sm">
              <span>{d.label}</span>
              <span className="font-medium">{d.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
