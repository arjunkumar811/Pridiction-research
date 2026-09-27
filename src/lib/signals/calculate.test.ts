import { describe, expect, it } from "vitest";

import {
  calculateFeatures,
  calculateSignalScore,
  getSignalSeverity,
} from "@/lib/signals/calculate";
import {
  calculateLiquidityChange,
  calculateMomentum,
  calculateProbabilityChange,
  calculateVolumeRatio,
} from "@/lib/signals/features";
import type { MarketSnapshotRecord } from "@/lib/signals/types";

const snapshot = (timestamp: string, yesPrice: number, volume: number, liquidity: number): MarketSnapshotRecord => ({
  id: timestamp,
  marketId: "market-1",
  yesPrice,
  volume,
  liquidity,
  timestamp,
});

describe("signal features", () => {
  it("calculates probability movement in percentage points", () => {
    expect(calculateProbabilityChange(0.6, 0.45)).toBeCloseTo(15);
    expect(calculateProbabilityChange(0.4, 0.6)).toBeCloseTo(-20);
    expect(calculateProbabilityChange(undefined, 0.6)).toBeNull();
  });

  it("calculates volume ratios and handles missing baselines", () => {
    expect(calculateVolumeRatio(1_800, [300, 300, 300])).toBeCloseTo(6);
    expect(calculateVolumeRatio(100, [0, undefined])).toBeNull();
  });

  it("calculates liquidity changes without dividing by zero", () => {
    expect(calculateLiquidityChange(650, 500)).toBeCloseTo(0.3);
    expect(calculateLiquidityChange(100, 0)).toBeNull();
  });

  it("calculates momentum only when a historical window exists", () => {
    const now = Date.parse("2026-09-27T12:00:00Z");
    const snapshots = [
      snapshot("2026-09-27T12:00:00Z", 0.68, 1_800, 650),
      snapshot("2026-09-27T11:00:00Z", 0.64, 1_000, 600),
    ];
    expect(calculateMomentum(snapshots, 1, now)).toBeCloseTo(4);
    expect(calculateMomentum(snapshots, 24, now)).toBeNull();
  });
});

describe("signal scoring", () => {
  it("scores measurable movement and assigns severity", () => {
    const features = calculateFeatures([
      snapshot("2026-09-27T12:00:00Z", 0.63, 1_800, 650),
      snapshot("2026-09-27T11:00:00Z", 0.45, 300, 500),
    ]);
    const score = calculateSignalScore(features);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
    expect(getSignalSeverity(score)).toMatch(/low|medium|high/);
  });

  it("returns the minimum score when all features are unavailable", () => {
    expect(calculateSignalScore({ probabilityChange: null, volumeRatio: null, liquidityChange: null, momentum1h: null, momentum6h: null, momentum24h: null })).toBe(0);
    expect(getSignalSeverity(0)).toBe("low");
    expect(getSignalSeverity(75)).toBe("high");
  });
});