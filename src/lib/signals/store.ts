import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { MarketSnapshotRecord, StoredSignal } from "@/lib/signals/types";

interface SignalStoreData {
  snapshots: MarketSnapshotRecord[];
  signals: StoredSignal[];
}

const storePath = path.join(process.cwd(), "data", "signal-store.json");

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
  const data = await readStore();
  return data.snapshots.filter((snapshot) => !marketId || snapshot.marketId === marketId);
}

export async function addSnapshots(snapshots: MarketSnapshotRecord[]): Promise<number> {
  const data = await readStore();
  const existing = new Set(data.snapshots.map((snapshot) => `${snapshot.marketId}:${snapshot.timestamp}`));
  const fresh = snapshots.filter((snapshot) => !existing.has(`${snapshot.marketId}:${snapshot.timestamp}`));
  data.snapshots.push(...fresh);
  await writeStore(data);
  return fresh.length;
}

export async function getSignals(): Promise<StoredSignal[]> {
  const data = await readStore();
  return data.signals.sort((a, b) => b.score - a.score || new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime());
}

export async function addSignal(signal: StoredSignal): Promise<void> {
  const data = await readStore();
  data.signals.push(signal);
  await writeStore(data);
}