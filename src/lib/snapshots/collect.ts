import { getActiveMarkets } from "@/lib/data/markets";
import { addSnapshots, getSnapshots } from "@/lib/signals/store";
import { SNAPSHOT_INTERVAL_MS } from "@/lib/signals/thresholds";
import type { MarketSnapshotRecord } from "@/lib/signals/types";

export async function collectMarketSnapshots(): Promise<{ marketsProcessed: number; snapshotsCreated: number }> {
  const markets = await getActiveMarkets({ limit: 100 });
  const now = Date.now();
  const snapshots: MarketSnapshotRecord[] = [];

  for (const market of markets) {
    const existing = await getSnapshots(market.id);
    const latest = existing.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    if (latest && now - new Date(latest.timestamp).getTime() < SNAPSHOT_INTERVAL_MS) continue;
    snapshots.push({
      id: `${market.id}:${now}`,
      marketId: market.id,
      yesPrice: market.yesPrice,
      noPrice: market.noPrice,
      volume: market.volume,
      liquidity: market.liquidity,
      timestamp: new Date(now).toISOString(),
    });
  }

  return { marketsProcessed: markets.length, snapshotsCreated: await addSnapshots(snapshots) };
}