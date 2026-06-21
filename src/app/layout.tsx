import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "סקאוטינג אקדמיה",
  description: "מערכת סקאוטינג פנימית לאקדמיית כדורגל נוער",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex bg-gray-50 text-gray-900 font-sans">
        <Sidebar />
        <main className="flex-1 mr-64 p-6 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
