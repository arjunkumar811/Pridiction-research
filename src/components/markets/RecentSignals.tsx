import Link from "next/link";

import type { StoredSignal } from "@/lib/signals/types";

export function RecentSignals({ signals }: { signals: StoredSignal[] }) {
  return <section><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Recent signals</p><Link href="/signals" className="text-xs font-semibold text-violet-300 hover:text-violet-200">All signals →</Link></div>{signals.length ? <div className="mt-4 divide-y divide-[#1B2230] rounded-xl border border-[#1B2230] bg-[#0D111A]">{signals.map((signal) => <div key={signal.id} className="flex items-center justify-between gap-4 px-4 py-4"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-300">{signal.severity} · {signal.score}/100</p><p className="mt-1 text-xs text-slate-500">{signal.explanation}</p></div><time className="shrink-0 text-xs text-slate-600">{new Date(signal.detectedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time></div>)}</div> : <div className="mt-4 rounded-xl border border-dashed border-[#1B2230] px-5 py-8 text-sm text-slate-500">No unusual activity detected recently.</div>}</section>;
}