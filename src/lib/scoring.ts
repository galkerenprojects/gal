type PlayerData = {
  birthYear: number;
  playsAboveAge: boolean;
  region: string;
  realism: string;
  appearances: number;
  starts: number;
  minutes: number;
  goals: number;
  assists: number | null;
  assistsVerified: boolean;
  position: string;
  formerTopClub: boolean;
  lateBloomer: boolean;
  stuckInU19: boolean;
  verificationStatus: string;
  sources?: { reliability: string; reliabilityLevel: number }[];
  scoutNotes?: { sentiment: string }[];
};

const PRIORITY_REGIONS = [
  "ירושלים", "בית שמש", "נורדיה ירושלים", "מ.כ. ירושלים",
  "מודיעין", "שריגים", "מטה יהודה", "ראשון לציון", "נס ציונה",
  "יבנה", "רחובות", "מרמורק", "חולון", "בת ים", "לוד", "רמלה",
  "קרית גת", "אשדוד",
];

const SECONDARY_REGIONS = [
  "בני יהודה", "פתח תקווה", "כפר סבא", "רעננה", "נתניה", "ביתר תוברוק",
];

export function calculateScore(player: PlayerData): { score: number; grade: string } {
  let score = 0;

  // 1. Age fit (10)
  if (player.birthYear === 2008) score += 10;
  else if (player.birthYear === 2009 && player.playsAboveAge) score += 8;
  else if (player.birthYear === 2009) score += 3;

  // 2. Geography (10)
  if (PRIORITY_REGIONS.includes(player.region)) score += 10;
  else if (SECONDARY_REGIONS.includes(player.region)) score += 6;
  else score += 2;

  // 3. Club realism (15)
  if (player.realism === "High") score += 15;
  else if (player.realism === "Medium") score += 10;
  else score += 4;

  // 4. Playing time (15)
  const appScore = Math.min(player.appearances / 20, 1) * 5;
  const startRate = player.appearances > 0 ? player.starts / player.appearances : 0;
  const startScore = startRate * 5;
  const minuteScore = Math.min(player.minutes / 1400, 1) * 5;
  score += Math.round(appScore + startScore + minuteScore);

  // 5. Production / reliability (15)
  const isAttacker = ["חלוץ", "כנף", "קשר התקפי", "FW", "WG", "AM"].some(
    p => player.position.includes(p)
  );
  if (isAttacker) {
    const goalScore = Math.min(player.goals / 15, 1) * 8;
    const assistScore = player.assistsVerified && player.assists
      ? Math.min(player.assists / 8, 1) * 4
      : 0;
    const tightMatchBonus = player.goals >= 6 ? 3 : 0;
    score += Math.round(goalScore + assistScore + tightMatchBonus);
  } else {
    const reliabilityScore = startRate * 8;
    const fullMatchBonus = player.minutes > 1200 ? 4 : player.minutes > 800 ? 2 : 0;
    const defBonus = player.appearances >= 18 ? 3 : 0;
    score += Math.round(reliabilityScore + fullMatchBonus + defBonus);
  }

  // 6. Top-club background (10)
  if (player.formerTopClub) score += 10;

  // 7. Late bloomer / stuck transition (10)
  if (player.lateBloomer) score += 5;
  if (player.stuckInU19) score += 5;

  // 8. Evidence quality (10)
  const sources = player.sources || [];
  if (sources.length === 0) score += 1;
  else {
    const level1 = sources.filter(s => s.reliabilityLevel <= 1).length;
    const level2 = sources.filter(s => s.reliabilityLevel === 2).length;
    const level3 = sources.filter(s => s.reliabilityLevel === 3).length;
    score += Math.min(level1 * 4 + level2 * 3 + level3 * 1, 10);
  }

  // 9. Scout subjective (5)
  const notes = player.scoutNotes || [];
  const positiveNotes = notes.filter(n => n.sentiment === "חיובי").length;
  score += Math.min(positiveNotes * 2, 5);

  score = Math.min(score, 100);

  let grade: string;
  if (score >= 85) grade = "A+";
  else if (score >= 75) grade = "A";
  else if (score >= 65) grade = "B+";
  else if (score >= 50) grade = "B";
  else grade = "C";

  return { score, grade };
}

export const SCORING_WEIGHTS = {
  ageFit: { max: 10, description: "התאמת גיל" },
  geography: { max: 10, description: "אזור גיאוגרפי" },
  clubRealism: { max: 15, description: "ריאליות מועדון" },
  playingTime: { max: 15, description: "זמן משחק" },
  production: { max: 15, description: "תפוקה / אמינות הגנתית" },
  topClubBackground: { max: 10, description: "רקע במועדון גדול" },
  lateBloomer: { max: 10, description: "פורח מאוחר / תקוע במעבר" },
  evidenceQuality: { max: 10, description: "איכות עדויות" },
  scoutSubjective: { max: 5, description: "ציון סקאוט סובייקטיבי" },
};
