import Link from "next/link";

import type { StoredSignal } from "@/lib/signals/types";
import type { Market } from "@/types/market";

export function TopSignals({ signals, markets }: { signals: StoredSignal[]; markets: Market[] }) {
  const marketMap = new Map(markets.map((market) => [market.id, market]));
  return <section className="rounded-xl border border-[#1B2230] bg-[#0D111A] p-5"><div className="flex items-center justify-between"><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Top signals</h2><Link href="/signals" className="text-xs text-violet-300 hover:text-white">View all →</Link></div>{signals.length ? <div className="mt-4 space-y-1">{signals.slice(0, 5).map((signal) => { const market = marketMap.get(signal.marketId); return <Link key={signal.id} href={market ? `/markets/${market.slug ?? market.id}` : "/signals"} className="flex items-center justify-between gap-3 rounded-lg px-2 py-3 transition hover:bg-white/5"><span className="min-w-0"><span className={`block text-[10px] font-bold uppercase tracking-wider ${signal.severity === "high" ? "text-red-300" : "text-amber-300"}`}>{signal.severity}</span><span className="mt-1 block truncate text-sm text-slate-200">{market?.question ?? signal.marketId}</span></span><span className="shrink-0 text-sm font-bold text-white">{signal.score}</span></Link>; })}</div> : <p className="mt-8 text-sm leading-6 text-slate-500">No signals detected yet. The engine needs more historical market data.</p>}</section>;
}