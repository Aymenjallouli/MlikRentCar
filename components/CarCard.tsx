"use client";
import Image from "next/image";
import { useState } from "react";
import type { Car } from "@/lib/db";

interface CarCardProps {
  car: Car;
  index: number;
  onReserve?: (car: Car) => void;
}

export default function CarCard({ car, index, onReserve }: CarCardProps) {
  const [hovered, setHovered] = useState(false);

  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#121212",
        border: car.featured
          ? `1px solid #8e0d16`
          : hovered
          ? "1px solid #232323"
          : "1px solid #1b1b1b",
        borderRadius: 4,
        overflow: "hidden",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s",
        position: "relative",
      }}
    >
      {/* Featured gradient overlay */}
      {car.featured && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(142,13,22,.08) 0%, transparent 40%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* Photo area */}
      <div
        style={{
          aspectRatio: "16/10",
          background: "linear-gradient(180deg, #1a1a1a, #0c0c0c)",
          padding: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Badge top-left */}
        <div
          className="absolute top-4 left-4 flex items-center gap-1.5 z-10"
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#E11D2A",
            fontWeight: 500,
          }}
        >
          <span
            className="rounded-full"
            style={{ width: 6, height: 6, background: "#E11D2A", display: "inline-block" }}
          />
          {car.badge}
        </div>

        {/* Big number top-right */}
        <div
          className="absolute top-4 right-4"
          style={{
            fontFamily: "var(--font-anton, Anton)",
            fontSize: 48,
            color: "#6b6864",
            opacity: 0.4,
            lineHeight: 1,
          }}
        >
          {num}
        </div>

        {/* Car image */}
        <div className="flex items-end justify-center h-full pt-8">
          <div style={{ position: "relative", width: "100%", maxWidth: 280 }}>
            <div
              style={{
                position: "absolute",
                bottom: -4,
                left: "50%",
                transform: "translateX(-50%)",
                width: "80%",
                height: 20,
                background: "radial-gradient(ellipse, rgba(0,0,0,.5) 0%, transparent 70%)",
                filter: "blur(8px)",
              }}
            />
            <Image
              src={car.image?.startsWith("http") ? car.image : `/assets/${car.image}`}
              alt={`${car.brand} ${car.model}`}
              width={280}
              height={160}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "24px 24px 28px" }}>
        {/* Brand line */}
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#6b6864",
            marginBottom: 6,
          }}
        >
          {car.brand} / {car.year}
        </div>

        {/* Model name */}
        <h3
          className="display"
          style={{ fontSize: 34, letterSpacing: "0.02em", marginBottom: 10, lineHeight: 1.1 }}
        >
          {car.model}
        </h3>

        {/* Description */}
        <p style={{ fontSize: 13, color: "#a8a4a0", lineHeight: 1.55, marginBottom: 18 }}>
          {car.description}
        </p>

        {/* Specs */}
        <div
          className="grid grid-cols-4"
          style={{
            borderTop: "1px solid #1b1b1b",
            borderBottom: "1px solid #1b1b1b",
            padding: "18px 0",
            marginBottom: 20,
          }}
        >
          {[
            { value: String(car.places), label: "Places" },
            { value: car.boite, label: "Boîte" },
            { value: car.conso, label: "Conso" },
            { value: car.extra, label: "Extra" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 16, color: "#f5f3ef", lineHeight: 1 }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#6b6864",
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Price row */}
        <div className="flex items-end justify-between">
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#a8a4a0" }}>DT </span>
            <span style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 48, lineHeight: 1 }}>{car.pricePerDay}</span>
            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#6b6864",
                marginLeft: 4,
              }}
            >
              /jour
            </span>
          </div>

          <button
            onClick={() => onReserve?.(car)}
            className="flex items-center justify-center transition-all duration-200"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid #232323",
              background: hovered ? "#E11D2A" : "transparent",
              color: hovered ? "#0a0a0a" : "#f5f3ef",
              fontSize: 18,
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
