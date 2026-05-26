import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON<T>(file: string, fallback: T): T {
  ensureDir();
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(file: string, data: T) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

// ── Types ──────────────────────────────────────────────────────────────────

export type Car = {
  id: string;
  badge: string;
  brand: string;
  year: number;
  model: string;
  description: string;
  places: number;
  boite: string;
  conso: string;
  extra: string;
  pricePerDay: number;
  available: boolean;
  featured: boolean;
  image: string; // filename in /public/assets/
  category: "citadine" | "sport" | "premium" | "suv" | "break";
  unavailableDates: string[]; // "YYYY-MM-DD"
};

export type Reservation = {
  id: string;
  carId: string;
  userName: string;
  userPhone: string;
  userAge?: number;
  userPermisDate?: string; // "YYYY-MM" approximate
  pickupLocation: string;
  returnLocation: string;
  startDate: string;
  endDate: string;
  category: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  // Price negotiation
  originalPrice?: number;   // admin-listed price × days
  proposedPrice?: number;   // client counter-offer
  negotiationNote?: string; // client's message about the price
  finalPrice?: number;      // admin-confirmed final price
  createdAt: string;
  adminNote?: string;
};

export type AdminUser = {
  username: string;
  passwordHash: string;
};

// ── Cars ──────────────────────────────────────────────────────────────────

const DEFAULT_CARS: Car[] = [
  {
    id: "car-1",
    badge: "CITADINE",
    brand: "HYUNDAI",
    year: 2024,
    model: "i20 Sport",
    description: "Compacte, économe, parfaite pour la ville et les petites escapades côtières.",
    places: 5,
    boite: "Man.",
    conso: "5.2L/100km",
    extra: "A/C",
    pricePerDay: 89,
    available: true,
    featured: false,
    image: "car-hyundai.png",
    category: "citadine",
    unavailableDates: [],
  },
  {
    id: "car-2",
    badge: "LE PLUS DEMANDÉ",
    brand: "SUZUKI",
    year: 2024,
    model: "Swift Sport",
    description: "Le caractère, en rouge. Agile, nerveuse, et tellement plaisante à conduire.",
    places: 5,
    boite: "Auto",
    conso: "5.5L/100km",
    extra: "A/C",
    pricePerDay: 110,
    available: true,
    featured: true,
    image: "car-suzuki.png",
    category: "sport",
    unavailableDates: [],
  },
  {
    id: "car-3",
    badge: "PREMIUM",
    brand: "RENAULT",
    year: 2025,
    model: "Clio E-Tech",
    description: "Hybride, silencieuse, confort haut de gamme — pour les longs trajets sans compromis.",
    places: 5,
    boite: "Auto",
    conso: "4.1L/100km",
    extra: "Hyb.",
    pricePerDay: 135,
    available: true,
    featured: false,
    image: "car-renault.png",
    category: "premium",
    unavailableDates: [],
  },
];

export function getCars(): Car[] {
  return readJSON<Car[]>("cars.json", DEFAULT_CARS);
}

export function saveCars(cars: Car[]) {
  writeJSON("cars.json", cars);
}

export function getCarById(id: string): Car | undefined {
  return getCars().find((c) => c.id === id);
}

// ── Reservations ──────────────────────────────────────────────────────────

export function getReservations(): Reservation[] {
  return readJSON<Reservation[]>("reservations.json", []);
}

export function saveReservations(reservations: Reservation[]) {
  writeJSON("reservations.json", reservations);
}

export function addReservation(r: Omit<Reservation, "id" | "createdAt" | "status">): Reservation {
  const reservations = getReservations();
  const newR: Reservation = {
    ...r,
    id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  reservations.push(newR);
  saveReservations(reservations);
  return newR;
}

export function updateReservationStatus(
  id: string,
  status: Reservation["status"],
  adminNote?: string
): Reservation | null {
  const reservations = getReservations();
  const idx = reservations.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  reservations[idx] = { ...reservations[idx], status, ...(adminNote ? { adminNote } : {}) };
  saveReservations(reservations);
  return reservations[idx];
}

// ── Availability check ────────────────────────────────────────────────────

export function isCarAvailable(carId: string, startDate: string, endDate: string): boolean {
  const car = getCarById(carId);
  if (!car || !car.available) return false;

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check unavailable dates
  for (const d of car.unavailableDates) {
    const blocked = new Date(d);
    if (blocked >= start && blocked <= end) return false;
  }

  // Check confirmed reservations
  const reservations = getReservations();
  for (const r of reservations) {
    if (r.carId !== carId) continue;
    if (r.status === "cancelled" || r.status === "rejected") continue;
    const rStart = new Date(r.startDate);
    const rEnd = new Date(r.endDate);
    if (start <= rEnd && end >= rStart) return false;
  }
  return true;
}

export function getSuggestedCars(
  startDate: string,
  endDate: string,
  category?: string
): Car[] {
  const cars = getCars();
  return cars
    .filter((c) => {
      if (!isCarAvailable(c.id, startDate, endDate)) return false;
      if (category && category !== "all" && c.category !== category) return false;
      return true;
    })
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
}

// ── Admin auth (simple token) ─────────────────────────────────────────────

const ADMIN_TOKEN_FILE = "admin_token.json";

export function getAdminToken(): string {
  const data = readJSON<{ token: string }>(ADMIN_TOKEN_FILE, { token: "" });
  return data.token;
}

export function setAdminToken(token: string) {
  writeJSON(ADMIN_TOKEN_FILE, { token });
}
