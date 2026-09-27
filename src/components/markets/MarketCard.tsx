import Link from "next/link";

import { formatDate, formatPercent, formatUsd } from "@/lib/format";
import type { Market } from "@/types/market";

export function MarketCard({ market }: { market: Market }) {
  const href = `/markets/${market.slug ?? market.id}`;
  return (
    <Link href={href} className="block rounded-xl border border-[#1B2230] bg-[#0D111A] p-4 transition hover:border-violet-500/50 hover:bg-[#111722]">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
        <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-white/5">{market.image || market.icon ? <img src={market.image ?? market.icon} alt="" className="h-full w-full object-cover" /> : "◈"}</span>
        {market.category}
      </div>
      <h3 className="mt-4 min-h-12 text-sm font-semibold leading-6 text-slate-100">{market.title}</h3>
      <div className="mt-4 flex items-end justify-between">
        <div><p className="text-[10px] uppercase tracking-wider text-slate-500">Yes</p><p className="text-2xl font-bold text-white">{formatPercent(market.yesPrice)}</p></div>
        <div className="w-28"><div className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.min(100, market.yesPrice * 100)}%` }} /></div><p className="mt-2 text-right text-[11px] text-slate-500">{market.outcomes.length > 2 ? `${market.outcomes.length} outcomes` : `No ${formatPercent(market.noPrice)}`}</p></div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#1B2230] pt-3 text-xs"><div><p className="text-slate-500">Volume</p><p className="mt-1 font-semibold text-slate-200">{formatUsd(market.volume)}</p></div><div><p className="text-slate-500">Ends</p><p className="mt-1 font-semibold text-slate-200">{formatDate(market.endDate)}</p></div></div>
    </Link>
  );
}