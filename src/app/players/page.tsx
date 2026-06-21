"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/badge";
import { POSITIONS, REGIONS, GRADE_LABELS, REALISM_LABELS } from "@/lib/constants";

type Player = {
  id: string;
  fullName: string;
  birthYear: number;
  position: string;
  region: string;
  score: number;
  grade: string;
  realism: string;
  verificationStatus: string;
  formerTopClub: boolean;
  stuckInU19: boolean;
  lateBloomer: boolean;
  playsAboveAge: boolean;
  appearances: number;
  starts: number;
  goals: number;
  nextAction: string | null;
  currentClub: { name: string } | null;
  scoutNotes: { note: string; createdAt: string }[];
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filters, setFilters] = useState({
    birthYear: "",
    region: "",
    position: "",
    grade: "",
    realism: "",
    formerTopClub: false,
    stuckInU19: false,
    lateBloomer: false,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.birthYear) params.set("birthYear", filters.birthYear);
    if (filters.region) params.set("region", filters.region);
    if (filters.position) params.set("position", filters.position);
    if (filters.grade) params.set("grade", filters.grade);
    if (filters.realism) params.set("realism", filters.realism);
    if (filters.formerTopClub) params.set("formerTopClub", "true");
    if (filters.stuckInU19) params.set("stuckInU19", "true");
    if (filters.lateBloomer) params.set("lateBloomer", "true");

    fetch(`/api/players?${params}`).then(r => r.json()).then(setPlayers);
  }, [filters]);

  const exportCSV = () => {
    const headers = ["שם", "שנת לידה", "מועדון", "עמדה", "אזור", "ציון", "דירוג", "ריאליות", "סטטוס אימות"];
    const rows = players.map(p => [
      p.fullName, p.birthYear, p.currentClub?.name || "", p.position, p.region,
      p.score, p.grade, p.realism, p.verificationStatus,
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scouting-report.csv";
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">שחקנים</h1>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
            ייצוא CSV
          </button>
          <Link href="/players/new" className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            הוספת שחקן
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 flex flex-wrap gap-3 items-end">
        <FilterSelect label="שנת לידה" value={filters.birthYear} onChange={v => setFilters(f => ({ ...f, birthYear: v }))} options={[{ v: "2008", l: "2008" }, { v: "2009", l: "2009" }]} />
        <FilterSelect label="אזור" value={filters.region} onChange={v => setFilters(f => ({ ...f, region: v }))} options={REGIONS.map(r => ({ v: r, l: r }))} />
        <FilterSelect label="עמדה" value={filters.position} onChange={v => setFilters(f => ({ ...f, position: v }))} options={POSITIONS.map(p => ({ v: p, l: p }))} />
        <FilterSelect label="דירוג" value={filters.grade} onChange={v => setFilters(f => ({ ...f, grade: v }))} options={["A+", "A", "B+", "B", "C"].map(g => ({ v: g, l: g }))} />
        <FilterSelect label="ריאליות" value={filters.realism} onChange={v => setFilters(f => ({ ...f, realism: v }))} options={["High", "Medium", "Low"].map(r => ({ v: r, l: REALISM_LABELS[r]?.label || r }))} />
        <FilterCheckbox label="מועדון גדול לשעבר" checked={filters.formerTopClub} onChange={v => setFilters(f => ({ ...f, formerTopClub: v }))} />
        <FilterCheckbox label="תקוע ב-U19" checked={filters.stuckInU19} onChange={v => setFilters(f => ({ ...f, stuckInU19: v }))} />
        <FilterCheckbox label="פורח מאוחר" checked={filters.lateBloomer} onChange={v => setFilters(f => ({ ...f, lateBloomer: v }))} />
        <button onClick={() => setFilters({ birthYear: "", region: "", position: "", grade: "", realism: "", formerTopClub: false, stuckInU19: false, lateBloomer: false })} className="text-sm text-blue-600 hover:underline">
          נקה פילטרים
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-right p-3">שם</th>
              <th className="text-right p-3">שנה</th>
              <th className="text-right p-3">מועדון</th>
              <th className="text-right p-3">עמדה</th>
              <th className="text-right p-3">אזור</th>
              <th className="text-right p-3">הופעות</th>
              <th className="text-right p-3">שערים</th>
              <th className="text-center p-3">ציון</th>
              <th className="text-center p-3">דירוג</th>
              <th className="text-center p-3">ריאליות</th>
              <th className="text-right p-3">סטטוס</th>
              <th className="text-right p-3">תגיות</th>
            </tr>
          </thead>
          <tbody>
            {players.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/players/${p.id}`}>
                <td className="p-3 font-medium">
                  <Link href={`/players/${p.id}`} className="text-blue-600 hover:underline">{p.fullName}</Link>
                </td>
                <td className="p-3">{p.birthYear}</td>
                <td className="p-3">{p.currentClub?.name || "—"}</td>
                <td className="p-3">{p.position}</td>
                <td className="p-3">{p.region}</td>
                <td className="p-3">{p.appearances} ({p.starts})</td>
                <td className="p-3">{p.goals}</td>
                <td className="p-3 text-center font-mono font-bold">{p.score}</td>
                <td className="p-3 text-center">
                  <Badge className={GRADE_LABELS[p.grade]?.color || "bg-gray-200"}>{p.grade}</Badge>
                </td>
                <td className="p-3 text-center">
                  <Badge className={REALISM_LABELS[p.realism]?.color || "bg-gray-200"}>{REALISM_LABELS[p.realism]?.label || p.realism}</Badge>
                </td>
                <td className="p-3 text-xs">{p.verificationStatus}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {p.formerTopClub && <Badge className="bg-yellow-100 text-yellow-800">מועדון גדול</Badge>}
                    {p.stuckInU19 && <Badge className="bg-amber-100 text-amber-800">תקוע U19</Badge>}
                    {p.lateBloomer && <Badge className="bg-teal-100 text-teal-800">פורח מאוחר</Badge>}
                    {p.playsAboveAge && <Badge className="bg-purple-100 text-purple-800">מעל גיל</Badge>}
                  </div>
                </td>
              </tr>
            ))}
            {players.length === 0 && (
              <tr><td colSpan={12} className="p-8 text-center text-gray-400">לא נמצאו שחקנים</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="border rounded px-2 py-1.5 text-sm min-w-[100px]">
        <option value="">הכל</option>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="rounded" />
      {label}
    </label>
  );
}
