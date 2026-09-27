import { getMarkets } from "@/lib/polymarket";
import type { Market } from "@/types/market";

export async function getMarketBySlug(slug: string): Promise<Market | null> {
  const markets = await getMarkets({ limit: 1, slug });
  return markets.find((market) => market.slug === slug || market.id === slug) ?? null;
}