import Link from "next/link";

import type { MarketMover } from "@/lib/dashboard/data";

export function MarketMovers({ movers }: { movers: MarketMover[] }) {
  return <section className="rounded-xl border border-[#1B2230] bg-[#0D111A] p-5"><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Market movers</h2>{movers.length ? <div className="mt-4 space-y-1">{movers.map(({ market, change }) => <Link key={market.id} href={`/markets/${market.slug ?? market.id}`} className="flex items-center justify-between gap-3 rounded-lg px-2 py-3 hover:bg-white/5"><span className="truncate text-sm text-slate-200">{market.question}</span><span className={`shrink-0 text-sm font-semibold ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>{change >= 0 ? "+" : ""}{change.toFixed(1)}pp</span></Link>)}</div> : <p className="mt-8 text-sm text-slate-500">Not enough historical data yet.</p>}</section>;
}