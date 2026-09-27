export function KpiCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-xl border border-[#1B2230] bg-[#0D111A] p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold text-white">{value}</p><p className="mt-2 text-xs text-slate-600">{detail}</p></div>;
}