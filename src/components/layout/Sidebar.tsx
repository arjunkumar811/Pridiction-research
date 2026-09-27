import Link from "next/link";

const navigation = [
  ["▦", "Dashboard", "/dashboard"],
  ["↗", "Markets", "/markets"],
  ["ϟ", "Signals", "/signals"],
  ["▤", "News", "#"],
  ["♡", "Watchlist", "#"],
  ["⌁", "Research", "#"],
  ["⚙", "Settings", "#"],
] as const;

export function Sidebar() {
  return <aside className="hidden w-56 shrink-0 border-r border-[#1B2230] bg-[#0D111A] p-4 lg:block"><Link href="/dashboard" className="block px-3 py-4 text-xs font-bold tracking-[0.28em] text-violet-300">ALPHA</Link><nav aria-label="Primary navigation" className="mt-6 space-y-1">{navigation.map(([icon, label, href]) => <Link key={label} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${label === "Dashboard" ? "bg-violet-500/15 font-semibold text-violet-200" : href === "#" ? "text-slate-600" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><span className="w-5 text-center">{icon}</span>{label}</Link>)}</nav></aside>;
}