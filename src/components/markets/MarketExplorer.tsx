"use client";

import { useEffect, useMemo, useState } from "react";

import { MarketEmptyState } from "@/components/markets/MarketEmptyState";
import { AdvancedFilters, MarketFilters } from "@/components/markets/MarketFilters";
import { MarketPagination } from "@/components/markets/MarketPagination";
import { MarketSearch } from "@/components/markets/MarketSearch";
import { MarketSort, type MarketSort as MarketSortValue } from "@/components/markets/MarketSort";
import { MarketTable } from "@/components/markets/MarketTable";
import type { Market, MarketCategory } from "@/types/market";

const PAGE_SIZE = 100;
const defaultFilters: AdvancedFilters = { probability: "any", volume: "any", endingSoon: false };

export function MarketExplorer({ initialMarkets }: { initialMarkets: Market[] }) {
  const [markets, setMarkets] = useState(initialMarkets);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MarketCategory | "all">("all");
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState<MarketSortValue>("volume");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [now] = useState(() => Date.now());

  useEffect(() => {
    if (page === 1) return;
    let cancelled = false;
    fetch(`/api/markets?limit=${PAGE_SIZE}&offset=${(page - 1) * PAGE_SIZE}`)
      .then((response) => { if (!response.ok) throw new Error("request failed"); return response.json(); })
      .then((payload: { markets?: Market[] }) => { if (!cancelled) setMarkets(payload.markets ?? []); })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page]);

  const visibleMarkets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = markets.filter((market) => {
      const matchesQuery = !normalizedQuery || `${market.question} ${market.slug ?? ""}`.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === "all" || market.category === category;
      const matchesProbability = filters.probability === "any" || market.yesPrice > Number(filters.probability) / 100;
      const volumeThreshold = { any: 0, "100k": 100_000, "1m": 1_000_000, "10m": 10_000_000 }[filters.volume];
      const matchesVolume = market.volume > volumeThreshold;
      const endsSoon = market.endDate ? new Date(market.endDate).getTime() - now <= 7 * 86_400_000 : false;
      return matchesQuery && matchesCategory && matchesProbability && matchesVolume && (!filters.endingSoon || endsSoon);
    });

    return filtered.sort((left, right) => {
      if (sort === "liquidity") return right.liquidity - left.liquidity;
      if (sort === "probability") return right.yesPrice - left.yesPrice;
      if (sort === "endDate") return new Date(left.endDate ?? "9999-12-31").getTime() - new Date(right.endDate ?? "9999-12-31").getTime();
      return right.volume - left.volume;
    });
  }, [category, filters, markets, now, query, sort]);

  function clearFilters() {
    setQuery(""); setCategory("all"); setFilters(defaultFilters); setSort("volume");
  }

  return <div className="space-y-5">
    <div className="flex flex-col gap-3 lg:flex-row"><MarketSearch value={query} resultCount={visibleMarkets.length} onChange={setQuery} /><MarketSort value={sort} onChange={setSort} /></div>
    <MarketFilters category={category} advanced={filters} onCategoryChange={(value) => { setCategory(value); setPage(1); }} onApply={setFilters} />
    <div className="flex items-center justify-between"><p className="text-xs text-slate-500"><span className="font-semibold text-slate-200">{visibleMarkets.length}</span> markets on page {page}</p><span className="text-xs text-slate-600">Live data · refreshed every minute</span></div>
    {error ? <div role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center"><p className="font-semibold text-white">Unable to load markets</p><p className="mt-2 text-sm text-slate-500">Something went wrong while fetching market data.</p><button type="button" onClick={() => { setError(false); setPage(1); }} className="mt-5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white">Try again</button></div> : loading ? <div className="space-y-3"><div className="h-16 animate-pulse rounded-xl border border-[#1B2230] bg-[#0D111A]" /><div className="h-16 animate-pulse rounded-xl border border-[#1B2230] bg-[#0D111A]" /></div> : visibleMarkets.length ? <MarketTable markets={visibleMarkets} /> : <MarketEmptyState onClear={clearFilters} />}
    <MarketPagination page={page} hasNext={markets.length === PAGE_SIZE} onChange={(nextPage) => { setLoading(nextPage !== 1); setPage(nextPage); setQuery(""); setCategory("all"); }} />
  </div>;
}