export default function Marquee() {
  const items = [
    "LIVRAISON GRATUITE",
    "DISPONIBLE 24/7",
    "KM ILLIMITÉS",
    "ASSURANCE TOUS RISQUES",
    "SANS DÉPÔT CACHÉ",
    "RÉSERVATION EN 60 SEC",
  ];

  const doubled = [...items, ...items];

  return (
    <div
      style={{
        background: "#0c0c0c",
        borderTop: "1px solid #1b1b1b",
        borderBottom: "1px solid #1b1b1b",
        padding: "18px 0",
        overflow: "hidden",
      }}
    >
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span
              style={{
                fontFamily: "var(--font-anton, Anton)",
                fontSize: "clamp(20px, 3.5vw, 36px)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                paddingLeft: "clamp(24px, 3vw, 40px)",
              }}
            >
              {item}
            </span>
            <span
              style={{
                color: "#E11D2A",
                fontSize: "clamp(14px, 2vw, 20px)",
                paddingLeft: "clamp(24px, 3vw, 40px)",
                fontFamily: "var(--font-anton, Anton)",
              }}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
