import { formatPercent } from "@/lib/format";
import type { Market } from "@/types/market";

export function OutcomeList({ market }: { market: Market }) {
  return <div className="space-y-5">{market.outcomes.map((outcome, index) => <div key={`${outcome}-${index}`}><div className="flex items-center justify-between gap-4"><span className="truncate text-sm font-medium text-slate-200">{outcome}</span><span className="text-sm font-bold text-white">{formatPercent(market.outcomePrices[index] ?? 0)}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.max(0, Math.min(100, (market.outcomePrices[index] ?? 0) * 100))}%` }} /></div></div>)}</div>;
}