import Link from "next/link";

import { formatDate } from "@/lib/format";
import type { Market } from "@/types/market";

export function MarketHeader({ market }: { market: Market }) {
  return (
    <header>
      <Link href="/markets" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white">← Markets</Link>
      <div className="mt-10 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#1B2230] bg-[#0D111A] text-violet-300">
          {market.image || market.icon ? <img src={market.image ?? market.icon} alt="" className="h-full w-full object-cover" /> : "◈"}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">{market.category}</p>
          <h1 className="mt-3 max-w-4xl text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">{market.question}</h1>
          <p className="mt-4 text-sm text-slate-500">Ends {formatDate(market.endDate)}</p>
        </div>
      </div>
    </header>
  );
}