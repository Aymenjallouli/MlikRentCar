"use client";
import { useState } from "react";

const cards = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    iconBg: "#22c55e",
    label: "WhatsApp · réponse instantanée",
    value: "52 · 526 · 595",
    href: "https://wa.me/21652526595",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    iconBg: "#1877f2",
    label: "Facebook · DM ouvert",
    value: "Ahmed Mlik",
    href: "https://facebook.com",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.46 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.34 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.77-.77a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 16a2 2 0 0 1 .5.92z"/>
      </svg>
    ),
    iconBg: "#E11D2A",
    label: "Téléphone · 24/7",
    value: "52 · 445 · 525",
    href: "tel:+21652445525",
  },
];

export default function ContactSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="contact"
      style={{ background: "#0c0c0c", padding: "clamp(64px, 10vw, 140px) clamp(16px, 4vw, 32px)" }}
    >
      {/* 1 col mobile → 2 col desktop */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 mx-auto items-start"
        style={{ gap: "clamp(48px, 8vw, 80px)", maxWidth: 1480 }}
      >
        {/* Left */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span style={{ width: 18, height: 1, background: "#E11D2A", display: "inline-block" }} />
            <span className="eyebrow">CONTACT · 24/7</span>
          </div>

          <h2
            className="display"
            style={{ fontSize: "clamp(40px, 8vw, 128px)", lineHeight: 0.9, marginBottom: 24 }}
          >
            Une voiture{" "}
            <span
              className="serif"
              style={{ color: "#E11D2A", textTransform: "none", fontSize: "0.9em" }}
            >
              disponible —
            </span>{" "}
            un appel suffit.
          </h2>

          <p style={{ fontSize: "clamp(14px, 2vw, 17px)", color: "#a8a4a0", maxWidth: 520, lineHeight: 1.55, marginBottom: 40 }}>
            Ahmed Mlik et son équipe répondent à toute heure. WhatsApp, téléphone ou Facebook — choisissez le canal qui vous convient, on vous met sur la route en moins d&apos;une heure.
          </p>

          <div className="flex flex-wrap gap-8 lg:gap-10">
            {[
              { title: "Agence principale", lines: ["Tunis · Carthage", "Av. Habib Bourguiba, 1001"] },
              { title: "Horaires", lines: ["24h / 24 · 7j / 7", "Sur rendez-vous ou à la volée"] },
            ].map((block) => (
              <div key={block.title}>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#6b6864",
                    marginBottom: 8,
                    fontWeight: 500,
                  }}
                >
                  {block.title}
                </div>
                {block.lines.map((l) => (
                  <div key={l} style={{ color: "#a8a4a0", fontSize: 14, lineHeight: 1.6 }}>
                    {l}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right — contact cards */}
        <div className="flex flex-col gap-3.5">
          {cards.map((card, i) => (
            <a
              key={i}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 sm:gap-5 transition-all duration-200"
              style={{
                padding: "clamp(16px, 3vw, 22px) clamp(16px, 3vw, 26px)",
                background: "#121212",
                border: hovered === i ? "1px solid #E11D2A" : "1px solid #1b1b1b",
                borderRadius: 4,
                transform: hovered === i ? "translateX(4px)" : "translateX(0)",
                minHeight: 80,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="grid place-items-center rounded-full shrink-0"
                style={{ width: 48, height: 48, background: card.iconBg, color: "#fff" }}
              >
                {card.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 12, color: "#6b6864", marginBottom: 4 }}>{card.label}</div>
                <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: "clamp(20px, 3vw, 26px)", letterSpacing: "0.04em", lineHeight: 1 }}>
                  {card.value}
                </div>
              </div>
              <span
                className="transition-transform duration-200 shrink-0"
                style={{
                  color: "#6b6864",
                  fontSize: 18,
                  transform: hovered === i ? "translateX(4px)" : "translateX(0)",
                }}
              >
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
