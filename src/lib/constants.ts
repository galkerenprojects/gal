export const POSITIONS = [
  "שוער", "בלם", "מגן ימני", "מגן שמאלי",
  "קשר הגנתי", "קשר מרכזי", "קשר התקפי",
  "כנף ימני", "כנף שמאלי", "חלוץ",
];

export const REGIONS = [
  "ירושלים", "בית שמש", "נורדיה ירושלים", "מ.כ. ירושלים",
  "מודיעין", "שריגים", "מטה יהודה", "ראשון לציון", "נס ציונה",
  "יבנה", "רחובות", "מרמורק", "חולון", "בת ים", "לוד", "רמלה",
  "קרית גת", "אשדוד", "בני יהודה", "פתח תקווה", "כפר סבא",
  "רעננה", "נתניה", "ביתר תוברוק", "אחר",
];

export const REALISM_OPTIONS = ["High", "Medium", "Low"] as const;

export const GRADE_OPTIONS = ["A+", "A", "B+", "B", "C"] as const;

export const VERIFICATION_STATUSES = [
  "מאומת",
  "מאומת חלקית",
  "דרוש גיליון משחק",
  "דרוש וידאו",
  "לא מספיק נתונים",
] as const;

export const BADGE_CONFIG: Record<string, { label: string; color: string }> = {
  "2008": { label: "2008", color: "bg-blue-100 text-blue-800" },
  "2009-above": { label: "2009 מעל גיל", color: "bg-purple-100 text-purple-800" },
  formerMTA: { label: "לשעבר מכבי ת\"א", color: "bg-yellow-100 text-yellow-800" },
  formerMHA: { label: "לשעבר מכבי חיפה", color: "bg-green-100 text-green-800" },
  formerHTA: { label: "לשעבר הפועל ת\"א", color: "bg-red-100 text-red-800" },
  needsVideo: { label: "דרוש וידאו", color: "bg-orange-100 text-orange-800" },
  defensive: { label: "פרופיל הגנתי", color: "bg-slate-100 text-slate-800" },
  stuckU19: { label: "תקוע ב-U19", color: "bg-amber-100 text-amber-800" },
  lateBloomer: { label: "פורח מאוחר", color: "bg-teal-100 text-teal-800" },
  survival: { label: "שחקן הישרדות", color: "bg-pink-100 text-pink-800" },
  geoFit: { label: "התאמה גיאוגרפית", color: "bg-emerald-100 text-emerald-800" },
};

export const GRADE_LABELS: Record<string, { label: string; color: string }> = {
  "A+": { label: "A+ — לפנות מיידית", color: "bg-green-600 text-white" },
  A: { label: "A — חובה לצפות", color: "bg-green-500 text-white" },
  "B+": { label: "B+ — מעקב חודשי", color: "bg-blue-500 text-white" },
  B: { label: "B — לבדוק שוב בעוד 6 חודשים", color: "bg-gray-500 text-white" },
  C: { label: "C — לא רלוונטי כרגע", color: "bg-gray-400 text-white" },
};

export const REALISM_LABELS: Record<string, { label: string; color: string }> = {
  High: { label: "גבוה", color: "bg-green-100 text-green-800" },
  Medium: { label: "בינוני", color: "bg-yellow-100 text-yellow-800" },
  Low: { label: "נמוך", color: "bg-red-100 text-red-800" },
};
