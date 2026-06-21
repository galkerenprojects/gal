"use client";

import { useState } from "react";

export default function ImportPage() {
  const [csvText, setCsvText] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState("");

  const importCSV = async () => {
    setImporting(true);
    setResult("");
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) {
      setResult("צריך לפחות שורת כותרת ושורת נתונים");
      setImporting(false);
      return;
    }

    const headers = lines[0].split(",").map(h => h.trim());
    let imported = 0;

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ""; });

      const player = {
        fullName: row["שם"] || row["fullName"] || "",
        birthYear: Number(row["שנת לידה"] || row["birthYear"]) || 2008,
        position: row["עמדה"] || row["position"] || "בלם",
        region: row["אזור"] || row["region"] || "אחר",
        appearances: Number(row["הופעות"] || row["appearances"]) || 0,
        starts: Number(row["הרכבים"] || row["starts"]) || 0,
        minutes: Number(row["דקות"] || row["minutes"]) || 0,
        goals: Number(row["שערים"] || row["goals"]) || 0,
        yellowCards: Number(row["צהובים"] || row["yellowCards"]) || 0,
        redCards: Number(row["אדומים"] || row["redCards"]) || 0,
        realism: row["ריאליות"] || row["realism"] || "Medium",
      };

      if (!player.fullName) continue;

      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(player),
      });
      if (res.ok) imported++;
    }

    setResult(`יובאו ${imported} שחקנים בהצלחה`);
    setImporting(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">ייבוא נתונים</h1>

      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="font-semibold">ייבוא מ-CSV / הדבקת טבלה</h2>
        <p className="text-sm text-gray-500">
          הדבק נתוני CSV עם כותרות: שם, שנת לידה, עמדה, אזור, הופעות, הרכבים, דקות, שערים, צהובים, אדומים, ריאליות
        </p>
        <textarea
          value={csvText}
          onChange={e => setCsvText(e.target.value)}
          placeholder={`שם,שנת לידה,עמדה,אזור,הופעות,הרכבים,דקות,שערים\nדני כהן,2008,בלם,ירושלים,20,18,1600,2`}
          className="w-full border rounded px-3 py-2 text-sm font-mono"
          rows={10}
          dir="ltr"
        />
        <button
          onClick={importCSV}
          disabled={importing || !csvText.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {importing ? "מייבא..." : "ייבוא"}
        </button>
        {result && <p className="text-sm text-green-600 font-medium">{result}</p>}
      </div>

      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="font-semibold">העלאת קובץ CSV</h2>
        <input
          type="file"
          accept=".csv"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const text = await file.text();
              setCsvText(text);
            }
          }}
          className="text-sm"
        />
      </div>
    </div>
  );
}
