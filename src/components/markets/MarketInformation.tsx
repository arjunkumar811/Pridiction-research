import { formatDate } from "@/lib/format";
import type { Market } from "@/types/market";

export function MarketInformation({ market }: { market: Market }) {
  const fields = [["Market ID", market.id], ["Condition ID", market.conditionId], ["Start date", formatDate(market.startDate)], ["End date", formatDate(market.endDate)], ["Status", market.closed ? "Closed" : market.active ? "Active" : "—"], ["Category", market.category], ["Slug", market.slug]];
  return <section><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Market information</p><dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{fields.map(([label, value]) => <div key={label} className="rounded-lg border border-[#1B2230] bg-[#0D111A] px-4 py-3"><dt className="text-[10px] uppercase tracking-wider text-slate-600">{label}</dt><dd className="mt-1 truncate text-sm text-slate-300">{value || "—"}</dd></div>)}</dl></section>;
}