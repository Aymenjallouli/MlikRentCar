const tiers = [
  { label: "Journée", value: "89", note: "Dès 24h · km illimités" },
  { label: "Semaine", value: "540", note: "7 jours · −15%" },
  { label: "Mois", value: "1990", note: "30 jours · −30%" },
];

export default function PricingStripe() {
  return (
    <section
      id="tarifs"
      style={{
        background: "#E11D2A",
        padding: "clamp(56px, 8vw, 80px) clamp(16px, 4vw, 32px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Pinstripe */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(0,0,0,.04) 0, rgba(0,0,0,.04) 1px, transparent 1px, transparent 22px)",
          pointerEvents: "none",
        }}
      />

      {/* Mobile: stacked. Desktop: 1.4fr + 3 tiers */}
      <div className="relative mx-auto" style={{ maxWidth: 1480 }}>
        {/* Headline */}
        <h3
          style={{
            fontFamily: "Instrument Serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(40px, 6vw, 84px)",
            color: "#0a0a0a",
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
            marginBottom: "clamp(32px, 5vw, 0px)",
          }}
        >
          Des tarifs sans détour.
        </h3>

        {/* Tiers: 1 col mobile → 3 col tablet → desktop keep in same row */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 mt-8 lg:mt-10"
        >
          {tiers.map((t) => (
            <div key={t.label} style={{ borderTop: "2px solid #0a0a0a", paddingTop: 20 }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#0a0a0a",
                  marginBottom: 8,
                }}
              >
                {t.label}
              </div>
              <div className="flex items-baseline gap-1">
                <span style={{ fontFamily: "var(--font-anton, Anton)", fontSize: "clamp(48px, 7vw, 64px)", color: "#0a0a0a", lineHeight: 1 }}>
                  {t.value}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#0a0a0a" }}>DT</span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(10,10,10,.7)", marginTop: 4 }}>{t.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
