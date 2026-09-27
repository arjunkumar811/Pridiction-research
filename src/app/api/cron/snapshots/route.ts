import { NextResponse } from "next/server";

import { collectMarketSnapshots } from "@/lib/snapshots/collect";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  return process.env.NODE_ENV === "development" || Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`);
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ success: true, ...(await collectMarketSnapshots()) });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to collect snapshots" }, { status: 502 });
  }
}