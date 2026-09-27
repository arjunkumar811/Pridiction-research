export function MarketSkeleton() {
  return <div className="space-y-3" aria-label="Loading markets">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-16 animate-pulse rounded-xl border border-[#1B2230] bg-[#0D111A]" />)}</div>;
}