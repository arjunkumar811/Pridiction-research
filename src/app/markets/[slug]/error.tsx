"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#080B12] px-6 text-center text-slate-100"><div><p className="text-2xl font-bold text-white">Unable to load this market</p><p className="mt-2 text-sm text-slate-500">Please try again.</p><button type="button" onClick={reset} className="mt-6 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500">Try again</button></div></main>;
}