"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/badge";

type Match = {
  id: string;
  date: string | null;
  league: string | null;
  ageGroup: string | null;
  homeTeamName: string;
  awayTeamName: string;
  result: string | null;
  round: string | null;
  scoutingReason: string | null;
  recommendedTeamToWatch: string | null;
  recommendedPositions: string | null;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch("/api/matches").then(r => r.json()).then(setMatches);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">משחקים מומלצים לצפייה</h1>
      <p className="text-sm text-gray-500">משחקים שבהם קבוצה קטנה ביצעה מול קבוצה חזקה — מתאימים לסקאוטינג.</p>

      <div className="space-y-4">
        {matches.map(m => (
          <div key={m.id} className="bg-white rounded-lg border p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-bold text-lg">{m.homeTeamName} vs {m.awayTeamName}</span>
                {m.result && <Badge className="bg-gray-100 text-gray-800 mr-3">{m.result}</Badge>}
              </div>
              <div className="text-sm text-gray-500">
                {m.date && <span>{m.date}</span>}
                {m.round && <span className="mr-2">סיבוב {m.round}</span>}
              </div>
            </div>
            {m.league && <p className="text-sm text-gray-600">{m.league} • {m.ageGroup}</p>}
            {m.scoutingReason && (
              <div className="mt-3 bg-blue-50 rounded p-3">
                <p className="text-sm text-blue-800"><strong>למה לצפות:</strong> {m.scoutingReason}</p>
              </div>
            )}
            <div className="flex gap-3 mt-3 text-sm">
              {m.recommendedTeamToWatch && (
                <div><strong>קבוצה לסקאוטינג:</strong> {m.recommendedTeamToWatch}</div>
              )}
              {m.recommendedPositions && (
                <div className="flex gap-1">
                  <strong>עמדות:</strong>
                  {m.recommendedPositions.split(",").map(p => (
                    <Badge key={p.trim()} className="bg-gray-100 text-gray-700">{p.trim()}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {matches.length === 0 && (
          <div className="text-center py-12 text-gray-400">אין משחקים מומלצים. טען נתוני דוגמה מהדשבורד.</div>
        )}
      </div>
    </div>
  );
}
