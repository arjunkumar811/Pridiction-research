import Link from "next/link";

import { formatDate, formatPercent, formatUsd } from "@/lib/format";
import type { Market } from "@/types/market";
import { MarketCard } from "./MarketCard";

export function MarketTable({ markets }: { markets: Market[] }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-[#1B2230] bg-[#0D111A] md:block">
        <table className="w-full text-left"><thead className="border-b border-[#1B2230] text-[10px] uppercase tracking-[0.16em] text-slate-500"><tr><th className="px-5 py-4 font-medium">Market</th><th className="px-4 py-4 font-medium">Probability</th><th className="px-4 py-4 font-medium">24h</th><th className="px-4 py-4 font-medium">Volume</th><th className="px-4 py-4 font-medium">Liquidity</th><th className="px-5 py-4 font-medium">End date</th></tr></thead><tbody className="divide-y divide-[#1B2230]">{markets.map((market) => <tr key={market.id} className="transition hover:bg-white/[0.025]"><td className="px-5 py-4"><Link href={`/markets/${market.slug ?? market.id}`} className="flex max-w-md items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5 text-violet-300">{market.image || market.icon ? <img src={market.image ?? market.icon} alt="" className="h-full w-full object-cover" /> : "◈"}</span><span><span className="block text-sm font-medium text-slate-100">{market.title}</span><span className="mt-1 block text-[11px] capitalize text-slate-500">{market.category}</span></span></Link></td><td className="px-4 py-4"><span className="font-semibold text-white">{formatPercent(market.yesPrice)}</span><div className="mt-2 h-1 w-20 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.min(100, market.yesPrice * 100)}%` }} /></div></td><td className="px-4 py-4 text-sm text-slate-500">—</td><td className="px-4 py-4 text-sm font-medium text-slate-200">{formatUsd(market.volume)}</td><td className="px-4 py-4 text-sm text-slate-300">{formatUsd(market.liquidity)}</td><td className="px-5 py-4 text-xs text-slate-400">{formatDate(market.endDate)}</td></tr>)}</tbody></table>
      </div>
      <div className="grid gap-3 md:hidden">{markets.map((market) => <MarketCard key={market.id} market={market} />)}</div>
    </>
  );
}