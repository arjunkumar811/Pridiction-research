"use client";

interface MarketSearchProps {
  value: string;
  resultCount: number;
  onChange: (value: string) => void;
}

export function MarketSearch({ value, resultCount, onChange }: MarketSearchProps) {
  return (
    <div className="relative flex-1">
      <label htmlFor="market-search" className="sr-only">
        Search markets
      </label>
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">⌕</span>
      <input
        id="market-search"
        aria-label="Search markets"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search markets..."
        className="h-12 w-full rounded-xl border border-[#1B2230] bg-[#0D111A] pl-11 pr-20 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/15"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
        {value ? `${resultCount} found` : "⌘ K"}
      </span>
    </div>
  );
}