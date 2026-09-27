import type { MarketSnapshotRecord } from "@/lib/signals/types";

export function calculateProbabilityChange(current?: number, previous?: number): number | null {
  if (current === undefined || previous === undefined) return null;
  return (current - previous) * 100;
}

export function calculateVolumeRatio(current?: number, historical: Array<number | undefined> = []): number | null {
  if (current === undefined) return null;
  const values = historical.filter((value): value is number => value !== undefined && value > 0);
  if (!values.length) return null;
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return average > 0 ? current / average : null;
}

export function calculateLiquidityChange(current?: number, previous?: number): number | null {
  if (current === undefined || previous === undefined || previous === 0) return null;
  return (current - previous) / previous;
}

export function calculateMomentum(
  snapshots: MarketSnapshotRecord[],
  hours: number,
  now = Date.now(),
): number | null {
  const current = snapshots[0];
  if (current?.yesPrice === undefined) return null;
  const cutoff = now - hours * 60 * 60 * 1000;
  const historical = snapshots.find((snapshot) => new Date(snapshot.timestamp).getTime() <= cutoff);
  return historical?.yesPrice === undefined ? null : calculateProbabilityChange(current.yesPrice, historical.yesPrice);
}