"use client";
import SectionHead from "./SectionHead";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "24h / 24",
    body: "Réservation, prise en charge et assistance disponibles à toute heure du jour ou de la nuit.",
    index: "/ 01",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
      </svg>
    ),
    title: "Livraison gratuite",
    body: "À l'aéroport, à l'hôtel, à votre domicile. Vous nous dites où — nous arrivons à l'heure.",
    index: "/ 02",
  },

  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: "Sans dépôt caché",
    body: "Le tarif que vous voyez est le tarif final. Pas de frais surprise, pas de petites lignes.",
    index: "/ 03",
  },
];

export default function FeaturesSection() {
  return (
    <section id="services" style={{ padding: "clamp(64px, 10vw, 120px) clamp(16px, 4vw, 32px)", background: "#0c0c0c" }}>
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        <SectionHead
          eyebrow="POURQUOI MLIK'A "
          headline={
            <>
              Pas seulement une voiture —{" "}
              <span className="serif" style={{ color: "#a8a4a0", textTransform: "none", fontSize: "0.9em" }}>
                une expérience
              </span>
            </>
          }
        />

        {/* 1 col mobile → 3 col desktop */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3"
          style={{ border: "1px solid #1b1b1b" }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className={`relative transition-colors duration-200 ${i < features.length - 1 ? "border-b lg:border-b-0 lg:border-r border-[#1b1b1b]" : ""}`}
              style={{
                padding: "clamp(28px, 5vw, 48px) clamp(20px, 4vw, 36px)",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.background = "rgba(225,29,42,.04)")}
              onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Fix borders for lg layout — inline override via class is tricky; we use data approach */}
              <div
                className="absolute top-5 right-5"
                style={{ fontSize: 11, letterSpacing: "0.14em", color: "#6b6864" }}
              >
                {f.index}
              </div>

              <div
                className="grid place-items-center mb-5"
                style={{ width: 52, height: 52, borderRadius: "50%", border: "1px solid #232323" }}
              >
                {f.icon}
              </div>

              <h4
                className="display mb-3"
                style={{ fontSize: "clamp(20px, 2.5vw, 24px)", letterSpacing: "0.02em", lineHeight: 1.1 }}
              >
                {f.title}
              </h4>

              <p style={{ fontSize: 13.5, color: "#a8a4a0", lineHeight: 1.6 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
