import { NextRequest, NextResponse } from "next/server";
import { addReservation, getReservations, getCarById, isCarAvailable } from "@/lib/db";
import { notifyTelegram } from "@/lib/notify";

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-token") !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const reservations = getReservations();
  const enriched = reservations.map((r) => ({ ...r, car: getCarById(r.carId) }));
  return NextResponse.json(enriched.reverse());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    carId, userName, userPhone, userAge, userPermisDate,
    pickupLocation, returnLocation, startDate, endDate, category,
    proposedPrice, negotiationNote,
  } = body;

  if (!userName || !userPhone || !startDate || !endDate) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  if (!/^[\d\s\+\-\(\)]{8,20}$/.test(userPhone)) {
    return NextResponse.json({ error: "Numéro de téléphone invalide" }, { status: 400 });
  }

  if (carId && carId !== "any") {
    const available = isCarAvailable(carId, startDate, endDate);
    if (!available) {
      return NextResponse.json({ error: "Ce véhicule n'est pas disponible pour ces dates" }, { status: 409 });
    }
  }

  // Compute original price
  const car = carId && carId !== "any" ? getCarById(carId) : undefined;
  const days = Math.max(1, Math.round(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  ));
  const originalPrice = car ? car.pricePerDay * days : undefined;

  const reservation = addReservation({
    carId: carId ?? "any",
    userName,
    userPhone,
    userAge: userAge ? Number(userAge) : undefined,
    userPermisDate: userPermisDate || undefined,
    pickupLocation: pickupLocation ?? "À préciser",
    returnLocation: returnLocation ?? "À préciser",
    startDate,
    endDate,
    category: category ?? "all",
    originalPrice,
    proposedPrice: proposedPrice ? Number(proposedPrice) : undefined,
    negotiationNote: negotiationNote || undefined,
  });

  if (car) {
    notifyTelegram(reservation, car).catch(() => {});
  } else {
    notifyTelegram(reservation, {
      id: "any", brand: "Non spécifié", model: "", year: 0,
      badge: category ?? "all", description: "", places: 0, boite: "",
      conso: "", extra: "", pricePerDay: 0, available: true, featured: false,
      image: "", category: "citadine", unavailableDates: [],
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true, reservation }, { status: 201 });
}
