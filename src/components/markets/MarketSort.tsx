"use client";

export type MarketSort = "volume" | "liquidity" | "probability" | "change" | "endDate";

export function MarketSort({ value, onChange }: { value: MarketSort; onChange: (value: MarketSort) => void }) {
  return (
    <label className="flex items-center gap-2 text-xs text-slate-500">
      Sort by
      <select value={value} onChange={(event) => onChange(event.target.value as MarketSort)} className="rounded-lg border border-[#1B2230] bg-[#0D111A] px-3 py-2 font-semibold text-slate-200 outline-none focus:border-violet-500/70">
        <option value="volume">Volume ↓</option>
        <option value="liquidity">Liquidity</option>
        <option value="probability">Probability</option>
        <option value="change">24h Change</option>
        <option value="endDate">End Date</option>
      </select>
    </label>
  );
}