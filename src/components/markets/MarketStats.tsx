import { formatPercent, formatUsd } from "@/lib/format";
import type { Market } from "@/types/market";

export function MarketStats({ market }: { market: Market }) {
  const stats = [{ label: "Volume", value: formatUsd(market.volume) }, { label: "Liquidity", value: formatUsd(market.liquidity) }, { label: "24h volume", value: formatUsd(market.volume24hr) }, { label: "1 week volume", value: formatUsd(market.volume1wk) }, { label: "1 month volume", value: formatUsd(market.volume1mo) }, { label: "YES", value: formatPercent(market.yesPrice) }];
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{stats.map((stat) => <div key={stat.label} className="rounded-xl border border-[#1B2230] bg-[#0D111A] p-4"><p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">{stat.label}</p><p className="mt-2 text-lg font-bold text-white">{stat.value}</p></div>)}</div>;
}