"use client";

export function MarketPagination({ page, hasNext, onChange }: { page: number; hasNext: boolean; onChange: (page: number) => void }) {
  return (
    <nav aria-label="Market pages" className="flex items-center justify-between border-t border-[#1B2230] pt-5 text-xs">
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)} className="rounded-lg px-3 py-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30">← Previous</button>
      <span className="font-semibold text-slate-300">Page {page}</span>
      <button type="button" disabled={!hasNext} onClick={() => onChange(page + 1)} className="rounded-lg px-3 py-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30">Next →</button>
    </nav>
  );
}