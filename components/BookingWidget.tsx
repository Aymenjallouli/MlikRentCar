"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function BookingWidget() {
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [returnLoc, setReturnLoc] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    setLoading(true);
    const params = new URLSearchParams({
      startDate,
      endDate,
      category,
      pickup: pickup || "À préciser",
      returnLoc: returnLoc || "À préciser",
    });
    router.push(`/reserver?${params.toString()}`);
  };

  const fieldStyle: React.CSSProperties = {
    background: "rgba(255,255,255,.03)",
    border: "1px solid #1b1b1b",
    borderRadius: 2,
    padding: "10px 12px",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 9.5,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#6b6864",
    marginBottom: 6,
    display: "block",
  };

  return (
    <div
      id="book"
      style={{
        background: "rgba(12,12,12,.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid #232323",
        borderRadius: 4,
        padding: "20px",
        width: "100%",
        boxShadow: "0 30px 80px rgba(0,0,0,.6)",
        position: "relative",
        zIndex: 5,
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="rounded-full" style={{ width: 6, height: 6, background: "#E11D2A", display: "inline-block" }} />
        <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#a8a4a0", fontWeight: 500 }}>
          RÉSERVATION RAPIDE
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Location row — 1 col mobile, 2 col sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label style={labelStyle}>Lieu de prise en charge</label>
            <select
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              style={{ ...fieldStyle, width: "100%", color: pickup ? "#f5f3ef" : "#6b6864", fontSize: 13.5 }}
            >
              <option value="">Sélectionner</option>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Lieu de retour</label>
            <select
              value={returnLoc}
              onChange={(e) => setReturnLoc(e.target.value)}
              style={{ ...fieldStyle, width: "100%", color: returnLoc ? "#f5f3ef" : "#6b6864", fontSize: 13.5 }}
            >
              <option value="">Sélectionner</option>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Date row — 1 col mobile, 2 col sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label style={labelStyle}>Date de départ</label>
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={(e) => setStartDate(e.target.value)}
              required
              style={{ ...fieldStyle, width: "100%", color: startDate ? "#f5f3ef" : "#6b6864", fontSize: 13.5, colorScheme: "dark" }}
            />
          </div>
          <div>
            <label style={labelStyle}>Date de retour</label>
            <input
              type="date"
              value={endDate}
              min={startDate || today}
              onChange={(e) => setEndDate(e.target.value)}
              required
              style={{ ...fieldStyle, width: "100%", color: endDate ? "#f5f3ef" : "#6b6864", fontSize: 13.5, colorScheme: "dark" }}
            />
          </div>
        </div>

        <div className="mb-4">
          <label style={labelStyle}>Catégorie de véhicule</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ ...fieldStyle, width: "100%", color: "#f5f3ef", fontSize: 13.5 }}
          >
            <option value="all">Toutes catégories</option>
            <option value="citadine">Citadine</option>
            <option value="sport">Sport</option>
            <option value="premium">Premium</option>
            <option value="suv">SUV</option>
            <option value="break">Break</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !startDate || !endDate}
          className="w-full transition-all duration-200"
          style={{
            background: "#E11D2A",
            color: "#0a0a0a",
            border: "none",
            borderRadius: 2,
            padding: "15px 20px",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            cursor: loading || (!startDate || !endDate) ? "not-allowed" : "pointer",
            opacity: !startDate || !endDate ? 0.6 : 1,
            minHeight: 50,
          }}
        >
          {loading ? "Recherche..." : "Vérifier la disponibilité →"}
        </button>
      </form>
    </div>
  );
}
