import { SignalCard } from "@/components/signals/SignalCard";
import { getActiveMarkets } from "@/lib/data/markets";
import { getSignals } from "@/lib/signals/store";

export default async function SignalsPage() {
  const [signals, markets] = await Promise.all([getSignals(), getActiveMarkets({ limit: 100 })]);
  const marketMap = new Map(markets.map((market) => [market.id, market]));

  return <main className="min-h-screen bg-[#080B12] px-4 py-8 text-slate-100 sm:px-6 lg:px-10"><div className="mx-auto max-w-7xl"><header className="border-b border-[#1B2230] pb-8"><p className="text-xs font-bold tracking-[0.28em] text-violet-300">ALPHA / ACTIVITY</p><h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Signals</h1><p className="mt-2 text-sm text-slate-500">Unusual activity detected across prediction markets.</p></header><section className="mt-8 rounded-xl border border-[#1B2230] bg-[#0D111A] p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">How signals work</p><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">AlphaScope detects unusual market activity using probability movement, trading-volume anomalies, liquidity changes, and short-term momentum. Scores are rule-based indicators of unusual activity, not predictions or recommendations.</p></section>{signals.length ? <section className="mt-8 grid gap-4 lg:grid-cols-2">{signals.map((signal) => <SignalCard key={signal.id} signal={signal} market={marketMap.get(signal.marketId)} />)}</section> : <div className="mt-8 rounded-xl border border-dashed border-[#1B2230] px-6 py-20 text-center"><p className="font-semibold text-white">No unusual activity detected recently.</p><p className="mt-2 text-sm text-slate-500">Signals appear after real snapshots provide enough history for comparison.</p></div>}</div></main>;
}
