"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "דשבורד", icon: "📊" },
  { href: "/players", label: "שחקנים", icon: "⚽" },
  { href: "/players/new", label: "הוספת שחקן", icon: "➕" },
  { href: "/matches", label: "משחקים", icon: "🏟️" },
  { href: "/import", label: "ייבוא", icon: "📥" },
  { href: "/reports", label: "דוחות", icon: "📋" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed right-0 top-0 h-full w-64 bg-white border-l border-gray-200 flex flex-col z-50">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">סקאוטינג אקדמיה</h1>
        <p className="text-sm text-gray-500 mt-1">מערכת סקאוטינג פנימית</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <span>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 text-xs text-gray-400">
        נתונים ציבוריים בלבד
      </div>
    </aside>
  );
}
