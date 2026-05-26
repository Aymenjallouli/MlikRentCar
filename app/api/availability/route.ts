import { NextRequest, NextResponse } from "next/server";
import { getSuggestedCars, isCarAvailable, getCars } from "@/lib/db";

// GET /api/availability?startDate=&endDate=&category=&carId=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";
  const category = searchParams.get("category") ?? "all";
  const carId = searchParams.get("carId");

  if (!startDate || !endDate) {
    return NextResponse.json({ error: "startDate and endDate required" }, { status: 400 });
  }

  // Single car check
  if (carId) {
    const available = isCarAvailable(carId, startDate, endDate);
    return NextResponse.json({ carId, available });
  }

  // Suggestions
  const suggested = getSuggestedCars(startDate, endDate, category);
  const all = getCars();

  return NextResponse.json({
    available: suggested,
    unavailable: all.filter((c) => !suggested.find((s) => s.id === c.id)),
  });
}
