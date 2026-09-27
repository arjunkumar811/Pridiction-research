import { getMarkets } from "@/lib/polymarket";
import type { Market } from "@/types/market";

export async function getActiveMarkets(
  options: { limit?: number; offset?: number } = {},
): Promise<Market[]> {
  return getMarkets(options);
}