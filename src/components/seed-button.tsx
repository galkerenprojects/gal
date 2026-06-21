"use client";

export function SeedButton({ total }: { total: number }) {
  if (total > 0) return null;

  return (
    <button
      onClick={async () => {
        await fetch("/api/seed", { method: "POST" });
        window.location.reload();
      }}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
    >
      טען נתוני דוגמה
    </button>
  );
}
