"use client";
import Image from "next/image";
import BookingWidget from "./BookingWidget";

export default function Hero() {
  const scrollToFleet = () => {
    document.getElementById("flotte")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToBook = () => {
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ background: "var(--bg)", minHeight: "100vh" }}
    >
      {/* Decorative big number — desktop only */}
      <div
        className="absolute hidden xl:block pointer-events-none select-none"
        style={{
          fontFamily: "var(--font-anton, Anton)",
          fontSize: "clamp(200px, 22vw, 380px)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(225,29,42,.13)",
          right: "3vw",
          top: "8vh",
          zIndex: 1,
          lineHeight: 1,
        }}
      >
        25
      </div>

      {/* ── MOBILE layout (< lg) ─────────────────────────────────────────── */}
      <div className="lg:hidden relative" style={{ padding: "80px 20px 0", zIndex: 3 }}>
        <div
          className="inline-flex items-center gap-2.5 rounded-full border mb-6"
          style={{ padding: "7px 13px", borderColor: "#232323", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#a8a4a0" }}
        >
          <span style={{ width: 14, height: 1, background: "#E11D2A", display: "inline-block" }} />
          Tunisie · Depuis 2018
        </div>

        <h1 className="display" style={{ fontSize: "clamp(56px, 14vw, 84px)", marginBottom: 20 }}>
          PRENEZ
          <br />
          <span style={{ color: "#E11D2A", position: "relative", display: "inline-block" }}>
            <span style={{ fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: "0.78em", color: "#f5f3ef", textTransform: "none", letterSpacing: "-0.01em", display: "inline-block", transform: "translateY(-0.06em)", marginRight: "0.12em" }}>
              la
            </span>
            Route
            <span style={{ position: "absolute", left: -2, right: -2, bottom: "0.05em", height: "0.06em", background: "#E11D2A" }} />
          </span>
          <br />
          en grand.
        </h1>

        <p style={{ color: "#a8a4a0", fontSize: 14, lineHeight: 1.55, marginBottom: 28, maxWidth: 480 }}>
          MLIK&apos;A — la location de voiture premium en Tunisie. Flotte récente, livraison à domicile, disponible 24h/24.
        </p>

        <div className="flex flex-col gap-3 mb-8">
          <button onClick={scrollToBook} className="w-full flex items-center justify-center gap-3"
            style={{ background: "#E11D2A", color: "#0a0a0a", border: "1px solid #E11D2A", borderRadius: 2, padding: "17px 24px", fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", minHeight: 56 }}>
            Réserver maintenant →
          </button>
          <button onClick={scrollToFleet} className="w-full flex items-center justify-center gap-3"
            style={{ background: "transparent", color: "#f5f3ef", border: "1px solid #232323", borderRadius: 2, padding: "17px 24px", fontWeight: 600, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", minHeight: 56 }}>
            Voir la flotte
          </button>
        </div>

        <div style={{ marginLeft: -20, marginRight: -20, overflow: "hidden" }}>
          <Image src="/assets/cars-hero.png" alt="Flotte MLIK'A" width={920} height={560} priority
            style={{ width: "100%", height: "auto", filter: "drop-shadow(0 20px 40px rgba(0,0,0,.6))", maskImage: "linear-gradient(180deg, #000 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, #000 60%, transparent 100%)" }} />
        </div>

        <div style={{ marginTop: -32, paddingBottom: 40, position: "relative", zIndex: 5 }}>
          <BookingWidget />
        </div>
      </div>

      {/* ── DESKTOP layout (≥ lg) ─────────────────────────────────────────── */}
      {/* Full-bleed: H1 on the left, photo bleeds in from right, widget overlaid bottom-right */}
      <div
        className="hidden lg:block relative"
        style={{ maxWidth: 1480, margin: "0 auto", minHeight: "100vh", padding: "0 48px" }}
      >
        {/* Left text column — sits above everything */}
        <div
          className="relative flex flex-col justify-center"
          style={{ zIndex: 4, paddingTop: 140, paddingBottom: 80, maxWidth: 660 }}
        >
          {/* Tag */}
          <div
            className="inline-flex items-center gap-2.5 rounded-full border mb-8"
            style={{ padding: "8px 14px", borderColor: "#232323", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#a8a4a0", alignSelf: "flex-start" }}
          >
            <span style={{ width: 18, height: 1, background: "#E11D2A", display: "inline-block" }} />
            Tunisie · Depuis 2018
          </div>

          {/* Giant H1 */}
          <h1
            className="display"
            style={{ fontSize: "clamp(80px, 10vw, 160px)", lineHeight: 0.88, marginBottom: 28 }}
          >
            PRENEZ
            <br />
            <span style={{ color: "#E11D2A", position: "relative", display: "inline-block" }}>
              <span style={{
                fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: "0.78em",
                color: "#f5f3ef", textTransform: "none", letterSpacing: "-0.01em",
                display: "inline-block", transform: "translateY(-0.06em)", marginRight: "0.15em",
              }}>
                la
              </span>
              Route
              <span style={{ position: "absolute", left: -2, right: -2, bottom: "0.05em", height: "0.06em", background: "#E11D2A" }} />
            </span>
            <br />
            en grand.
          </h1>

          {/* Subhead */}
          <p style={{ maxWidth: 420, color: "#a8a4a0", fontSize: 15, lineHeight: 1.6, marginBottom: 36 }}>
            MLIK&apos;A — la location de voiture premium en Tunisie. Flotte récente, livraison à domicile, disponible 24h/24. Ahmed Mlik vous répond en moins d&apos;une heure.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={scrollToBook}
              className="inline-flex items-center gap-3 group"
              style={{ background: "#E11D2A", color: "#0a0a0a", border: "1px solid #E11D2A", borderRadius: 2, padding: "18px 28px", fontWeight: 600, fontSize: 13.5, letterSpacing: "0.04em", textTransform: "uppercase", transition: "all .2s" }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = "#ff3a47"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = "#E11D2A"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Réserver maintenant
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button
              onClick={scrollToFleet}
              className="inline-flex items-center gap-3"
              style={{ background: "rgba(255,255,255,.02)", color: "#f5f3ef", border: "1px solid #232323", borderRadius: 2, padding: "18px 28px", fontWeight: 600, fontSize: 13.5, letterSpacing: "0.04em", textTransform: "uppercase", transition: "all .2s" }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.borderColor = "#f5f3ef")}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.borderColor = "#232323")}
            >
              Voir la flotte
            </button>
          </div>
        </div>

        {/* Car photo — absolute, right side, bleeds off screen */}
        <div
          className="absolute"
          style={{
            right: "-4vw",
            bottom: 0,
            width: "58vw",
            maxWidth: 900,
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/assets/cars-hero.png"
            alt="Flotte MLIK'A"
            width={900}
            height={560}
            priority
            style={{
              width: "100%",
              height: "auto",
              filter: "drop-shadow(0 40px 80px rgba(0,0,0,.65))",
              maskImage: "linear-gradient(180deg, #000 65%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(180deg, #000 65%, transparent 100%)",
            }}
          />
        </div>

        {/* Booking widget — absolute, overlaid on bottom-right of photo */}
        <div
          className="absolute"
          style={{
            right: 48,
            bottom: 48,
            width: 400,
            zIndex: 5,
          }}
        >
          <BookingWidget />
        </div>
      </div>
    </section>
  );
}
