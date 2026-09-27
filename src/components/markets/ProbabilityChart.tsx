export interface ProbabilityPoint {
  timestamp: string;
  probability: number;
}

export function ProbabilityChart({ points = [] }: { points?: ProbabilityPoint[] }) {
  return <section className="rounded-xl border border-[#1B2230] bg-[#0D111A] p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Probability history</p><p className="mt-2 text-sm text-slate-300">{points.length ? "Historical snapshots" : "Historical probability data will appear here once market snapshots are collected."}</p></div><span className="rounded-md border border-[#1B2230] px-2 py-1 text-[10px] uppercase tracking-wider text-slate-600">No snapshots</span></div>{points.length ? <div className="mt-6" /> : <div className="mt-8 flex h-32 items-center justify-center rounded-lg border border-dashed border-[#1B2230] text-xs text-slate-600">Chart awaits snapshot data</div>}</section>;
}