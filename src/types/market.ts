export type MarketCategory =
  | "crypto"
  | "politics"
  | "technology"
  | "sports"
  | "economy"
  | "other";

export interface PolymarketMarket {
  id: string;
  question: string;
  conditionId?: string;
  slug?: string;
  startDate?: string;
  endDate?: string;
  outcomes: string[];
  outcomePrices: number[];
  volume?: number;
  liquidity?: number;
  volume24hr?: number;
  volume1wk?: number;
  volume1mo?: number;
  active?: boolean;
  closed?: boolean;
  image?: string;
  icon?: string;
  url?: string;
  clobTokenIds?: string[];
  bestBid?: number;
  bestAsk?: number;
  lastTradePrice?: number;
  spread?: number;
  tags?: Array<string | { label?: string; name?: string }>;
  category?: string;
}

export interface Market {
  id: string;
  title: string;
  question: string;
  category: MarketCategory;
  slug?: string;
  yesPrice: number;
  noPrice: number;
  outcomes: string[];
  outcomePrices: number[];
  volume: number;
  liquidity: number;
  volume24hr: number;
  volume1wk: number;
  volume1mo: number;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  closed?: boolean;
  image?: string;
  icon?: string;
  url?: string;
  conditionId?: string;
  clobTokenIds: string[];
  bestBid?: number;
  bestAsk?: number;
  lastTradePrice?: number;
  spread?: number;
}