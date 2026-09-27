export function ExternalMarketLink({ url }: { url?: string }) {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  return <a href={url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-violet-300 transition hover:text-violet-200">View on Polymarket ↗</a>;
}