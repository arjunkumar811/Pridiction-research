import type {
  Market,
  MarketCategory,
  PolymarketMarket,
} from "@/types/market";

const DEFAULT_API_URL = "https://gamma-api.polymarket.com";
const API_URL = process.env.POLYMARKET_GAMMA_API_URL ?? DEFAULT_API_URL;

export interface GetMarketsOptions {
  limit?: number;
  offset?: number;
}

type RawMarket = Record<string, unknown>;

function parseArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }

  return [];
}

function parseNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function parseString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function mapCategory(raw: Pick<PolymarketMarket, "category" | "tags">): MarketCategory {
  const source = [
    raw.category,
    ...parseArray<unknown>(raw.tags).map((tag) =>
      typeof tag === "string"
        ? tag
        : typeof tag === "object" && tag !== null
          ? (tag as { label?: string; name?: string }).label ??
            (tag as { name?: string }).name
          : undefined,
    ),
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();

  if (/crypto|bitcoin|ethereum|solana|defi|token/.test(source)) return "crypto";
  if (/politic|election|president|congress|government/.test(source)) return "politics";
  if (/technology|tech|ai|science|software/.test(source)) return "technology";
  if (/sport|nfl|nba|soccer|football|tennis/.test(source)) return "sports";
  if (/econom|finance|market|fed|business/.test(source)) return "economy";
  return "other";
}

function toRawMarket(value: RawMarket): PolymarketMarket | null {
  const id = parseString(value.id);
  const question = parseString(value.question);
  if (!id || !question) return null;

  const outcomes = parseArray<unknown>(value.outcomes).filter(
    (outcome): outcome is string => typeof outcome === "string",
  );
  const outcomePrices = parseArray<unknown>(value.outcomePrices)
    .map(parseNumber)
    .filter((price): price is number => price !== undefined);

  return {
    id,
    question,
    conditionId: parseString(value.conditionId),
    slug: parseString(value.slug),
    startDate: parseString(value.startDate),
    endDate: parseString(value.endDate),
    outcomes,
    outcomePrices,
    volume: parseNumber(value.volumeNum ?? value.volume),
    liquidity: parseNumber(value.liquidityNum ?? value.liquidity),
    volume24hr: parseNumber(value.volume24hr),
    volume1wk: parseNumber(value.volume1wk),
    volume1mo: parseNumber(value.volume1mo),
    active: value.active === true,
    closed: value.closed === true,
    image: parseString(value.image),
    icon: parseString(value.icon),
    clobTokenIds: parseArray<unknown>(value.clobTokenIds).filter(
      (token): token is string => typeof token === "string",
    ),
    bestBid: parseNumber(value.bestBid),
    bestAsk: parseNumber(value.bestAsk),
    lastTradePrice: parseNumber(value.lastTradePrice),
    spread: parseNumber(value.spread),
    tags: parseArray<string | { label?: string; name?: string }>(value.tags),
    category: parseString(value.category),
  };
}

export function normalizeMarket(market: PolymarketMarket): Market {
  return {
    id: market.id,
    title: market.question,
    question: market.question,
    category: mapCategory(market),
    slug: market.slug,
    yesPrice: market.outcomePrices[0] ?? 0,
    noPrice: market.outcomePrices[1] ?? 0,
    outcomes: market.outcomes,
    outcomePrices: market.outcomePrices,
    volume: market.volume ?? 0,
    liquidity: market.liquidity ?? 0,
    volume24hr: market.volume24hr ?? 0,
    volume1wk: market.volume1wk ?? 0,
    volume1mo: market.volume1mo ?? 0,
    endDate: market.endDate,
    image: market.image,
    icon: market.icon,
    conditionId: market.conditionId,
    clobTokenIds: market.clobTokenIds ?? [],
    bestBid: market.bestBid,
    bestAsk: market.bestAsk,
    lastTradePrice: market.lastTradePrice,
    spread: market.spread,
  };
}

export async function getMarkets(
  options: GetMarketsOptions = {},
): Promise<Market[]> {
  const limit = options.limit ?? 100;
  const offset = options.offset ?? 0;
  const params = new URLSearchParams({
    active: "true",
    closed: "false",
    order: "volumeNum",
    ascending: "false",
    limit: String(limit),
    offset: String(offset),
  });

  const response = await fetch(`${API_URL}/markets?${params}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Polymarket request failed with status ${response.status}`);
  }

  const payload: unknown = await response.json();
  const rawMarkets = Array.isArray(payload)
    ? payload
    : typeof payload === "object" && payload !== null && "data" in payload
      ? (payload as { data?: unknown }).data
      : [];

  if (!Array.isArray(rawMarkets)) return [];

  return rawMarkets
    .filter((market): market is RawMarket => typeof market === "object" && market !== null)
    .map(toRawMarket)
    .filter((market): market is PolymarketMarket => market !== null)
    .map(normalizeMarket);
}