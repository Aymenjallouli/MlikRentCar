"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Car } from "@/lib/db";
import SectionHead from "./SectionHead";
import CarCard from "./CarCard";

export default function FleetLoader() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then(setCars)
      .catch(() => {});
  }, []);

  const handleReserve = (car: Car) => {
    router.push(`/reserver?carId=${car.id}`);
  };

  if (cars.length === 0) return null;

  return (
    <section id="flotte" style={{ padding: "clamp(64px, 10vw, 120px) clamp(16px, 4vw, 32px)", background: "var(--bg)" }}>
      <SectionHead
        eyebrow="LA FLOTTE · 03"
        headline={
          <>
            Trois voitures.{" "}
            <span className="serif" style={{ color: "#a8a4a0", textTransform: "none", fontSize: "0.9em" }}>
              une seule promesse —
            </span>{" "}
            la liberté.
          </>
        }
      />
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-5 mx-auto"
        style={{ maxWidth: 1480 }}
      >
        {cars.map((car, i) => (
          <CarCard key={car.id} car={car} index={i} onReserve={handleReserve} />
        ))}
      </div>
    </section>
  );
}
