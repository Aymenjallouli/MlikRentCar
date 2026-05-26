import { NextRequest, NextResponse } from "next/server";
import { getCars, saveCars } from "@/lib/db";

function requireAdmin(req: NextRequest) {
  return req.headers.get("x-admin-token") === process.env.ADMIN_SECRET;
}

// PUT /api/cars/[id] — update car
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const cars = getCars();
  const idx = cars.findIndex((c) => c.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  cars[idx] = { ...cars[idx], ...body, id: params.id };
  saveCars(cars);
  return NextResponse.json(cars[idx]);
}

// DELETE /api/cars/[id] — delete car
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const cars = getCars();
  const filtered = cars.filter((c) => c.id !== params.id);
  if (filtered.length === cars.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  saveCars(filtered);
  return NextResponse.json({ ok: true });
}
