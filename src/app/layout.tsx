import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, LayoutDashboard, Target } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = { title: "Goal Forge", description: "Turn plans into progress" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-[#dce2da] bg-[#173e2a] p-5 text-white md:min-h-screen md:border-b-0">
        <Link href="/" className="flex items-center gap-3 text-xl font-black"><span className="grid size-10 place-items-center rounded-xl bg-[#d9e8a8] text-[#173e2a]"><Target size={22}/></span>Goal Forge</Link>
        <p className="mt-3 text-xs text-white/55">Turn intention into achievement.</p>
        <nav aria-label="Main navigation" className="mt-8 flex flex-wrap gap-2 md:flex-col">
          <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/10"><LayoutDashboard size={18}/>Dashboard</Link>
          <Link href="/metas-anteriores" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/10"><CheckCircle2 size={18}/>Completed</Link>
        </nav>
      </aside>
      <main className="min-w-0 p-5 md:p-8 lg:p-10">{children}</main>
    </div>
  </body></html>;
}
