import { NextResponse } from "next/server";

import { getSignals } from "@/lib/signals/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 20) || 20));
  const offset = Math.max(0, Number(searchParams.get("offset") ?? 0) || 0);
  const severity = searchParams.get("severity");
  const minScore = Number(searchParams.get("minScore") ?? 0) || 0;
  const all = await getSignals();
  const filtered = all.filter((signal) => (!severity || signal.severity === severity) && signal.score >= minScore);
  return NextResponse.json({ signals: filtered.slice(offset, offset + limit), pagination: { limit, offset } });
}