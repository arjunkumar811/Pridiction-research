import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { MarketSnapshotRecord, StoredSignal } from "@/lib/signals/types";
import { prisma } from "@/lib/prisma";
import type { Market } from "@/types/market";

interface SignalStoreData {
  snapshots: MarketSnapshotRecord[];
  signals: StoredSignal[];
}

const storePath = path.join(process.cwd(), "data", "signal-store.json");
const useDatabase = Boolean(process.env.DATABASE_URL);

async function readStore(): Promise<SignalStoreData> {
  try {
    return JSON.parse(await readFile(storePath, "utf8")) as SignalStoreData;
  } catch {
    return { snapshots: [], signals: [] };
  }
}

async function writeStore(data: SignalStoreData): Promise<void> {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify(data, null, 2), "utf8");
}

export async function getSnapshots(marketId?: string): Promise<MarketSnapshotRecord[]> {
  if (useDatabase && prisma) {
    try {
      const snapshots = await prisma.marketSnapshot.findMany({ where: marketId ? { marketId } : undefined, orderBy: { timestamp: "desc" } });
      return snapshots.map((snapshot) => ({ id: snapshot.id, marketId: snapshot.marketId, yesPrice: snapshot.yesPrice ?? undefined, noPrice: snapshot.noPrice ?? undefined, volume: snapshot.volume ?? undefined, liquidity: snapshot.liquidity ?? undefined, timestamp: snapshot.timestamp.toISOString() }));
    } catch {
      // Fall through to the local development store when PostgreSQL is unavailable.
    }
  }
  const data = await readStore();
  return data.snapshots.filter((snapshot) => !marketId || snapshot.marketId === marketId);
}

export async function addSnapshots(snapshots: MarketSnapshotRecord[]): Promise<number> {
  if (useDatabase && prisma) {
    try {
      if (!snapshots.length) return 0;
      const result = await prisma.marketSnapshot.createMany({ data: snapshots.map((snapshot) => ({ id: snapshot.id, marketId: snapshot.marketId, yesPrice: snapshot.yesPrice, noPrice: snapshot.noPrice, volume: snapshot.volume, liquidity: snapshot.liquidity, timestamp: new Date(snapshot.timestamp) })), skipDuplicates: true });
      return result.count;
    } catch {
      // Fall through to the local development store when PostgreSQL is unavailable.
    }
  }
  const data = await readStore();
  const existing = new Set(data.snapshots.map((snapshot) => `${snapshot.marketId}:${snapshot.timestamp}`));
  const fresh = snapshots.filter((snapshot) => !existing.has(`${snapshot.marketId}:${snapshot.timestamp}`));
  data.snapshots.push(...fresh);
  await writeStore(data);
  return fresh.length;
}

export async function getSignals(): Promise<StoredSignal[]> {
  if (useDatabase && prisma) {
    try {
      const signals = await prisma.signal.findMany({ orderBy: [{ score: "desc" }, { detectedAt: "desc" }] });
      return signals.map((signal) => ({ id: signal.id, marketId: signal.marketId, signalType: signal.type as StoredSignal["signalType"], score: signal.score, severity: signal.severity as StoredSignal["severity"], probabilityChange: signal.probabilityChange ?? undefined, volumeChange: signal.volumeChange ?? undefined, liquidityChange: signal.liquidityChange ?? undefined, detectedAt: signal.detectedAt, explanation: signal.explanation }));
    } catch {
      // Fall through to the local development store when PostgreSQL is unavailable.
    }
  }
  const data = await readStore();
  return data.signals.sort((a, b) => b.score - a.score || new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
}

export async function addSignal(signal: StoredSignal): Promise<void> {
  if (useDatabase && prisma) {
    try {
      await prisma.signal.create({ data: { id: signal.id, marketId: signal.marketId, type: signal.signalType, severity: signal.severity, score: signal.score, probabilityChange: signal.probabilityChange, volumeChange: signal.volumeChange, liquidityChange: signal.liquidityChange, detectedAt: signal.detectedAt, explanation: signal.explanation } });
      return;
    } catch {
      // Fall through to the local development store when PostgreSQL is unavailable.
    }
  }
  const data = await readStore();
  data.signals.push(signal);
  await writeStore(data);
}

export async function upsertMarkets(markets: Market[]): Promise<void> {
  const database = prisma;
  if (!useDatabase || !database || !markets.length) return;
  try {
    await database.$transaction(markets.map((market) => database.market.upsert({ where: { id: market.id }, create: { id: market.id, slug: market.slug, question: market.question, category: market.category, endDate: market.endDate ? new Date(market.endDate) : undefined }, update: { slug: market.slug, question: market.question, category: market.category, endDate: market.endDate ? new Date(market.endDate) : undefined } })));
  } catch {
    // The snapshot path remains usable until a production database is configured.
  }
}