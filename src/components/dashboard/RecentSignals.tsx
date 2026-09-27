import Link from "next/link";

import type { StoredSignal } from "@/lib/signals/types";
import type { Market } from "@/types/market";

export function RecentSignals({ signals, markets }: { signals: StoredSignal[]; markets: Market[] }) {
  const marketMap = new Map(markets.map((market) => [market.id, market]));
  return <section className="rounded-xl border border-[#1B2230] bg-[#0D111A] p-5"><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Recent signals</h2>{signals.length ? <div className="mt-4 space-y-1">{signals.slice(0, 5).map((signal) => <Link key={signal.id} href={`/markets/${marketMap.get(signal.marketId)?.slug ?? signal.marketId}`} className="flex items-center justify-between gap-3 rounded-lg px-2 py-3 hover:bg-white/5"><span className="flex min-w-0 items-center gap-3"><time className="shrink-0 text-xs text-slate-600">{new Date(signal.detectedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time><span className="truncate text-sm text-slate-300">{marketMap.get(signal.marketId)?.question ?? signal.marketId}</span></span><span className="shrink-0 text-[10px] font-bold uppercase text-slate-500">{signal.severity}</span></Link>)}</div> : <p className="mt-8 text-sm text-slate-500">No signals detected yet.</p>}</section>;
}