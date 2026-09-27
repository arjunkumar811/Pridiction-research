import { formatPercent } from "@/lib/format";

export function ProbabilityBar({ label, probability }: { label: string; probability: number }) {
  return <div><div className="flex items-center justify-between text-xs"><span className="font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</span><span className="font-bold text-white">{formatPercent(probability)}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.max(0, Math.min(100, probability * 100))}%` }} /></div></div>;
}