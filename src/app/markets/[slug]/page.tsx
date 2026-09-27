import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ExternalMarketLink } from "@/components/markets/ExternalMarketLink";
import { MarketHeader } from "@/components/markets/MarketHeader";
import { MarketInformation } from "@/components/markets/MarketInformation";
import { MarketStats } from "@/components/markets/MarketStats";
import { OutcomeList } from "@/components/markets/OutcomeList";
import { ProbabilityBar } from "@/components/markets/ProbabilityBar";
import { ProbabilityChart } from "@/components/markets/ProbabilityChart";
import { getMarketBySlug } from "@/lib/data/market";

interface MarketPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MarketPageProps): Promise<Metadata> {
  const market = await getMarketBySlug((await params).slug);
  return market ? { title: `${market.question} | AlphaScope`, description: "Prediction market probability, volume, liquidity and market data." } : { title: "Market not found | AlphaScope" };
}

export default async function MarketDetailPage({ params }: MarketPageProps) {
  const market = await getMarketBySlug((await params).slug);
  if (!market) notFound();

  return <main className="min-h-screen bg-[#080B12] px-4 py-6 text-slate-100 sm:px-6 lg:px-10"><div className="mx-auto max-w-7xl"><MarketHeader market={market} /><div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]"><section className="rounded-xl border border-[#1B2230] bg-[#0D111A] p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Current probability</p><div className="mt-7"><ProbabilityBar label={market.outcomes[0] ?? "YES"} probability={market.outcomePrices[0] ?? 0} /></div><div className="mt-6"><OutcomeList market={market} /></div></section><div className="space-y-5"><div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Market status</p><p className="mt-4 text-3xl font-bold text-white">{market.active ? "Active" : market.closed ? "Closed" : "Unavailable"}</p><p className="mt-2 text-sm text-slate-500">{market.outcomes.length} outcome{market.outcomes.length === 1 ? "" : "s"} · live market data</p></div><div className="rounded-xl border border-[#1B2230] bg-[#0D111A] p-5 sm:p-6"><OutcomeList market={market} /></div></div></div><div className="mt-5"><ProbabilityChart /></div><div className="mt-5"><MarketStats market={market} /></div><div className="mt-10"><MarketInformation market={market} /></div><div className="mt-8 border-t border-[#1B2230] pt-5"><ExternalMarketLink url={market.url} /></div></div></main>;
}