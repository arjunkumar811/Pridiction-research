import { NextResponse } from "next/server";

import { getActiveMarkets } from "@/lib/data/markets";

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 100;

function parseInteger(value: string | null, fallback: number): number | null {
  if (value === null) return fallback;
  if (!/^\d+$/.test(value)) return null;
  return Number(value);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInteger(searchParams.get("limit"), DEFAULT_LIMIT);
  const offset = parseInteger(searchParams.get("offset"), 0);

  if (
    limit === null ||
    limit < 1 ||
    limit > MAX_LIMIT ||
    offset === null ||
    offset < 0
  ) {
    return NextResponse.json(
      { error: "limit must be 1-100 and offset must be a non-negative integer" },
      { status: 400 },
    );
  }

  try {
    const markets = await getActiveMarkets({ limit, offset });
    return NextResponse.json({ markets, pagination: { limit, offset } });
  } catch {
    return NextResponse.json(
      { error: "Unable to load markets" },
      { status: 502 },
    );
  }
}