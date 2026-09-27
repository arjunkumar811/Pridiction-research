export type SignalType =
  | "probability_move"
  | "volume_spike"
  | "liquidity_change"
  | "momentum"
  | "unusual_activity";

export type SignalSeverity = "low" | "medium" | "high";

export interface MarketSignal {
  marketId: string;
  signalType: SignalType;
  score: number;
  probabilityChange?: number;
  volumeChange?: number;
  liquidityChange?: number;
  detectedAt: Date;
  explanation: string;
}

export interface MarketSnapshotRecord {
  id: string;
  marketId: string;
  yesPrice?: number;
  noPrice?: number;
  volume?: number;
  liquidity?: number;
  timestamp: string;
}

export interface StoredSignal extends MarketSignal {
  id: string;
  severity: SignalSeverity;
}