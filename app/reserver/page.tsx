"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Nav from "@/components/Nav";
import type { Car } from "@/lib/db";

const LOCATIONS = [
  "Tunis-Carthage",
  "Aéroport Tunis-Carthage",
  "Centre-ville Tunis",
  "Sousse",
  "Sfax",
  "Djerba",
  "Hammamet",
  "Monastir",
];

// Compute a suggested negotiation price based on duration
function suggestDiscount(officialTotal: number, days: number): number | null {
  if (days >= 30) return Math.round(officialTotal * 0.7);   // −30%
  if (days >= 14) return Math.round(officialTotal * 0.8);   // −20%
  if (days >= 7)  return Math.round(officialTotal * 0.85);  // −15%
  return null; // no suggestion for short rentals
}

function ReservationContent() {
  const router = useRouter();
  const params = useSearchParams();

  const carId     = params.get("carId");
  const startDate = params.get("startDate") ?? "";
  const endDate   = params.get("endDate") ?? "";
  const category  = params.get("category") ?? "all";
  const pickup    = params.get("pickup") ?? "";
  const returnLoc = params.get("returnLoc") ?? "";

  const [cars, setCars]                   = useState<Car[]>([]);
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar]     = useState<Car | null>(null);
  const [loading, setLoading]             = useState(true);

  // Personal info
  const [userName, setUserName]         = useState("");
  const [userPhone, setUserPhone]       = useState("");
  const [userAge, setUserAge]           = useState("");
  const [userPermisDate, setPermisDate] = useState("");

  // Dates & locations
  const [fStartDate, setFStartDate] = useState(startDate);
  const [fEndDate,   setFEndDate]   = useState(endDate);
  const [fPickup,    setFPickup]    = useState(pickup || "Tunis-Carthage");
  const [fReturn,    setFReturn]    = useState(returnLoc || "Tunis-Carthage");

  // Negotiation
  const [wantsNegotiate,    setWantsNegotiate]   = useState(false);
  const [proposedPrice,     setProposedPrice]     = useState("");
  const [negotiationNote,   setNegotiationNote]   = useState("");

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState("");

  const today = new Date().toISOString().split("T")[0];

  const days = fStartDate && fEndDate
    ? Math.max(1, Math.round(
        (new Date(fEndDate).getTime() - new Date(fStartDate).getTime()) / (1000 * 60 * 60 * 24)
      ))
    : 0;

  const officialTotal = selectedCar && days > 0 ? selectedCar.pricePerDay * days : 0;
  const discountSuggestion = officialTotal > 0 ? suggestDiscount(officialTotal, days) : null;

  useEffect(() => {
    fetch("/api/cars")
      .then((r) => r.json())
      .then((data: Car[]) => {
        setCars(data);
        if (carId) {
          const found = data.find((c) => c.id === carId);
          if (found) setSelectedCar(found);
        }
      });
  }, [carId]);

  useEffect(() => {
    if (!fStartDate || !fEndDate) { setAvailableCars(cars); setLoading(false); return; }
    setLoading(true);
    fetch(`/api/availability?startDate=${fStartDate}&endDate=${fEndDate}&category=${category}`)
      .then((r) => r.json())
      .then((data) => setAvailableCars(data.available ?? []))
      .finally(() => setLoading(false));
  }, [fStartDate, fEndDate, category, cars]);

  // Pre-fill proposed price when toggling negotiate on
  useEffect(() => {
    if (wantsNegotiate && discountSuggestion && !proposedPrice) {
      setProposedPrice(String(discountSuggestion));
    }
  }, [wantsNegotiate, discountSuggestion, proposedPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: selectedCar?.id,
          userName,
          userPhone,
          userAge:        userAge       ? Number(userAge) : undefined,
          userPermisDate: userPermisDate ? `${userPermisDate} ans` : undefined,
          pickupLocation: fPickup,
          returnLocation: fReturn,
          startDate:      fStartDate,
          endDate:        fEndDate,
          category,
          proposedPrice:    wantsNegotiate && proposedPrice ? Number(proposedPrice) : undefined,
          negotiationNote:  wantsNegotiate && negotiationNote ? negotiationNote : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Une erreur est survenue");
      else setSuccess(true);
    } catch {
      setError("Impossible d'envoyer la demande. Contactez-nous sur WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,.03)",
    border: "1px solid #1b1b1b",
    borderRadius: 2,
    padding: "12px 14px",
    fontSize: 14,
    color: "#f5f3ef",
    colorScheme: "dark" as const,
  };
  const labelStyle = {
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "#6b6864",
    display: "block",
    marginBottom: 6,
  };
  const sectionTitle = {
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "#6b6864",
    marginBottom: 14,
    fontWeight: 500 as const,
    paddingTop: 4,
    borderTop: "1px solid #1b1b1b",
  };

  // ── Success screen ────────────────────────────────────────────────────────

  if (success) {
    const finalProposed = wantsNegotiate && proposedPrice ? Number(proposedPrice) : null;
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)", padding: "clamp(16px, 4vw, 32px)" }}>
        <div style={{ background: "#121212", border: "1px solid #1b1b1b", borderRadius: 4, padding: "clamp(24px, 5vw, 48px)", maxWidth: 540, width: "100%", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 24px" }}>
            ✓
          </div>
          <h2 className="display" style={{ fontSize: 40, color: "#22c55e", marginBottom: 16, lineHeight: 1.1 }}>
            Demande envoyée !
          </h2>
          <p style={{ color: "#a8a4a0", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
            Ahmed Mlik vous appellera très prochainement au{" "}
            <strong style={{ color: "#f5f3ef" }}>{userPhone}</strong> pour confirmer votre réservation.
          </p>
          {finalProposed && officialTotal > 0 && (
            <div style={{ background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.25)", borderRadius: 4, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#f5f3ef" }}>
              🤝 Votre contre-offre de{" "}
              <strong style={{ color: "#f59e0b" }}>{finalProposed} DT</strong> a été transmise à Ahmed.{" "}
              Il vous rappellera pour confirmer le tarif final.
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/21652526595?text=${encodeURIComponent(
                `Bonjour, j'ai fait une demande de réservation.\nNom: ${userName} | Tél: ${userPhone}\nVoiture: ${selectedCar?.brand ?? "non spécifié"} ${selectedCar?.model ?? ""}\nDu ${fStartDate} au ${fEndDate}${finalProposed ? `\nContre-offre: ${finalProposed} DT` : ""}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: "#22c55e", color: "#0a0a0a", padding: "12px 20px", borderRadius: 2, fontWeight: 600, fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase" }}
            >
              WhatsApp 52 526 595
            </a>
            <button
              onClick={() => router.push("/")}
              style={{ background: "transparent", color: "#a8a4a0", border: "1px solid #232323", padding: "12px 20px", borderRadius: 2, fontWeight: 600, fontSize: 13 }}
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingTop: "clamp(80px, 12vw, 100px)", paddingBottom: 80 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 4vw, 32px)" }}>
        <button
          onClick={() => router.push("/")}
          style={{ color: "#6b6864", fontSize: 13, marginBottom: 28, display: "flex", alignItems: "center", gap: 6 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f5f3ef")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6864")}
        >
          ← Retour à l&apos;accueil
        </button>

        <h1 className="display" style={{ fontSize: "clamp(36px, 6vw, 80px)", marginBottom: 8 }}>
          Réservez votre voiture
        </h1>
        <p style={{ color: "#a8a4a0", fontSize: 15, marginBottom: "clamp(32px, 5vw, 48px)" }}>
          Choisissez un véhicule, renseignez vos informations — Ahmed Mlik vous appellera pour confirmer.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12">
          {/* ── Left: car selection ──────────────────────────────────────── */}
          <div>
            {/* Date bar */}
            <div style={{ background: "#121212", border: "1px solid #1b1b1b", borderRadius: 4, padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6b6864", marginBottom: 14, fontWeight: 500 }}>
                Dates de location
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Date de départ</label>
                  <input type="date" value={fStartDate} min={today} onChange={(e) => setFStartDate(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Date de retour</label>
                  <input type="date" value={fEndDate} min={fStartDate || today} onChange={(e) => setFEndDate(e.target.value)} style={inputStyle} />
                </div>
              </div>
              {days > 0 && (
                <div style={{ marginTop: 10, fontSize: 13, color: "#a8a4a0" }}>
                  Durée: <strong style={{ color: "#f5f3ef" }}>{days} jour{days > 1 ? "s" : ""}</strong>
                  {days >= 7 && <span style={{ color: "#22c55e", marginLeft: 8, fontSize: 12 }}>✓ Tarif dégressif applicable</span>}
                </div>
              )}
            </div>

            {/* Car list */}
            <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6b6864", marginBottom: 14, fontWeight: 500 }}>
              {loading ? "Recherche en cours..." : `${availableCars.length} véhicule${availableCars.length !== 1 ? "s" : ""} disponible${availableCars.length !== 1 ? "s" : ""}`}
            </div>

            <div className="flex flex-col gap-4">
              {(fStartDate && fEndDate ? availableCars : cars).map((car) => {
                const isSelected = selectedCar?.id === car.id;
                const carTotal = days > 0 ? car.pricePerDay * days : null;
                return (
                  <div
                    key={car.id}
                    onClick={() => setSelectedCar(isSelected ? null : car)}
                    style={{
                      background: isSelected ? "rgba(225,29,42,.06)" : "#121212",
                      border: isSelected ? "1px solid #E11D2A" : "1px solid #1b1b1b",
                      borderRadius: 4,
                      padding: 20,
                      cursor: "pointer",
                      display: "flex",
                      gap: 20,
                      alignItems: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ width: 80, height: 52, background: "#0c0c0c", borderRadius: 2, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Image src={car.image?.startsWith("http") ? car.image : `/assets/${car.image}`} alt={`${car.brand} ${car.model}`} width={120} height={72} style={{ objectFit: "contain", width: "100%", height: "100%" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: 10, color: "#6b6864", letterSpacing: "0.14em", marginBottom: 2 }}>{car.badge}</div>
                      <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: "clamp(16px, 3vw, 22px)", lineHeight: 1, marginBottom: 4 }}>{car.brand} {car.model}</div>
                      <div style={{ fontSize: 11, color: "#a8a4a0" }}>{car.places}p · {car.boite}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: "clamp(22px, 4vw, 32px)", lineHeight: 1 }}>{car.pricePerDay}</div>
                      <div style={{ fontSize: 10, color: "#6b6864" }}>DT/jour</div>
                      {carTotal && (
                        <div style={{ fontSize: 12, color: "#a8a4a0", marginTop: 2 }}>{carTotal} DT</div>
                      )}
                    </div>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: isSelected ? "none" : "2px solid #232323", background: isSelected ? "#E11D2A" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0a" }}>
                      {isSelected ? "✓" : ""}
                    </div>
                  </div>
                );
              })}

              {fStartDate && fEndDate && availableCars.length === 0 && !loading && (
                <div style={{ padding: 24, background: "rgba(225,29,42,.06)", border: "1px solid rgba(225,29,42,.2)", borderRadius: 4, textAlign: "center" }}>
                  <p style={{ color: "#a8a4a0", fontSize: 14, marginBottom: 12 }}>Aucun véhicule disponible pour ces dates exactes.</p>
                  <a href="https://wa.me/21652526595" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 4, background: "#22c55e", color: "#0a0a0a", padding: "10px 18px", borderRadius: 2, fontWeight: 600, fontSize: 13 }}>
                    WhatsApp 52 526 595
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: reservation form ───────────────────────────────────── */}
          <div style={{ background: "#121212", border: "1px solid #1b1b1b", borderRadius: 4, padding: "clamp(20px, 4vw, 28px)", alignSelf: "start" }} className="lg:sticky lg:top-24">
            {/* Selected car summary */}
            {selectedCar && days > 0 && (
              <div style={{ background: "#0c0c0c", border: "1px solid #232323", borderRadius: 2, padding: "10px 14px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
                <div className="flex-1">
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{selectedCar.brand} {selectedCar.model}</div>
                  <div style={{ fontSize: 11, color: "#6b6864" }}>
                    {selectedCar.pricePerDay} DT/jour · <strong style={{ color: "#f5f3ef" }}>{officialTotal} DT</strong> total ({days}j)
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* ── Section: infos personnelles ──────────────────────────── */}
              <div style={sectionTitle}>Informations personnelles</div>

              <div>
                <label style={labelStyle}>Prénom et nom *</label>
                <input type="text" required value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Ahmed Ben Ali" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Numéro de téléphone *</label>
                <input type="tel" required value={userPhone} onChange={(e) => setUserPhone(e.target.value)} placeholder="+216 52 000 000" style={inputStyle} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Âge *</label>
                  <input
                    type="number"
                    required
                    min={18}
                    max={80}
                    value={userAge}
                    onChange={(e) => setUserAge(e.target.value)}
                    placeholder="25"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Permis depuis (ans)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={userPermisDate}
                    onChange={(e) => setPermisDate(e.target.value)}
                    placeholder="5"
                    style={inputStyle}
                  />
                </div>
              </div>
              <p style={{ fontSize: 11, color: "#4b4b4b", marginTop: -6 }}>
                Nombre d&apos;années depuis l&apos;obtention du permis — approximatif.
              </p>

              {/* ── Section: lieux ─────────────────────────────────────── */}
              <div style={sectionTitle}>Lieu de livraison / retour</div>

              <div>
                <label style={labelStyle}>Lieu de prise en charge</label>
                <select value={fPickup} onChange={(e) => setFPickup(e.target.value)} style={inputStyle}>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Lieu de retour</label>
                <select value={fReturn} onChange={(e) => setFReturn(e.target.value)} style={inputStyle}>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              {/* ── Section: négociation ─────────────────────────────────── */}
              {selectedCar && days > 0 && (
                <>
                  <div style={sectionTitle}>Tarif</div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0c0c0c", borderRadius: 2, padding: "10px 14px" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#6b6864" }}>Tarif officiel</div>
                      <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 28, lineHeight: 1 }}>{officialTotal} DT</div>
                      <div style={{ fontSize: 11, color: "#6b6864" }}>{selectedCar.pricePerDay} DT × {days} jour{days > 1 ? "s" : ""}</div>
                    </div>
                    {discountSuggestion && (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "#22c55e" }}>Remise longue durée possible</div>
                        <div style={{ fontSize: 13, color: "#22c55e", fontWeight: 600 }}>jusqu&apos;à −{Math.round((1 - discountSuggestion / officialTotal) * 100)}%</div>
                      </div>
                    )}
                  </div>

                  <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={wantsNegotiate}
                      onChange={(e) => setWantsNegotiate(e.target.checked)}
                      style={{ marginTop: 2, width: 16, height: 16, accentColor: "#E11D2A" }}
                    />
                    <div>
                      <div style={{ fontSize: 13, color: "#f5f3ef", fontWeight: 500 }}>Je souhaite proposer un autre tarif</div>
                      <div style={{ fontSize: 12, color: "#6b6864" }}>
                        {discountSuggestion
                          ? `Ahmed peut négocier — surtout pour les longues durées.`
                          : `Vous pouvez soumettre une contre-offre. Ahmed vous recontactera.`}
                      </div>
                    </div>
                  </label>

                  {wantsNegotiate && (
                    <div style={{ background: "rgba(245,158,11,.06)", border: "1px solid rgba(245,158,11,.2)", borderRadius: 4, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div>
                        <label style={{ ...labelStyle, color: "#f59e0b" }}>Votre prix proposé (DT total)</label>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <input
                            type="number"
                            value={proposedPrice}
                            onChange={(e) => setProposedPrice(e.target.value)}
                            min={Math.round(officialTotal * 0.5)}
                            max={officialTotal}
                            placeholder={String(discountSuggestion ?? Math.round(officialTotal * 0.85))}
                            style={{ ...inputStyle, flex: 1, border: "1px solid rgba(245,158,11,.3)" }}
                          />
                          {discountSuggestion && (
                            <button
                              type="button"
                              onClick={() => setProposedPrice(String(discountSuggestion))}
                              style={{ padding: "10px 12px", background: "rgba(34,197,94,.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,.3)", borderRadius: 2, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer" }}
                            >
                              Suggéré: {discountSuggestion} DT
                            </button>
                          )}
                        </div>
                        {proposedPrice && Number(proposedPrice) < officialTotal && (
                          <div style={{ fontSize: 11, color: "#a8a4a0", marginTop: 4 }}>
                            Remise: −{Math.round((1 - Number(proposedPrice) / officialTotal) * 100)}%
                            {Number(proposedPrice) < officialTotal * 0.5 && (
                              <span style={{ color: "#E11D2A", marginLeft: 6 }}>⚠ Offre très basse</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <label style={{ ...labelStyle, color: "#f59e0b" }}>Message (optionnel)</label>
                        <textarea
                          value={negotiationNote}
                          onChange={(e) => setNegotiationNote(e.target.value)}
                          rows={2}
                          placeholder="Ex: location longue durée pour travail, budget limité..."
                          style={{ ...inputStyle, resize: "none", border: "1px solid rgba(245,158,11,.3)" }}
                        />
                      </div>
                      <p style={{ fontSize: 11, color: "#6b6864" }}>
                        ℹ️ Ahmed Mlik examine toutes les offres sérieuses et vous rappellera pour confirmer le tarif final.
                      </p>
                    </div>
                  )}
                </>
              )}

              {error && (
                <div style={{ background: "rgba(225,29,42,.1)", border: "1px solid rgba(225,29,42,.3)", borderRadius: 2, padding: "10px 14px", fontSize: 13, color: "#E11D2A" }}>
                  {error}
                </div>
              )}

              <p style={{ fontSize: 11, color: "#4b4b4b", lineHeight: 1.5 }}>
                En envoyant, vous autorisez MLIK&apos;A à vous contacter pour confirmer la réservation.
              </p>

              <button
                type="submit"
                disabled={submitting || !userName || !userPhone || !userAge || !fStartDate || !fEndDate}
                style={{
                  background: submitting || !userName || !userPhone || !userAge || !fStartDate || !fEndDate ? "#232323" : "#E11D2A",
                  color: submitting || !userName || !userPhone || !userAge || !fStartDate || !fEndDate ? "#6b6864" : "#0a0a0a",
                  border: "none", borderRadius: 2, padding: "14px 20px", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: submitting ? "wait" : "pointer", transition: "all 0.2s",
                }}
              >
                {submitting ? "Envoi en cours..." : "Envoyer la demande →"}
              </button>

              <div style={{ textAlign: "center" }}>
                <a href="https://wa.me/21652526595" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#22c55e" }}>
                  Ou contactez directement sur WhatsApp
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReservationPage() {
  return (
    <>
      <Nav />
      <Suspense fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "#6b6864" }}>
          Chargement...
        </div>
      }>
        <ReservationContent />
      </Suspense>
    </>
  );
}
