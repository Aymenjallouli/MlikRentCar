import { NextRequest, NextResponse } from "next/server";
import { getCars, saveCars, Car } from "@/lib/db";

// GET /api/cars — public list
export async function GET() {
  return NextResponse.json(getCars());
}

// POST /api/cars — admin: create new car
export async function POST(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const cars = getCars();
  const newCar: Car = {
    id: `car-${Date.now()}`,
    badge: body.badge ?? "NOUVEAU",
    brand: body.brand ?? "",
    year: body.year ?? new Date().getFullYear(),
    model: body.model ?? "",
    description: body.description ?? "",
    places: body.places ?? 5,
    boite: body.boite ?? "Man.",
    conso: body.conso ?? "",
    extra: body.extra ?? "",
    pricePerDay: body.pricePerDay ?? 0,
    available: body.available ?? true,
    featured: body.featured ?? false,
    image: body.image ?? "car-placeholder.png",
    category: body.category ?? "citadine",
    unavailableDates: body.unavailableDates ?? [],
  };
  cars.push(newCar);
  saveCars(cars);
  return NextResponse.json(newCar, { status: 201 });
}
