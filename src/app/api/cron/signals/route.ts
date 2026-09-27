import { NextResponse } from "next/server";

import { collectMarketSnapshots } from "@/lib/snapshots/collect";
import { generateSignals } from "@/lib/signals/generate";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  return process.env.NODE_ENV === "development" || Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`);
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await collectMarketSnapshots();
    return NextResponse.json({ success: true, ...(await generateSignals()) });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to generate signals" }, { status: 502 });
  }
}