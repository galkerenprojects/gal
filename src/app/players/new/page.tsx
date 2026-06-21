"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { POSITIONS, REGIONS, VERIFICATION_STATUSES } from "@/lib/constants";

export default function NewPlayerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    birthYear: 2008,
    birthDate: "",
    position: "בלם",
    secondaryPosition: "",
    region: "ירושלים",
    league: "",
    ageGroup: "U19",
    appearances: 0,
    starts: 0,
    minutes: 0,
    goals: 0,
    assists: 0,
    assistsVerified: false,
    yellowCards: 0,
    redCards: 0,
    formerTopClub: false,
    topClubName: "",
    stuckInU19: false,
    lateBloomer: false,
    playsAboveAge: false,
    realism: "Medium",
    verificationStatus: "לא מספיק נתונים",
    whyInteresting: "",
    nextAction: "",
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      assists: form.assistsVerified ? form.assists : null,
    };
    const res = await fetch("/api/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const player = await res.json();
      router.push(`/players/${player.id}`);
    }
    setSaving(false);
  };

  const set = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">הוספת שחקן</h1>
      <form onSubmit={submit} className="bg-white rounded-lg border p-6 space-y-6">
        <Section title="פרטים בסיסיים">
          <Input label="שם מלא" value={form.fullName} onChange={v => set("fullName", v)} required />
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="שנת לידה" value={form.birthYear} onChange={v => set("birthYear", v)} />
            <Input label="תאריך לידה" value={form.birthDate} onChange={v => set("birthDate", v)} placeholder="YYYY-MM-DD" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="עמדה" value={form.position} onChange={v => set("position", v)} options={POSITIONS} />
            <Select label="עמדה משנית" value={form.secondaryPosition} onChange={v => set("secondaryPosition", v)} options={["", ...POSITIONS]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="אזור" value={form.region} onChange={v => set("region", v)} options={REGIONS} />
            <Input label="ליגה" value={form.league} onChange={v => set("league", v)} />
          </div>
          <Select label="קבוצת גיל" value={form.ageGroup} onChange={v => set("ageGroup", v)} options={["U17", "U19", "בוגרים"]} />
        </Section>

        <Section title="סטטיסטיקות">
          <div className="grid grid-cols-3 gap-3">
            <NumberInput label="הופעות" value={form.appearances} onChange={v => set("appearances", v)} />
            <NumberInput label="הרכבים" value={form.starts} onChange={v => set("starts", v)} />
            <NumberInput label="דקות" value={form.minutes} onChange={v => set("minutes", v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="שערים" value={form.goals} onChange={v => set("goals", v)} />
            <div>
              <NumberInput label="בישולים" value={form.assists} onChange={v => set("assists", v)} />
              <label className="flex items-center gap-1.5 mt-1 text-xs">
                <input type="checkbox" checked={form.assistsVerified} onChange={e => set("assistsVerified", e.target.checked)} />
                בישולים מאומתים
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="כרטיסים צהובים" value={form.yellowCards} onChange={v => set("yellowCards", v)} />
            <NumberInput label="כרטיסים אדומים" value={form.redCards} onChange={v => set("redCards", v)} />
          </div>
        </Section>

        <Section title="פרופיל סקאוטינג">
          <div className="grid grid-cols-3 gap-3">
            <Select label="ריאליות" value={form.realism} onChange={v => set("realism", v)} options={["High", "Medium", "Low"]} />
            <Select label="סטטוס אימות" value={form.verificationStatus} onChange={v => set("verificationStatus", v)} options={[...VERIFICATION_STATUSES]} />
          </div>
          <div className="flex flex-wrap gap-4">
            <Checkbox label="מועדון גדול לשעבר" checked={form.formerTopClub} onChange={v => set("formerTopClub", v)} />
            <Checkbox label="תקוע ב-U19" checked={form.stuckInU19} onChange={v => set("stuckInU19", v)} />
            <Checkbox label="פורח מאוחר" checked={form.lateBloomer} onChange={v => set("lateBloomer", v)} />
            <Checkbox label="משחק מעל גיל" checked={form.playsAboveAge} onChange={v => set("playsAboveAge", v)} />
          </div>
          {form.formerTopClub && (
            <Select label="מועדון גדול" value={form.topClubName} onChange={v => set("topClubName", v)} options={["מכבי תל אביב", "מכבי חיפה", "הפועל תל אביב"]} />
          )}
          <textarea placeholder="למה השחקן מעניין" value={form.whyInteresting} onChange={e => set("whyInteresting", e.target.value)} className="w-full border rounded px-3 py-2 text-sm" rows={2} />
          <Input label="פעולה הבאה" value={form.nextAction} onChange={v => set("nextAction", v)} />
        </Section>

        <button type="submit" disabled={saving || !form.fullName} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
          {saving ? "שומר..." : "שמור שחקן"}
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-gray-700 border-b pb-2">{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, required, placeholder }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder} className="w-full border rounded px-3 py-1.5 text-sm" />
    </div>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} className="w-full border rounded px-3 py-1.5 text-sm" />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full border rounded px-3 py-1.5 text-sm">
        {options.map(o => <option key={o} value={o}>{o || "—"}</option>)}
      </select>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-1.5 text-sm cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
