"use client";
import { useRouter } from "next/navigation";
import type { Car } from "@/lib/db";
import SectionHead from "./SectionHead";
import CarCard from "./CarCard";

interface FleetSectionProps {
  cars: Car[];
}

export default function FleetSection({ cars }: FleetSectionProps) {
  const router = useRouter();

  const handleReserve = (car: Car) => {
    router.push(`/reserver?carId=${car.id}`);
  };

  return (
    <section
      id="flotte"
      style={{ padding: "120px 32px", background: "var(--bg)" }}
    >
      <SectionHead
        eyebrow="LA FLOTTE · 03"
        headline={
          <>
            Trois voitures.{" "}
            <span
              className="serif"
              style={{ color: "#a8a4a0", textTransform: "none", fontSize: "0.9em" }}
            >
              une seule promesse —
            </span>{" "}
            la liberté.
          </>
        }
      />

      <div
        className="grid gap-6 mx-auto"
        style={{
          gridTemplateColumns: "repeat(3, 1fr)",
          maxWidth: 1480,
        }}
      >
        {cars.map((car, i) => (
          <CarCard key={car.id} car={car} index={i} onReserve={handleReserve} />
        ))}
      </div>
    </section>
  );
}
