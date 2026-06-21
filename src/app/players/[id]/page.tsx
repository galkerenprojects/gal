"use client";

import { useEffect, useState, use } from "react";
import { Badge } from "@/components/badge";
import { GRADE_LABELS, REALISM_LABELS } from "@/lib/constants";

type Player = {
  id: string;
  fullName: string;
  birthDate: string | null;
  birthYear: number;
  position: string;
  secondaryPosition: string | null;
  region: string;
  league: string | null;
  ageGroup: string | null;
  appearances: number;
  starts: number;
  minutes: number;
  goals: number;
  assists: number | null;
  assistsVerified: boolean;
  yellowCards: number;
  redCards: number;
  formerTopClub: boolean;
  topClubName: string | null;
  stuckInU19: boolean;
  lateBloomer: boolean;
  playsAboveAge: boolean;
  previousClubs: string | null;
  realism: string;
  score: number;
  grade: string;
  verificationStatus: string;
  isExampleData: boolean;
  filterTriggered: string | null;
  whyInteresting: string | null;
  nextAction: string | null;
  currentClub: { name: string } | null;
  sources: { id: string; sourceType: string; title: string | null; url: string | null; reliability: string }[];
  scoutNotes: { id: string; scoutName: string; note: string; sentiment: string; category: string | null; videoUrl: string | null; minuteStart: number | null; minuteEnd: number | null; followUpNeeded: boolean; createdAt: string }[];
  playerMatches: { id: string; started: boolean; minutes: number; goals: number; assists: number; match: { homeTeamName: string; awayTeamName: string; result: string | null; date: string | null } }[];
};

export default function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [player, setPlayer] = useState<Player | null>(null);
  const [noteForm, setNoteForm] = useState({ scoutName: "", note: "", sentiment: "ניטרלי", category: "", videoUrl: "", minuteStart: "", minuteEnd: "", followUpNeeded: false });
  const [sourceForm, setSourceForm] = useState({ sourceType: "other", title: "", url: "", notes: "", reliability: "לא אומת" });

  const load = () => fetch(`/api/players/${id}`).then(r => r.json()).then(setPlayer);
  useEffect(() => { load(); }, [id]);

  if (!player) return <div className="p-8 text-center text-gray-400">טוען...</div>;

  const prevClubs = player.previousClubs ? JSON.parse(player.previousClubs) as string[] : [];

  const addNote = async () => {
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId: id,
        ...noteForm,
        minuteStart: noteForm.minuteStart ? Number(noteForm.minuteStart) : null,
        minuteEnd: noteForm.minuteEnd ? Number(noteForm.minuteEnd) : null,
      }),
    });
    setNoteForm({ scoutName: "", note: "", sentiment: "ניטרלי", category: "", videoUrl: "", minuteStart: "", minuteEnd: "", followUpNeeded: false });
    load();
  };

  const addSource = async () => {
    await fetch(`/api/players/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    const res = await fetch("/api/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: id, ...sourceForm }),
    });
    if (res.ok) {
      setSourceForm({ sourceType: "other", title: "", url: "", notes: "", reliability: "לא אומת" });
      load();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {player.isExampleData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          זהו שחקן לדוגמה בלבד. הנתונים אינם מאומתים.
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{player.fullName}</h1>
            <p className="text-gray-500 mt-1">{player.position}{player.secondaryPosition ? ` / ${player.secondaryPosition}` : ""} • {player.currentClub?.name || "—"} • {player.region}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-3xl font-bold font-mono">{player.score}</div>
              <div className="text-xs text-gray-500">ציון</div>
            </div>
            <Badge className={`${GRADE_LABELS[player.grade]?.color} text-lg px-3 py-1`}>{player.grade}</Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge className="bg-blue-100 text-blue-800">{player.birthYear}</Badge>
          <Badge className={REALISM_LABELS[player.realism]?.color}>{REALISM_LABELS[player.realism]?.label}</Badge>
          {player.formerTopClub && <Badge className="bg-yellow-100 text-yellow-800">לשעבר {player.topClubName}</Badge>}
          {player.stuckInU19 && <Badge className="bg-amber-100 text-amber-800">תקוע ב-U19</Badge>}
          {player.lateBloomer && <Badge className="bg-teal-100 text-teal-800">פורח מאוחר</Badge>}
          {player.playsAboveAge && <Badge className="bg-purple-100 text-purple-800">משחק מעל גיל</Badge>}
        </div>
      </div>

      {/* Why interesting */}
      {player.whyInteresting && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-1">למה השחקן מעניין</h3>
          <p className="text-sm text-blue-800">{player.whyInteresting}</p>
          {player.filterTriggered && <p className="text-xs text-blue-600 mt-2">פילטר: {player.filterTriggered}</p>}
        </div>
      )}

      {/* Next action */}
      {player.nextAction && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 mb-1">פעולה הבאה</h3>
          <p className="text-sm text-orange-800">{player.nextAction}</p>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="font-semibold mb-4">סטטיסטיקות</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="הופעות" value={player.appearances} />
          <Stat label="הרכבים" value={player.starts} />
          <Stat label="דקות" value={player.minutes} />
          <Stat label="שערים" value={player.goals} />
          <Stat label="בישולים" value={player.assistsVerified ? (player.assists ?? "—") : "לא אומת"} />
          <Stat label="כרטיסים צהובים" value={player.yellowCards} />
          <Stat label="כרטיסים אדומים" value={player.redCards} />
          <Stat label="% הרכבים" value={player.appearances > 0 ? `${Math.round(player.starts / player.appearances * 100)}%` : "—"} />
        </div>
      </div>

      {/* Previous clubs */}
      {prevClubs.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="font-semibold mb-3">מועדונים קודמים</h2>
          <div className="flex flex-wrap gap-2">
            {prevClubs.map((c, i) => <Badge key={i} className="bg-gray-100 text-gray-800">{c}</Badge>)}
          </div>
        </div>
      )}

      {/* Verification */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="font-semibold mb-3">סטטוס אימות</h2>
        <Badge className={player.verificationStatus === "מאומת" ? "bg-green-100 text-green-800" : player.verificationStatus === "מאומת חלקית" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
          {player.verificationStatus}
        </Badge>
        {!player.assistsVerified && (
          <p className="text-sm text-gray-500 mt-2">אין מקור בישולים מאומת.</p>
        )}
      </div>

      {/* Sources */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="font-semibold mb-3">מקורות ועדויות</h2>
        {player.sources.length === 0 ? (
          <p className="text-sm text-gray-400">דרוש אימות בגיליון משחק או וידאו.</p>
        ) : (
          <div className="space-y-2">
            {player.sources.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded text-sm">
                <Badge className="bg-gray-200 text-gray-700">{s.sourceType}</Badge>
                <span>{s.title || s.url || "—"}</span>
                {s.url && <a href={s.url} target="_blank" className="text-blue-600 hover:underline text-xs">קישור</a>}
                <Badge className={s.reliability === "מאומת" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}>{s.reliability}</Badge>
              </div>
            ))}
          </div>
        )}
        <details className="mt-4">
          <summary className="text-sm text-blue-600 cursor-pointer">הוספת מקור</summary>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <select value={sourceForm.sourceType} onChange={e => setSourceForm(f => ({ ...f, sourceType: e.target.value }))} className="border rounded px-2 py-1.5 text-sm">
              <option value="fa">ההתאחדות</option>
              <option value="juniorleague">JuniorLeague</option>
              <option value="club">מועדון</option>
              <option value="matchsheet">גיליון משחק</option>
              <option value="video">וידאו</option>
              <option value="other">אחר</option>
            </select>
            <input placeholder="כותרת" value={sourceForm.title} onChange={e => setSourceForm(f => ({ ...f, title: e.target.value }))} className="border rounded px-2 py-1.5 text-sm" />
            <input placeholder="URL" value={sourceForm.url} onChange={e => setSourceForm(f => ({ ...f, url: e.target.value }))} className="border rounded px-2 py-1.5 text-sm" />
            <select value={sourceForm.reliability} onChange={e => setSourceForm(f => ({ ...f, reliability: e.target.value }))} className="border rounded px-2 py-1.5 text-sm">
              <option value="מאומת">מאומת</option>
              <option value="חלקי">חלקי</option>
              <option value="לא אומת">לא אומת</option>
            </select>
            <button onClick={addSource} className="col-span-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">הוסף מקור</button>
          </div>
        </details>
      </div>

      {/* Match history */}
      {player.playerMatches.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="font-semibold mb-3">היסטוריית משחקים</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right p-2">משחק</th>
                <th className="text-right p-2">תוצאה</th>
                <th className="text-center p-2">הרכב</th>
                <th className="text-center p-2">דקות</th>
                <th className="text-center p-2">שערים</th>
              </tr>
            </thead>
            <tbody>
              {player.playerMatches.map(pm => (
                <tr key={pm.id} className="border-b">
                  <td className="p-2">{pm.match.homeTeamName} vs {pm.match.awayTeamName}</td>
                  <td className="p-2">{pm.match.result || "—"}</td>
                  <td className="p-2 text-center">{pm.started ? "V" : "—"}</td>
                  <td className="p-2 text-center">{pm.minutes}</td>
                  <td className="p-2 text-center">{pm.goals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Scout notes */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="font-semibold mb-3">הערות סקאוט</h2>
        {player.scoutNotes.length > 0 && (
          <div className="space-y-3 mb-4">
            {player.scoutNotes.map(n => (
              <div key={n.id} className="p-3 bg-gray-50 rounded border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{n.scoutName}</span>
                  <Badge className={n.sentiment === "חיובי" ? "bg-green-100 text-green-800" : n.sentiment === "חשש" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-700"}>
                    {n.sentiment}
                  </Badge>
                  {n.category && <Badge className="bg-blue-50 text-blue-700">{n.category}</Badge>}
                  {n.followUpNeeded && <Badge className="bg-orange-100 text-orange-800">דרוש מעקב</Badge>}
                </div>
                <p className="text-sm">{n.note}</p>
                {n.videoUrl && <a href={n.videoUrl} target="_blank" className="text-xs text-blue-600 hover:underline">קישור לוידאו</a>}
                {(n.minuteStart !== null) && <span className="text-xs text-gray-500 mr-2">דקות: {n.minuteStart}-{n.minuteEnd}</span>}
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-3">הוספת הערה</h3>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="שם סקאוט" value={noteForm.scoutName} onChange={e => setNoteForm(f => ({ ...f, scoutName: e.target.value }))} className="border rounded px-2 py-1.5 text-sm" />
            <select value={noteForm.sentiment} onChange={e => setNoteForm(f => ({ ...f, sentiment: e.target.value }))} className="border rounded px-2 py-1.5 text-sm">
              <option value="חיובי">חיובי</option>
              <option value="ניטרלי">ניטרלי</option>
              <option value="חשש">חשש</option>
            </select>
            <select value={noteForm.category} onChange={e => setNoteForm(f => ({ ...f, category: e.target.value }))} className="border rounded px-2 py-1.5 text-sm col-span-2">
              <option value="">קטגוריה</option>
              <option value="ביטחון">ביטחון</option>
              <option value="בנייה">בנייה</option>
              <option value="סריקה">סריקה</option>
              <option value="דרישת כדור">דרישת כדור</option>
              <option value="קבלת החלטות">קבלת החלטות</option>
              <option value="עייפות">עייפות</option>
              <option value="מנהיגות">מנהיגות</option>
              <option value="לחץ">תגובה ללחץ</option>
              <option value="מיקום">מיקום</option>
              <option value="כיסוי">כיסוי</option>
              <option value="תקשורת">תקשורת</option>
              <option value="קו">ניהול קו</option>
            </select>
            <textarea placeholder="הערה" value={noteForm.note} onChange={e => setNoteForm(f => ({ ...f, note: e.target.value }))} className="border rounded px-2 py-1.5 text-sm col-span-2" rows={3} />
            <input placeholder="קישור לוידאו" value={noteForm.videoUrl} onChange={e => setNoteForm(f => ({ ...f, videoUrl: e.target.value }))} className="border rounded px-2 py-1.5 text-sm" />
            <div className="flex gap-2">
              <input placeholder="דקה התחלה" value={noteForm.minuteStart} onChange={e => setNoteForm(f => ({ ...f, minuteStart: e.target.value }))} className="border rounded px-2 py-1.5 text-sm w-24" type="number" />
              <input placeholder="דקה סיום" value={noteForm.minuteEnd} onChange={e => setNoteForm(f => ({ ...f, minuteEnd: e.target.value }))} className="border rounded px-2 py-1.5 text-sm w-24" type="number" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={noteForm.followUpNeeded} onChange={e => setNoteForm(f => ({ ...f, followUpNeeded: e.target.checked }))} />
              דרוש מעקב
            </label>
            <button onClick={addNote} disabled={!noteForm.scoutName || !noteForm.note} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              הוסף הערה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
