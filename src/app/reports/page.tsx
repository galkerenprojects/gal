"use client";

import { useEffect, useState } from "react";
import { GRADE_LABELS, REALISM_LABELS } from "@/lib/constants";

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
  whyInteresting: string | null;
  nextAction: string | null;
  filterTriggered: string | null;
  appearances: number;
  starts: number;
  minutes: number;
  goals: number;
  assists: number | null;
  assistsVerified: boolean;
  formerTopClub: boolean;
  topClubName: string | null;
  stuckInU19: boolean;
  lateBloomer: boolean;
  playsAboveAge: boolean;
  currentClub: { name: string } | null;
  scoutNotes: { note: string; sentiment: string; scoutName: string }[];
};

export default function ReportsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/players").then(r => r.json()).then(setPlayers);
  }, []);

  const player = players.find(p => p.id === selected);

  const generateReport = (p: Player) => {
    const risks = [];
    if (!p.assistsVerified) risks.push("בישולים לא מאומתים");
    if (p.verificationStatus !== "מאומת") risks.push(`סטטוס אימות: ${p.verificationStatus}`);
    if (p.birthYear === 2009 && !p.playsAboveAge) risks.push("2009 ללא אינדיקציה למשחק מעל גיל");

    return `דוח סקאוטינג — ${p.fullName}
================================
שנת לידה: ${p.birthYear}
עמדה: ${p.position}
מועדון: ${p.currentClub?.name || "—"}
אזור: ${p.region}
ציון: ${p.score}/100 | דירוג: ${GRADE_LABELS[p.grade]?.label || p.grade}
ריאליות: ${REALISM_LABELS[p.realism]?.label || p.realism}

סטטיסטיקות:
- הופעות: ${p.appearances} | הרכבים: ${p.starts} | דקות: ${p.minutes}
- שערים: ${p.goals}${p.assistsVerified ? ` | בישולים: ${p.assists}` : " | בישולים: לא מאומת"}

למה מעניין:
${p.whyInteresting || "דרוש תיעוד"}

${p.filterTriggered ? `פילטר: ${p.filterTriggered}` : ""}

סיכונים:
${risks.length > 0 ? risks.map(r => `- ${r}`).join("\n") : "- אין סיכונים ידועים"}

מה לבדוק בוידאו:
- 10 דקות ראשונות: ביטחון, בנייה, סריקה, דרישת כדור
- 10 דקות אחרונות: עייפות, מנהיגות, תגובה ללחץ

הערות סקאוטים:
${p.scoutNotes.length > 0 ? p.scoutNotes.map(n => `- ${n.scoutName}: ${n.note} (${n.sentiment})`).join("\n") : "- אין הערות עדיין"}

פעולה הבאה:
${p.nextAction || "לקבוע צפייה"}

סטטוס אימות: ${p.verificationStatus}
================================`;
  };

  const downloadReport = (p: Player) => {
    const text = generateReport(p);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${p.fullName.replace(/\s/g, "-")}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">דוחות סקאוטינג</h1>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="font-semibold mb-3">בחר שחקן לדוח</h2>
        <select
          value={selected || ""}
          onChange={e => setSelected(e.target.value || null)}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="">בחר שחקן...</option>
          {players.map(p => (
            <option key={p.id} value={p.id}>{p.fullName} — {p.grade} ({p.score})</option>
          ))}
        </select>
      </div>

      {player && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">דוח: {player.fullName}</h2>
            <button
              onClick={() => downloadReport(player)}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              הורד דוח
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border font-mono" dir="rtl">
            {generateReport(player)}
          </pre>
        </div>
      )}
    </div>
  );
}
