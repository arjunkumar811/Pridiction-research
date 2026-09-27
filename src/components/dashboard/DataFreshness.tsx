export function DataFreshness({ updatedAt }: { updatedAt?: string }) {
  return <p className="text-xs text-slate-600">{updatedAt ? `Updated ${updatedAt}` : "Live market data"}</p>;
}