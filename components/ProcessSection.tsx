import SectionHead from "./SectionHead";

const steps = [
  {
    num: "01",
    title: "Choisissez votre voiture",
    body: "Parcourez la flotte, comparez les modèles, choisissez celle qui correspond à votre voyage.",
  },
  {
    num: "02",
    title: "Confirmez en 60 secondes",
    body: "Renseignez vos dates et le lieu de livraison. Confirmation immédiate par SMS ou WhatsApp.",
  },
  {
    num: "03",
    title: "Prenez la route",
    body: "Nous vous livrons la voiture nettoyée, pleine, et prête à partir. Vous n'avez plus qu'à conduire.",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" style={{ padding: "clamp(64px, 10vw, 120px) clamp(16px, 4vw, 32px)", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        <SectionHead
          eyebrow="COMMENT ÇA MARCHE · 03 ÉTAPES"
          headline={
            <>
              Trois étapes{" "}
              <span className="serif" style={{ color: "#a8a4a0", textTransform: "none", fontSize: "0.9em" }}>
                —
              </span>{" "}
              une voiture devant chez vous.
            </>
          }
        />

        {/* 1 col mobile → 3 col desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((s) => (
            <div
              key={s.num}
              style={{ borderTop: "1px solid #1b1b1b", paddingTop: 24 }}
            >
              <div
                className="display mb-5"
                style={{ fontSize: "clamp(56px, 8vw, 80px)", color: "#E11D2A", lineHeight: 1 }}
              >
                {s.num}
              </div>
              <h4 className="display mb-4" style={{ fontSize: "clamp(22px, 3vw, 30px)", letterSpacing: "0.02em" }}>
                {s.title}
              </h4>
              <p style={{ fontSize: 14.5, color: "#a8a4a0", lineHeight: 1.6, maxWidth: 340 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
