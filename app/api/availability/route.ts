import { NextRequest, NextResponse } from "next/server";
import { getSuggestedCars, isCarAvailable, getCars } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";
  const category = searchParams.get("category") ?? "all";
  const carId = searchParams.get("carId");

  if (!startDate || !endDate) {
    return NextResponse.json({ error: "startDate and endDate required" }, { status: 400 });
  }

  if (carId) {
    const available = await isCarAvailable(carId, startDate, endDate);
    return NextResponse.json({ carId, available });
  }

  const suggested = await getSuggestedCars(startDate, endDate, category);
  const all = await getCars();

  return NextResponse.json({
    available: suggested,
    unavailable: all.filter((c) => !suggested.find((s) => s.id === c.id)),
  });
}
