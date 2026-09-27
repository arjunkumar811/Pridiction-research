import Link from "next/link";

import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { DataFreshness } from "@/components/dashboard/DataFreshness";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { MarketMovers } from "@/components/dashboard/MarketMovers";
import { RecentSignals } from "@/components/dashboard/RecentSignals";
import { TopSignals } from "@/components/dashboard/TopSignals";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { getDashboardData } from "@/lib/dashboard/data";

export const metadata = { title: "Dashboard | AlphaScope" };

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <div className="min-h-screen bg-[#080B12] text-slate-100 lg:flex"><Sidebar /><div className="min-w-0 flex-1"><Header /><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Market intelligence</p><h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Market Intelligence</h1><p className="mt-2 text-sm text-slate-500">Real-time prediction-market activity and unusual market signals.</p></div><DataFreshness /></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><KpiCard label="Markets loaded" value={String(data.markets.length)} detail="Active market page" /><KpiCard label="Active signals" value={String(data.activeSignals.length)} detail="Detected in 24 hours" /><KpiCard label="Total volume" value={data.totalVolume === null ? "—" : `$${data.totalVolume.toLocaleString()}`} detail="Aggregate unavailable" /><KpiCard label="High signals" value={String(data.highSignals.length)} detail="Detected in 24 hours" /></div><div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]"><ActivityChart activity={data.activity} /><TopSignals signals={data.signals} markets={data.markets} /></div><div className="mt-5 grid gap-5 lg:grid-cols-2"><MarketMovers movers={data.movers} /><RecentSignals signals={data.activeSignals} markets={data.markets} /></div><section className="mt-5 flex flex-col justify-between gap-4 rounded-xl border border-[#1B2230] bg-[#0D111A] p-5 sm:flex-row sm:items-center"><div><h2 className="font-semibold text-white">Quick access</h2><p className="mt-1 text-sm text-slate-500">Explore the live market surface or review detected anomalies.</p></div><div className="flex gap-3"><Link href="/markets" className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500">Explore markets</Link><Link href="/signals" className="rounded-lg border border-[#1B2230] px-4 py-2 text-xs font-semibold text-slate-300 hover:border-violet-500/50 hover:text-white">View signals</Link></div></section></main></div></div>;
}
