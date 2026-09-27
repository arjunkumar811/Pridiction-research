import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-950/70 p-10 shadow-lg ring-1 ring-white/5">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Prediction Market Intelligence
        </h1>

        <p className="mt-6 text-xl text-slate-300">Dashboard coming soon.</p>

        <div className="mt-8">
          <Link
            href="/markets"
            className="inline-flex items-center justify-center rounded-full border border-violet-400/50 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20"
          >
            View Markets
          </Link>
        </div>
      </div>
    </main>
  );
}
