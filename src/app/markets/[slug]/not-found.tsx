import Link from "next/link";

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center bg-[#080B12] px-6 text-center text-slate-100"><div><p className="text-2xl font-bold text-white">Market not found</p><p className="mt-2 text-sm text-slate-500">This market may have been removed or the URL is invalid.</p><Link href="/markets" className="mt-6 inline-flex rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500">Back to Markets</Link></div></main>;
}