import { calculateFeatures, calculateSignalScore, createSignalExplanation, getSignalSeverity } from "@/lib/signals/calculate";
import { addSignal, getSignals, getSnapshots } from "@/lib/signals/store";
import { SIGNAL_COOLDOWN_MS } from "@/lib/signals/thresholds";
import type { StoredSignal } from "@/lib/signals/types";

export async function generateSignals(): Promise<{ marketsAnalyzed: number; signalsGenerated: number }> {
  const allSnapshots = await getSnapshots();
  const marketIds = [...new Set(allSnapshots.map((snapshot) => snapshot.marketId))];
  const existingSignals = await getSignals();
  let signalsGenerated = 0;

  for (const marketId of marketIds) {
    const snapshots = allSnapshots.filter((snapshot) => snapshot.marketId === marketId);
    if (snapshots.length < 2) continue;
    const features = calculateFeatures(snapshots);
    const score = calculateSignalScore(features);
    if (score < 50) continue;
    const detectedAt = new Date();
    const duplicate = existingSignals.some((signal) => signal.marketId === marketId && detectedAt.getTime() - new Date(signal.detectedAt).getTime() < SIGNAL_COOLDOWN_MS);
    if (duplicate) continue;

    const signal: StoredSignal = {
      id: `${marketId}:${detectedAt.toISOString()}`,
      marketId,
      signalType: "unusual_activity",
      score,
      severity: getSignalSeverity(score),
      probabilityChange: features.probabilityChange ?? undefined,
      volumeChange: features.volumeRatio ?? undefined,
      liquidityChange: features.liquidityChange ?? undefined,
      detectedAt,
      explanation: createSignalExplanation(features),
    };
    await addSignal(signal);
    existingSignals.push(signal);
    signalsGenerated += 1;
  }

  return { marketsAnalyzed: marketIds.length, signalsGenerated };
}