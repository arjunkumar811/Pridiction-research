import { SIGNAL_THRESHOLDS } from "@/lib/signals/thresholds";
import { calculateLiquidityChange, calculateMomentum, calculateProbabilityChange, calculateVolumeRatio } from "@/lib/signals/features";
import type { MarketSnapshotRecord } from "@/lib/signals/types";

export interface SignalFeatures {
  probabilityChange: number | null;
  volumeRatio: number | null;
  liquidityChange: number | null;
  momentum1h: number | null;
  momentum6h: number | null;
  momentum24h: number | null;
}

export function calculateFeatures(snapshots: MarketSnapshotRecord[]): SignalFeatures {
  const ordered = [...snapshots].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const current = ordered[0];
  const previous = ordered[1];
  return {
    probabilityChange: calculateProbabilityChange(current?.yesPrice, previous?.yesPrice),
    volumeRatio: calculateVolumeRatio(current?.volume, ordered.slice(1).map((snapshot) => snapshot.volume)),
    liquidityChange: calculateLiquidityChange(current?.liquidity, previous?.liquidity),
    momentum1h: calculateMomentum(ordered, 1),
    momentum6h: calculateMomentum(ordered, 6),
    momentum24h: calculateMomentum(ordered, 24),
  };
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function calculateSignalScore(features: SignalFeatures): number {
  const probability = features.probabilityChange === null ? 0 : Math.min(1, Math.abs(features.probabilityChange) / SIGNAL_THRESHOLDS.strongProbabilityMove) * 40;
  const volume = features.volumeRatio === null ? 0 : Math.min(1, Math.max(0, features.volumeRatio - 1) / (SIGNAL_THRESHOLDS.strongVolumeSpike - 1)) * 35;
  const liquidity = features.liquidityChange === null ? 0 : Math.min(1, Math.abs(features.liquidityChange) / SIGNAL_THRESHOLDS.liquidityChange) * 15;
  const momentum = features.momentum24h === null ? 0 : Math.min(1, Math.abs(features.momentum24h) / SIGNAL_THRESHOLDS.strongProbabilityMove) * 10;
  return Math.round(clamp(probability + volume + liquidity + momentum));
}

export function getSignalSeverity(score: number): "low" | "medium" | "high" {
  if (score >= SIGNAL_THRESHOLDS.strongSignalScore) return "high";
  if (score >= SIGNAL_THRESHOLDS.mediumSignalScore) return "medium";
  return "low";
}

export function createSignalExplanation(features: SignalFeatures): string {
  const parts: string[] = [];
  if (features.probabilityChange !== null && Math.abs(features.probabilityChange) >= SIGNAL_THRESHOLDS.probabilityMove) parts.push(`probability ${features.probabilityChange >= 0 ? "increased" : "decreased"} by ${Math.abs(features.probabilityChange).toFixed(1)} percentage points`);
  if (features.volumeRatio !== null && features.volumeRatio >= SIGNAL_THRESHOLDS.volumeSpike) parts.push(`volume reached ${features.volumeRatio.toFixed(1)}x its historical average`);
  if (features.liquidityChange !== null && Math.abs(features.liquidityChange) >= SIGNAL_THRESHOLDS.liquidityChange) parts.push(`liquidity changed by ${(Math.abs(features.liquidityChange) * 100).toFixed(1)}%`);
  if (features.momentum6h !== null && Math.abs(features.momentum6h) >= SIGNAL_THRESHOLDS.probabilityMove) parts.push(`probability moved ${Math.abs(features.momentum6h).toFixed(1)} points over 6 hours`);
  return parts.length ? `${parts[0].charAt(0).toUpperCase()}${parts[0].slice(1)}${parts.length > 1 ? ` while ${parts.slice(1).join(" and ")}` : ""}.` : "No unusual activity threshold has been met.";
}