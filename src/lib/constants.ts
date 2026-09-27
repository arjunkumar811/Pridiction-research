export const APP_NAME = "AlphaScope";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Markets", href: "/markets" },
  { label: "Signals", href: "/signals" },
  { label: "Watchlist", href: "/watchlist" },
] as const;

export const THEME_TONES = {
  background: "#050816",
  panel: "#111827",
  accent: "#8b5cf6",
  positive: "#22c55e",
  negative: "#ef4444",
} as const;
