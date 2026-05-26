"use client";
import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on scroll
  useEffect(() => {
    if (menuOpen) {
      const close = () => setMenuOpen(false);
      window.addEventListener("scroll", close, { once: true, passive: true });
      return () => window.removeEventListener("scroll", close);
    }
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { label: "Flotte", id: "flotte" },
    { label: "Tarifs", id: "tarifs" },
    { label: "Services", id: "services" },
    { label: "Comment ça marche", id: "process" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300"
        style={{
          padding: "14px 20px",
          background: scrolled
            ? "rgba(5,5,5,0.92)"
            : "linear-gradient(180deg,rgba(5,5,5,.85),rgba(5,5,5,0))",
          borderBottom: scrolled ? "1px solid #1b1b1b" : "none",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("hero")}>
          <div
            className="relative grid place-items-center rounded-full shrink-0"
            style={{
              width: 34,
              height: 34,
              background: "#E11D2A",
              fontFamily: "var(--font-anton, Anton)",
              fontSize: 18,
              color: "#000",
            }}
          >
            M
            <span
              className="absolute rounded-full border pointer-events-none"
              style={{ inset: -3, borderColor: "#232323" }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 22, letterSpacing: "0.08em", lineHeight: 1 }}>
              MLIK&apos;A
            </div>
            <div style={{ fontSize: 9.5, letterSpacing: "0.32em", color: "#a8a4a0", marginTop: 2 }}>
              LOCATION · VOITURE
            </div>
          </div>
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex gap-9" style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.04em" }}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="transition-colors duration-200"
              style={{ color: "#a8a4a0" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f5f3ef")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#a8a4a0")}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right side: CTA + hamburger */}
        <div className="flex items-center gap-3">
          <button
            className="hidden sm:flex items-center gap-2.5 rounded-full border transition-all duration-250"
            style={{
              padding: "11px 18px",
              fontSize: 13,
              fontWeight: 600,
              borderColor: "#232323",
              letterSpacing: "0.04em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#E11D2A";
              e.currentTarget.style.color = "#E11D2A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#232323";
              e.currentTarget.style.color = "#f5f3ef";
            }}
          >
            <span
              className="rounded-full"
              style={{
                width: 7,
                height: 7,
                background: "#22c55e",
                boxShadow: "0 0 0 3px rgba(34,197,94,.18)",
                display: "inline-block",
              }}
            />
            Disponible 24/7
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden flex flex-col justify-center items-center gap-1.5"
            style={{ width: 44, height: 44, padding: 10 }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: "#f5f3ef",
                borderRadius: 1,
                transition: "all 0.25s",
                transform: menuOpen ? "translateY(5px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: "#f5f3ef",
                borderRadius: 1,
                transition: "all 0.25s",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: "#f5f3ef",
                borderRadius: 1,
                transition: "all 0.25s",
                transform: menuOpen ? "translateY(-5px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className="fixed inset-0 z-40 lg:hidden"
        style={{
          background: "rgba(5,5,5,0.97)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          paddingTop: 80,
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        <nav className="flex flex-col gap-2">
          {navLinks.map((link, i) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-left transition-colors duration-200"
              style={{
                fontFamily: "var(--font-anton, Anton)",
                fontSize: "clamp(36px, 10vw, 56px)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#a8a4a0",
                padding: "12px 0",
                borderBottom: i < navLinks.length - 1 ? "1px solid #1b1b1b" : "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f5f3ef")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#a8a4a0")}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="mt-8">
          <a
            href="https://wa.me/21652526595"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3"
            style={{
              background: "#E11D2A",
              color: "#0a0a0a",
              padding: "16px 22px",
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <span
              className="rounded-full"
              style={{ width: 7, height: 7, background: "#0a0a0a", display: "inline-block" }}
            />
            Réserver via WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
