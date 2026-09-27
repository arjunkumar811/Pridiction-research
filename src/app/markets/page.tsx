import { getActiveMarkets } from "@/lib/data/markets";
import { MarketExplorer } from "@/components/markets/MarketExplorer";

export default async function MarketsPage() {
  const markets = await getActiveMarkets({ limit: 100 });

  return (
    <main className="min-h-screen bg-[#080B12] px-4 py-6 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 border-b border-[#1B2230] pb-6">
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.28em] text-violet-300"><span className="h-2 w-2 rounded-full bg-violet-400" />ALPHA</div>
          <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Market terminal</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Markets</h1><p className="mt-2 text-sm text-slate-500">Explore and search all available prediction markets.</p></div><div className="text-xs text-slate-600">POLYMARKET / LIVE</div></div>
        </header>
        <MarketExplorer initialMarkets={markets} />
      </div>
    </main>
  );
}
