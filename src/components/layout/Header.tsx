import Link from "next/link";

export function Header() {
  return <header className="flex items-center justify-between border-b border-[#1B2230] px-4 py-3 sm:px-6"><Link href="/dashboard" className="text-xs font-bold tracking-[0.28em] text-violet-300 lg:hidden">ALPHA</Link><div className="ml-auto flex items-center gap-4 text-slate-500"><Link href="/markets" aria-label="Search markets" className="text-lg hover:text-white">⌕</Link><span aria-label="Notifications unavailable" className="text-lg">♢</span><span className="hidden text-xs text-slate-600 sm:inline">LIVE DATA</span></div></header>;
}