import { getActiveMarkets } from "@/lib/data/markets";
import { getSignals, getSnapshots } from "@/lib/signals/store";
import type { StoredSignal } from "@/lib/signals/types";
import type { Market } from "@/types/market";

export interface MarketMover {
  market: Market;
  change: number;
}

export interface ActivityPoint {
  label: string;
  count: number;
}

export interface DashboardData {
  markets: Market[];
  signals: StoredSignal[];
  activeSignals: StoredSignal[];
  highSignals: StoredSignal[];
  movers: MarketMover[];
  activity: ActivityPoint[];
  totalVolume: number | null;
}

export async function getDashboardData(): Promise<DashboardData> {
  const [markets, signals, snapshots] = await Promise.all([
    getActiveMarkets({ limit: 100 }),
    getSignals(),
    getSnapshots(),
  ]);
  const now = Date.now();
  const lastDay = signals.filter((signal) => now - new Date(signal.detectedAt).getTime() <= 86_400_000);
  const marketMap = new Map(markets.map((market) => [market.id, market]));
  const movers = [...marketMap.entries()]
    .map(([marketId, market]) => {
      const history = snapshots.filter((snapshot) => snapshot.marketId === marketId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      const change = history[1]?.yesPrice === undefined ? null : ((history[0]?.yesPrice ?? market.yesPrice) - history[1].yesPrice) * 100;
      return change === null ? null : { market, change };
    })
    .filter((mover): mover is MarketMover => mover !== null)
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 5);
  const activity = Array.from({ length: 24 }, (_, index) => {
    const hour = new Date(now - (23 - index) * 3_600_000);
    const start = hour.getTime();
    const end = start + 3_600_000;
    return { label: hour.toLocaleTimeString([], { hour: "numeric" }), count: lastDay.filter((signal) => { const time = new Date(signal.detectedAt).getTime(); return time >= start && time < end; }).length };
  });

  return { markets, signals, activeSignals: lastDay, highSignals: lastDay.filter((signal) => signal.severity === "high"), movers, activity, totalVolume: null };
}