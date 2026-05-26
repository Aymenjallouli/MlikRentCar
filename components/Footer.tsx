"use client";
export default function Footer() {
  const cols = [
    {
      header: "Explorer",
      links: ["Notre flotte", "Tarifs", "Services", "Comment ça marche"],
      ids: ["flotte", "tarifs", "services", "process"],
    },
    {
      header: "Société",
      links: ["À propos", "Conditions générales", "Politique de confidentialité", "Mentions légales"],
      ids: ["#", "#", "#", "#"],
    },
    {
      header: "Contact",
      links: ["52 · 526 · 595 — WhatsApp", "52 · 445 · 525 — Tél.", "Tunis · Carthage", "Ahmed Mlik · gérant"],
      ids: ["https://wa.me/21652526595", "tel:+21652445525", "#", "#"],
    },
  ];

  const scrollTo = (id: string) => {
    if (id.startsWith("http") || id.startsWith("tel") || id.startsWith("#")) return;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer style={{ background: "#050505", borderTop: "1px solid #1b1b1b", padding: "clamp(40px, 6vw, 64px) clamp(16px, 4vw, 32px) clamp(24px, 4vw, 32px)" }}>
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pb-10 mb-8"
          style={{ gap: "clamp(32px, 5vw, 48px)", borderBottom: "1px solid #1b1b1b" }}
        >
          {/* Brand col */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div
              style={{
                fontFamily: "var(--font-anton, Anton)",
                fontSize: "clamp(36px, 6vw, 48px)",
                letterSpacing: "0.06em",
                lineHeight: 1,
                marginBottom: 14,
              }}
            >
              MLIK&apos;A
            </div>
            <p style={{ fontSize: 14, color: "#a8a4a0", lineHeight: 1.55, maxWidth: 320 }}>
              Location de voiture premium en Tunisie. Une flotte sélectionnée, des tarifs honnêtes, un service qui ne dort jamais.
            </p>
          </div>

          {/* Link cols */}
          {cols.map((col) => (
            <div key={col.header}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "#6b6864",
                  marginBottom: 16,
                }}
              >
                {col.header}
              </div>
              <ul style={{ listStyle: "none" }}>
                {col.links.map((link, i) => (
                  <li key={i} style={{ marginBottom: 10 }}>
                    {col.ids[i].startsWith("http") || col.ids[i].startsWith("tel") ? (
                      <a
                        href={col.ids[i]}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 14, color: "#a8a4a0", transition: "color 0.2s" }}
                        onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#E11D2A")}
                        onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#a8a4a0")}
                      >
                        {link}
                      </a>
                    ) : (
                      <button
                        onClick={() => scrollTo(col.ids[i])}
                        style={{ fontSize: 14, color: "#a8a4a0", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = "#E11D2A")}
                        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = "#a8a4a0")}
                      >
                        {link}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2" style={{ fontSize: 12, color: "#6b6864" }}>
          <span>© 2026 MLIK&apos;A Location Voiture · Tous droits réservés</span>
          <span>Conçu en Tunisie · Disponible 24/7</span>
        </div>
      </div>
    </footer>
  );
}
