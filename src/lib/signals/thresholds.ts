export const SIGNAL_THRESHOLDS = {
  probabilityMove: 5,
  strongProbabilityMove: 10,
  volumeSpike: 3,
  strongVolumeSpike: 5,
  liquidityChange: 0.2,
  strongSignalScore: 75,
  mediumSignalScore: 50,
} as const;

export const SNAPSHOT_INTERVAL_MS = 5 * 60 * 1000;
export const SIGNAL_COOLDOWN_MS = 30 * 60 * 1000;