import { MarketSkeleton } from "@/components/markets/MarketSkeleton";

export default function Loading() {
  return <main className="min-h-screen bg-[#080B12] px-4 py-10 sm:px-6 lg:px-10"><div className="mx-auto max-w-7xl"><div className="mb-8 h-28 animate-pulse rounded-xl bg-[#0D111A]" /><MarketSkeleton /></div></main>;
}