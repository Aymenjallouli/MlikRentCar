import { NextRequest, NextResponse } from "next/server";
import { updateReservationStatus, getReservations, saveReservations, getCarById } from "@/lib/db";

function requireAdmin(req: NextRequest) {
  return req.headers.get("x-admin-token") === process.env.ADMIN_SECRET;
}

// PATCH /api/reservations/[id] — update status and/or final price (admin)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { status, adminNote, finalPrice } = body;

  if (!["pending", "confirmed", "rejected", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = updateReservationStatus(params.id, status, adminNote);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // If a finalPrice is provided, persist it
  if (typeof finalPrice === "number") {
    const reservations = getReservations();
    const idx = reservations.findIndex((r) => r.id === params.id);
    if (idx !== -1) {
      reservations[idx].finalPrice = finalPrice;
      saveReservations(reservations);
      return NextResponse.json({ ok: true, reservation: reservations[idx] });
    }
  }

  return NextResponse.json({ ok: true, reservation: updated });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const reservations = getReservations();
  const r = reservations.find((r) => r.id === params.id);
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...r, car: getCarById(r.carId) });
}
