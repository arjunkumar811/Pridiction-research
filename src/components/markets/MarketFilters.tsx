"use client";

import { useState } from "react";

import type { MarketCategory } from "@/types/market";

export interface AdvancedFilters {
  probability: "any" | "50" | "75";
  volume: "any" | "100k" | "1m" | "10m";
  endingSoon: boolean;
}

interface MarketFiltersProps {
  category: MarketCategory | "all";
  advanced: AdvancedFilters;
  onCategoryChange: (category: MarketCategory | "all") => void;
  onApply: (filters: AdvancedFilters) => void;
}

const categories: Array<{ label: string; value: MarketCategory | "all" }> = [
  { label: "All", value: "all" },
  { label: "Crypto", value: "crypto" },
  { label: "Politics", value: "politics" },
  { label: "Technology", value: "technology" },
  { label: "Economy", value: "economy" },
  { label: "Sports", value: "sports" },
  { label: "Other", value: "other" },
];

export function MarketFilters({
  category,
  advanced,
  onCategoryChange,
  onApply,
}: MarketFiltersProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(advanced);

  function reset() {
    const empty: AdvancedFilters = { probability: "any", volume: "any", endingSoon: false };
    setDraft(empty);
    onApply(empty);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Market categories">
        {categories.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={category === item.value}
            onClick={() => onCategoryChange(item.value)}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${category === item.value ? "bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/30" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="relative">
        <button
          type="button"
          aria-label="Filter markets"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="rounded-lg border border-[#1B2230] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-violet-500/50 hover:text-white"
        >
          Filters {advanced.endingSoon || advanced.probability !== "any" || advanced.volume !== "any" ? "•" : ""}
        </button>
        {open ? (
          <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-[#1B2230] bg-[#0D111A] p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Market filters</h2>
              <button type="button" onClick={reset} className="text-xs text-slate-500 hover:text-white">Reset</button>
            </div>
            <fieldset className="space-y-2 text-xs text-slate-300">
              <legend className="mb-2 font-semibold text-slate-500">Probability</legend>
              {["any", "50", "75"].map((value) => (
                <label key={value} className="flex items-center gap-2">
                  <input type="radio" name="probability" checked={draft.probability === value} onChange={() => setDraft({ ...draft, probability: value as AdvancedFilters["probability"] })} />
                  {value === "any" ? "Any" : `>${value}%`}
                </label>
              ))}
            </fieldset>
            <fieldset className="mt-4 space-y-2 text-xs text-slate-300">
              <legend className="mb-2 font-semibold text-slate-500">Volume</legend>
              {["any", "100k", "1m", "10m"].map((value) => (
                <label key={value} className="flex items-center gap-2">
                  <input type="radio" name="volume" checked={draft.volume === value} onChange={() => setDraft({ ...draft, volume: value as AdvancedFilters["volume"] })} />
                  {value === "any" ? "Any" : `>$${value.toUpperCase()}`}
                </label>
              ))}
            </fieldset>
            <label className="mt-4 flex items-center gap-2 text-xs text-slate-300">
              <input type="checkbox" checked={draft.endingSoon} onChange={(event) => setDraft({ ...draft, endingSoon: event.target.checked })} />
              Ending within 7 days
            </label>
            <button type="button" onClick={() => { onApply(draft); setOpen(false); }} className="mt-4 w-full rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500">Apply filters</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}