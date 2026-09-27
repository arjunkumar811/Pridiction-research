export type MarketCategory =
  | "crypto"
  | "politics"
  | "technology"
  | "sports"
  | "economy"
  | "other";

export interface Market {
  id: string;
  title: string;
  category: MarketCategory;
  yesPrice: number;
  noPrice: number;
  volume: number;
  liquidity: number;
  endDate: string;
}
