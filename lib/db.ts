import fs from "fs";
import path from "path";

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
  image: string;
  category: "citadine" | "sport" | "premium" | "suv" | "break";
  unavailableDates: string[];
};

export type Reservation = {
  id: string;
  carId: string;
  userName: string;
  userPhone: string;
  userAge?: number;
  userPermisDate?: string;
  pickupLocation: string;
  returnLocation: string;
  startDate: string;
  endDate: string;
  category: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  originalPrice?: number;
  proposedPrice?: number;
  negotiationNote?: string;
  finalPrice?: number;
  createdAt: string;
  adminNote?: string;
};

// ── Storage abstraction — KV in production, JSON files in dev ─────────────

const USE_KV = !!process.env.KV_REST_API_URL;

// Lazy import so local dev doesn't need KV env vars
async function kv() {
  const { kv } = await import("@vercel/kv");
  return kv;
}

// ── Local JSON helpers ────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON<T>(file: string, fallback: T): T {
  ensureDir();
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return fallback;
  try { return JSON.parse(fs.readFileSync(p, "utf-8")) as T; } catch { return fallback; }
}

function writeJSON<T>(file: string, data: T) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

// ── Default fleet ─────────────────────────────────────────────────────────

const DEFAULT_CARS: Car[] = [
  {
    id: "car-1", badge: "CITADINE", brand: "HYUNDAI", year: 2024, model: "i20 Sport",
    description: "Compacte, économe, parfaite pour la ville et les petites escapades côtières.",
    places: 5, boite: "Man.", conso: "5.2L/100km", extra: "A/C", pricePerDay: 89,
    available: true, featured: false, image: "car-hyundai.png", category: "citadine", unavailableDates: [],
  },
  {
    id: "car-2", badge: "LE PLUS DEMANDÉ", brand: "SUZUKI", year: 2024, model: "Swift Sport",
    description: "Le caractère, en rouge. Agile, nerveuse, et tellement plaisante à conduire.",
    places: 5, boite: "Auto", conso: "5.5L/100km", extra: "A/C", pricePerDay: 110,
    available: true, featured: true, image: "car-suzuki.png", category: "sport", unavailableDates: [],
  },
  {
    id: "car-3", badge: "PREMIUM", brand: "RENAULT", year: 2025, model: "Clio E-Tech",
    description: "Hybride, silencieuse, confort haut de gamme — pour les longs trajets sans compromis.",
    places: 5, boite: "Auto", conso: "4.1L/100km", extra: "Hyb.", pricePerDay: 135,
    available: true, featured: false, image: "car-renault.png", category: "premium", unavailableDates: [],
  },
];

// ── Cars ──────────────────────────────────────────────────────────────────

export async function getCars(): Promise<Car[]> {
  if (USE_KV) {
    const db = await kv();
    const cars = await db.get<Car[]>("cars");
    return cars ?? DEFAULT_CARS;
  }
  return readJSON<Car[]>("cars.json", DEFAULT_CARS);
}

export async function saveCars(cars: Car[]): Promise<void> {
  if (USE_KV) {
    const db = await kv();
    await db.set("cars", cars);
    return;
  }
  writeJSON("cars.json", cars);
}

export async function getCarById(id: string): Promise<Car | undefined> {
  const cars = await getCars();
  return cars.find((c) => c.id === id);
}

// ── Reservations ──────────────────────────────────────────────────────────

export async function getReservations(): Promise<Reservation[]> {
  if (USE_KV) {
    const db = await kv();
    const res = await db.get<Reservation[]>("reservations");
    return res ?? [];
  }
  return readJSON<Reservation[]>("reservations.json", []);
}

export async function saveReservations(reservations: Reservation[]): Promise<void> {
  if (USE_KV) {
    const db = await kv();
    await db.set("reservations", reservations);
    return;
  }
  writeJSON("reservations.json", reservations);
}

export async function addReservation(r: Omit<Reservation, "id" | "createdAt" | "status">): Promise<Reservation> {
  const reservations = await getReservations();
  const newR: Reservation = {
    ...r,
    id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  reservations.push(newR);
  await saveReservations(reservations);
  return newR;
}

export async function updateReservationStatus(
  id: string,
  status: Reservation["status"],
  adminNote?: string
): Promise<Reservation | null> {
  const reservations = await getReservations();
  const idx = reservations.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  reservations[idx] = { ...reservations[idx], status, ...(adminNote ? { adminNote } : {}) };
  await saveReservations(reservations);
  return reservations[idx];
}

// ── Availability ──────────────────────────────────────────────────────────

export async function isCarAvailable(carId: string, startDate: string, endDate: string): Promise<boolean> {
  const car = await getCarById(carId);
  if (!car || !car.available) return false;

  const start = new Date(startDate);
  const end = new Date(endDate);

  for (const d of car.unavailableDates) {
    const blocked = new Date(d);
    if (blocked >= start && blocked <= end) return false;
  }

  const reservations = await getReservations();
  for (const r of reservations) {
    if (r.carId !== carId) continue;
    if (r.status === "cancelled" || r.status === "rejected") continue;
    const rStart = new Date(r.startDate);
    const rEnd = new Date(r.endDate);
    if (start <= rEnd && end >= rStart) return false;
  }
  return true;
}

export async function getSuggestedCars(startDate: string, endDate: string, category?: string): Promise<Car[]> {
  const cars = await getCars();
  const results: Car[] = [];
  for (const c of cars) {
    if (!(await isCarAvailable(c.id, startDate, endDate))) continue;
    if (category && category !== "all" && c.category !== category) continue;
    results.push(c);
  }
  return results.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
}

// ── Admin password override ───────────────────────────────────────────────

export async function getAdminPasswordOverride(): Promise<string | null> {
  if (USE_KV) {
    const db = await kv();
    return db.get<string>("admin_password");
  }
  try {
    const p = path.join(DATA_DIR, "admin_override.json");
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf-8")).password ?? null;
  } catch {}
  return null;
}

export async function setAdminPasswordOverride(password: string): Promise<void> {
  if (USE_KV) {
    const db = await kv();
    await db.set("admin_password", password);
    return;
  }
  ensureDir();
  writeJSON("admin_override.json", { password });
}
