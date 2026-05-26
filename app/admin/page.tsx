"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import type { Car, Reservation } from "@/lib/db";

type ReservationWithCar = Reservation & { car?: Car };

// ── NegotiationConfirm — inline widget for pending reservations with a counter-offer ──
function NegotiationConfirm({
  reservation,
  onConfirm,
  onReject,
}: {
  reservation: ReservationWithCar;
  onConfirm: (finalPrice: number) => Promise<void>;
  onReject: () => void;
}) {
  const [finalPrice, setFinalPrice] = useState(String(reservation.proposedPrice ?? reservation.originalPrice ?? ""));
  const [saving, setSaving] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 180 }}>
      <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>
        🤝 Contre-offre: {reservation.proposedPrice} DT
      </div>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <input
          type="number"
          value={finalPrice}
          onChange={(e) => setFinalPrice(e.target.value)}
          style={{ width: 80, background: "rgba(255,255,255,.05)", border: "1px solid rgba(245,158,11,.4)", borderRadius: 2, padding: "3px 6px", fontSize: 12, color: "#f5f3ef" }}
          placeholder="Prix final"
        />
        <span style={{ fontSize: 11, color: "#6b6864" }}>DT</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <button
          disabled={saving || !finalPrice}
          onClick={async () => { setSaving(true); await onConfirm(Number(finalPrice)); setSaving(false); }}
          style={{ padding: "4px 8px", background: "rgba(34,197,94,.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,.3)", borderRadius: 2, fontSize: 11, fontWeight: 600, cursor: saving ? "wait" : "pointer" }}
        >
          {saving ? "..." : "✓ Confirmer"}
        </button>
        <button
          onClick={onReject}
          style={{ padding: "4px 8px", background: "rgba(225,29,42,.1)", color: "#E11D2A", border: "1px solid rgba(225,29,42,.3)", borderRadius: 2, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
        >
          ✗ Rejeter
        </button>
      </div>
    </div>
  );
}

// ── CloudinaryUpload — image uploader for car form ─────────────────────────
function CloudinaryUpload({ token, onUploaded }: { token: string; onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", headers: { "x-admin-token": token }, body: form });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erreur upload"); return; }
      setPreview(data.url);
      onUploaded(data.url);
    } catch {
      setError("Erreur réseau");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {preview && (
        <div style={{ marginBottom: 8, position: "relative", width: 120, height: 72 }}>
          <Image src={preview} alt="preview" fill style={{ objectFit: "contain", borderRadius: 2 }} />
        </div>
      )}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{ padding: "8px 14px", background: uploading ? "#232323" : "rgba(225,29,42,.12)", color: uploading ? "#6b6864" : "#E11D2A", border: "1px solid rgba(225,29,42,.3)", borderRadius: 2, fontSize: 12, fontWeight: 600, cursor: uploading ? "wait" : "pointer" }}
        >
          {uploading ? "Upload en cours..." : "📷 Choisir une photo"}
        </button>
        <span style={{ fontSize: 11, color: "#6b6864" }}>PNG, JPG, WebP</span>
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      {error && <div style={{ fontSize: 11, color: "#E11D2A", marginTop: 4 }}>{error}</div>}
    </div>
  );
}

type Tab = "reservations" | "fleet" | "add-car" | "settings";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#22c55e",
  rejected: "#E11D2A",
  cancelled: "#6b6864",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  rejected: "Rejeté",
  cancelled: "Annulé",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [token, setToken] = useState("");
  const [tab, setTab] = useState<Tab>("reservations");

  // Data
  const [reservations, setReservations] = useState<ReservationWithCar[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Car form
  const [carForm, setCarForm] = useState<Partial<Car>>({
    badge: "",
    brand: "",
    year: new Date().getFullYear(),
    model: "",
    description: "",
    places: 5,
    boite: "Man.",
    conso: "",
    extra: "A/C",
    pricePerDay: 89,
    available: true,
    featured: false,
    image: "car-placeholder.png",
    category: "citadine",
    unavailableDates: [],
  });
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [carSaving, setCarSaving] = useState(false);
  const [carMsg, setCarMsg] = useState("");

  // Password change
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwSaving, setPwSaving] = useState(false);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwNew !== pwConfirm) { setPwMsg({ ok: false, text: "Les mots de passe ne correspondent pas." }); return; }
    if (pwNew.length < 4) { setPwMsg({ ok: false, text: "Mot de passe trop court (min 4 caractères)." }); return; }
    setPwSaving(true);
    setPwMsg(null);
    const res = await fetch("/api/admin/login", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }),
    });
    const data = await res.json();
    if (res.ok) {
      setPwMsg({ ok: true, text: "✓ Mot de passe mis à jour." });
      setPwCurrent(""); setPwNew(""); setPwConfirm("");
    } else {
      setPwMsg({ ok: false, text: data.error ?? "Erreur." });
    }
    setPwSaving(false);
  };

  const headers = { "Content-Type": "application/json", "x-admin-token": token };

  const loadData = useCallback(async () => {
    setLoadingData(true);
    const [rRes, cRes] = await Promise.all([
      fetch("/api/reservations", { headers: { "x-admin-token": token } }),
      fetch("/api/cars"),
    ]);
    if (rRes.ok) setReservations(await rRes.json());
    if (cRes.ok) setCars(await cRes.json());
    setLoadingData(false);
  }, [token]);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      setAuthed(true);
    } else {
      setLoginError(data.error ?? "Erreur de connexion");
    }
  };

  const updateReservation = async (id: string, status: string, adminNote?: string, finalPrice?: number) => {
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status, adminNote, ...(finalPrice !== undefined ? { finalPrice } : {}) }),
    });
    // Auto-delete rejected reservations
    if (status === "rejected") {
      await fetch(`/api/reservations/${id}`, { method: "DELETE", headers });
    }
    await loadData();
  };

  const deleteCar = async (id: string) => {
    if (!confirm("Supprimer ce véhicule ?")) return;
    await fetch(`/api/cars/${id}`, { method: "DELETE", headers });
    await loadData();
  };

  const toggleAvailability = async (car: Car) => {
    await fetch(`/api/cars/${car.id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ available: !car.available }),
    });
    await loadData();
  };

  const startEditCar = (car: Car) => {
    setCarForm({ ...car });
    setEditingCarId(car.id);
    setTab("add-car");
  };

  const saveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarSaving(true);
    setCarMsg("");
    if (editingCarId) {
      const res = await fetch(`/api/cars/${editingCarId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(carForm),
      });
      if (res.ok) {
        setCarMsg("✓ Véhicule mis à jour");
        setEditingCarId(null);
        setCarForm({
          badge: "", brand: "", year: new Date().getFullYear(), model: "",
          description: "", places: 5, boite: "Man.", conso: "", extra: "A/C",
          pricePerDay: 89, available: true, featured: false, image: "car-placeholder.png",
          category: "citadine", unavailableDates: [],
        });
        setTab("fleet");
      }
    } else {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers,
        body: JSON.stringify(carForm),
      });
      if (res.ok) {
        setCarMsg("✓ Véhicule ajouté");
        setTab("fleet");
      }
    }
    await loadData();
    setCarSaving(false);
  };

  // ── Login screen ──────────────────────────────────────────────────────────

  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(16px, 4vw, 32px)",
        }}
      >
        <div
          style={{
            background: "#121212",
            border: "1px solid #1b1b1b",
            borderRadius: 4,
            padding: 40,
            width: "100%",
            maxWidth: 400,
          }}
        >
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 32, letterSpacing: "0.06em", marginBottom: 4 }}>
              MLIK&apos;A
            </div>
            <div style={{ fontSize: 12, color: "#6b6864", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Panneau d&apos;administration
            </div>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6b6864", display: "block", marginBottom: 6 }}>
                Identifiant
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: "100%", background: "rgba(255,255,255,.03)", border: "1px solid #1b1b1b", borderRadius: 2, padding: "10px 12px", fontSize: 14, color: "#f5f3ef" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6b6864", display: "block", marginBottom: 6 }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", background: "rgba(255,255,255,.03)", border: "1px solid #1b1b1b", borderRadius: 2, padding: "10px 12px", fontSize: 14, color: "#f5f3ef" }}
              />
            </div>
            {loginError && (
              <div style={{ color: "#E11D2A", fontSize: 13 }}>{loginError}</div>
            )}
            <button
              type="submit"
              style={{ background: "#E11D2A", color: "#0a0a0a", border: "none", borderRadius: 2, padding: "12px", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}
            >
              Se connecter
            </button>
          </form>

         
        </div>
      </div>
    );
  }

  // ── Admin dashboard ───────────────────────────────────────────────────────

  const pending = reservations.filter((r) => r.status === "pending").length;
  const inputStyle = {
    width: "100%",
    background: "#0c0c0c",
    border: "1px solid #232323",
    borderRadius: 2,
    padding: "10px 12px",
    fontSize: 13,
    color: "#f5f3ef",
    colorScheme: "dark" as const,
  };
  const labelStyle = { fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#6b6864", display: "block", marginBottom: 6 };

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c0c" }}>
      {/* Top bar — brand fixed left | tabs scrollable | actions fixed right */}
      <div
        style={{
          background: "#050505",
          borderBottom: "1px solid #1b1b1b",
          padding: "0 clamp(12px, 3vw, 32px)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 60,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Brand — hidden on very small screens to save space */}
        <div className="hidden sm:block" style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 18, letterSpacing: "0.06em", flexShrink: 0 }}>
          MLIK&apos;A <span style={{ color: "#6b6864", fontSize: 11 }}>ADMIN</span>
        </div>

        {/* Tabs — scrollable, takes all available space */}
        <div style={{ flex: 1, minWidth: 0, overflowX: "auto", display: "flex", gap: 4, scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}>
          {([
            { id: "reservations", label: "Résas", badge: pending > 0 ? pending : null },
            { id: "fleet", label: "Flotte" },
            { id: "add-car", label: editingCarId ? "Modifier" : "+" },
            { id: "settings", label: "⚙" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "6px 12px",
                background: tab === t.id ? "#E11D2A" : "transparent",
                color: tab === t.id ? "#0a0a0a" : "#a8a4a0",
                border: tab === t.id ? "none" : "1px solid #232323",
                borderRadius: 2,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {t.label}
              {"badge" in t && t.badge && (
                <span style={{ background: tab === t.id ? "#0a0a0a" : "#E11D2A", color: tab === t.id ? "#E11D2A" : "#0a0a0a", borderRadius: 999, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Actions — never hidden */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          <button
            onClick={loadData}
            disabled={loadingData}
            style={{ fontSize: 14, color: "#6b6864", cursor: "pointer", lineHeight: 1 }}
            title="Rafraîchir"
          >
            {loadingData ? "…" : "↺"}
          </button>
          <button
            onClick={() => setAuthed(false)}
            style={{ fontSize: 11, color: "#6b6864", textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer", whiteSpace: "nowrap", padding: "6px 10px", border: "1px solid #1b1b1b", borderRadius: 2 }}
          >
            Quitter
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(16px, 3vw, 32px)" }}>
        {/* Stats row */}
        {tab === "reservations" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "En attente", value: reservations.filter((r) => r.status === "pending").length, color: "#f59e0b" },
              { label: "Confirmées", value: reservations.filter((r) => r.status === "confirmed").length, color: "#22c55e" },
              { label: "Rejetées", value: reservations.filter((r) => r.status === "rejected").length, color: "#E11D2A" },
              { label: "Total", value: reservations.length, color: "#a8a4a0" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "#121212",
                  border: "1px solid #1b1b1b",
                  borderRadius: 4,
                  padding: "16px 18px",
                }}
              >
                <div style={{ fontSize: 10, color: "#6b6864", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 32, color: s.color, lineHeight: 1 }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Reservations tab ─────────────────────────────────────────── */}
        {tab === "reservations" && (
          <div className="flex flex-col gap-3">
            {reservations.length === 0 && (
              <div style={{ background: "#121212", border: "1px solid #1b1b1b", borderRadius: 4, padding: 40, textAlign: "center", color: "#6b6864" }}>
                Aucune réservation
              </div>
            )}
            {reservations.map((r) => (
              <div
                key={r.id}
                style={{
                  background: r.status === "pending" ? "rgba(245,158,11,.04)" : "#121212",
                  border: r.status === "pending" ? "1px solid rgba(245,158,11,.2)" : "1px solid #1b1b1b",
                  borderRadius: 4,
                  padding: "16px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {/* Row 1 — client + status */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{r.userName}</div>
                    <div style={{ fontSize: 11, color: "#6b6864", marginTop: 2 }}>{new Date(r.createdAt).toLocaleDateString("fr-FR")}</div>
                    {r.userAge && (
                      <div style={{ fontSize: 11, color: "#a8a4a0", marginTop: 2 }}>
                        {r.userAge} ans{r.userPermisDate ? ` · permis: ${r.userPermisDate}` : ""}
                      </div>
                    )}
                  </div>
                  <span style={{
                    display: "inline-block", padding: "3px 10px", borderRadius: 2, fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0,
                    background: `${STATUS_COLORS[r.status]}22`, color: STATUS_COLORS[r.status],
                    border: `1px solid ${STATUS_COLORS[r.status]}44`,
                  }}>
                    {STATUS_LABELS[r.status]}
                  </span>
                </div>

                {/* Row 2 — car + dates + price */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, background: "#0c0c0c", borderRadius: 2, padding: "10px 12px" }}>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6b6864", marginBottom: 3 }}>Voiture</div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{r.car ? `${r.car.brand} ${r.car.model}` : "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6b6864", marginBottom: 3 }}>Dates</div>
                    <div style={{ fontSize: 12 }}>{r.startDate}</div>
                    <div style={{ fontSize: 11, color: "#6b6864" }}>→ {r.endDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6b6864", marginBottom: 3 }}>Tarif</div>
                    {r.proposedPrice ? (
                      <div>
                        <div style={{ fontSize: 10, color: "#6b6864", textDecoration: "line-through" }}>{r.originalPrice} DT</div>
                        <div style={{ fontSize: 13, color: "#f59e0b", fontWeight: 600 }}>🤝 {r.proposedPrice} DT</div>
                        {r.finalPrice && <div style={{ fontSize: 11, color: "#22c55e" }}>✓ {r.finalPrice} DT</div>}
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{r.originalPrice ?? "—"} DT</div>
                    )}
                  </div>
                </div>

                {r.negotiationNote && (
                  <div style={{ fontSize: 11, color: "#a8a4a0", fontStyle: "italic", background: "rgba(245,158,11,.05)", borderRadius: 2, padding: "6px 10px", borderLeft: "2px solid rgba(245,158,11,.3)" }}>
                    &ldquo;{r.negotiationNote}&rdquo;
                  </div>
                )}

                {/* Row 3 — actions */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {r.status === "pending" && (
                    r.proposedPrice && !r.finalPrice ? (
                      <NegotiationConfirm reservation={r}
                        onConfirm={async (finalPrice) => { await updateReservation(r.id, "confirmed", undefined, finalPrice); }}
                        onReject={() => updateReservation(r.id, "rejected")} />
                    ) : (
                      <>
                        <button onClick={() => updateReservation(r.id, "confirmed")}
                          style={{ padding: "8px 14px", background: "rgba(34,197,94,.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,.3)", borderRadius: 2, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          ✓ Confirmer
                        </button>
                        <button onClick={() => updateReservation(r.id, "rejected")}
                          style={{ padding: "8px 14px", background: "rgba(225,29,42,.1)", color: "#E11D2A", border: "1px solid rgba(225,29,42,.3)", borderRadius: 2, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          ✗ Rejeter
                        </button>
                      </>
                    )
                  )}
                  <a href={`https://wa.me/${r.userPhone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                    style={{ padding: "8px 14px", background: "rgba(34,197,94,.08)", color: "#22c55e", border: "1px solid rgba(34,197,94,.2)", borderRadius: 2, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                    WhatsApp
                  </a>
                  <a href={`tel:${r.userPhone.replace(/\s/g, "")}`}
                    style={{ padding: "8px 14px", background: "#0c0c0c", color: "#a8a4a0", border: "1px solid #232323", borderRadius: 2, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                    📞 Appeler
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Fleet tab ────────────────────────────────────────────────── */}
        {tab === "fleet" && (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
              <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 22 }}>Flotte ({cars.length})</div>
              <button
                onClick={() => { setEditingCarId(null); setTab("add-car"); }}
                style={{ background: "#E11D2A", color: "#0a0a0a", border: "none", borderRadius: 2, padding: "10px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                + Ajouter voiture
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {cars.map((car) => (
                <div
                  key={car.id}
                  style={{ background: "#121212", border: "1px solid #1b1b1b", borderRadius: 4, padding: "14px 16px", display: "flex", gap: 14, alignItems: "center" }}
                >
                  {/* Photo */}
                  <div style={{ width: 80, height: 52, background: "#0c0c0c", borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
                    <Image
                      src={car.image?.startsWith("http") ? car.image : `/assets/${car.image}`}
                      alt={car.model} width={80} height={52}
                      style={{ objectFit: "contain", width: "100%", height: "100%" }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{car.brand} {car.model}</div>
                    <div style={{ fontSize: 11, color: "#6b6864" }}>{car.year} · {car.boite} · {car.category}</div>
                    <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 18, lineHeight: 1.2, marginTop: 2 }}>
                      {car.pricePerDay} <span style={{ fontSize: 11, color: "#6b6864", fontFamily: "inherit" }}>DT/j</span>
                    </div>
                  </div>

                  {/* Actions stacked vertically */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => toggleAvailability(car)}
                      style={{ padding: "6px 10px", background: car.available ? "rgba(34,197,94,.12)" : "rgba(225,29,42,.1)", color: car.available ? "#22c55e" : "#E11D2A", border: `1px solid ${car.available ? "rgba(34,197,94,.3)" : "rgba(225,29,42,.3)"}`, borderRadius: 2, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                    >
                      {car.available ? "● Dispo" : "✗ Indispo"}
                    </button>
                    <div style={{ display: "flex", gap: 5 }}>
                      <button onClick={() => startEditCar(car)}
                        style={{ flex: 1, padding: "6px 8px", background: "#0c0c0c", color: "#a8a4a0", border: "1px solid #232323", borderRadius: 2, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                        ✎ Éditer
                      </button>
                      <button onClick={() => deleteCar(car.id)}
                        style={{ flex: 1, padding: "6px 8px", background: "rgba(225,29,42,.08)", color: "#E11D2A", border: "1px solid rgba(225,29,42,.25)", borderRadius: 2, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                        ✗
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Add/Edit car tab ──────────────────────────────────────────── */}
        {tab === "add-car" && (
          <div style={{ maxWidth: 700 }}>
            <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 22, marginBottom: 20 }}>
              {editingCarId ? "Modifier le véhicule" : "Ajouter un véhicule"}
            </div>

            {carMsg && (
              <div style={{ background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.3)", borderRadius: 2, padding: "10px 14px", color: "#22c55e", fontSize: 13, marginBottom: 16 }}>
                {carMsg}
              </div>
            )}

            <form
              onSubmit={saveCar}
              style={{ background: "#121212", border: "1px solid #1b1b1b", borderRadius: 4, padding: "clamp(16px, 3vw, 28px)", display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Marque *</label>
                  <input required value={carForm.brand ?? ""} onChange={(e) => setCarForm((f) => ({ ...f, brand: e.target.value }))} style={inputStyle} placeholder="HYUNDAI" />
                </div>
                <div>
                  <label style={labelStyle}>Modèle *</label>
                  <input required value={carForm.model ?? ""} onChange={(e) => setCarForm((f) => ({ ...f, model: e.target.value }))} style={inputStyle} placeholder="i20 Sport" />
                </div>
                <div>
                  <label style={labelStyle}>Année</label>
                  <input
                    type="number"
                    min={2000}
                    max={2030}
                    value={carForm.year || ""}
                    onChange={(e) => setCarForm((f) => ({ ...f, year: e.target.value === "" ? new Date().getFullYear() : Number(e.target.value) }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Badge</label>
                  <input value={carForm.badge ?? ""} onChange={(e) => setCarForm((f) => ({ ...f, badge: e.target.value }))} style={inputStyle} placeholder="CITADINE" />
                </div>
                <div>
                  <label style={labelStyle}>Prix / jour (DT) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={carForm.pricePerDay === 0 ? "" : (carForm.pricePerDay ?? "")}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setCarForm((f) => ({ ...f, pricePerDay: raw === "" ? 0 : Number(raw) }));
                    }}
                    onFocus={(e) => { if (e.target.value === "0") e.target.value = ""; }}
                    placeholder="89"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Catégorie</label>
                  <select value={carForm.category ?? "citadine"} onChange={(e) => setCarForm((f) => ({ ...f, category: e.target.value as Car["category"] }))} style={inputStyle}>
                    <option value="citadine">Citadine</option>
                    <option value="sport">Sport</option>
                    <option value="premium">Premium</option>
                    <option value="suv">SUV</option>
                    <option value="break">Break</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Boîte</label>
                  <select value={carForm.boite ?? "Man."} onChange={(e) => setCarForm((f) => ({ ...f, boite: e.target.value }))} style={inputStyle}>
                    <option value="Man.">Manuelle</option>
                    <option value="Auto">Automatique</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Consommation</label>
                  <input value={carForm.conso ?? ""} onChange={(e) => setCarForm((f) => ({ ...f, conso: e.target.value }))} style={inputStyle} placeholder="5.2L/100km" />
                </div>
                <div>
                  <label style={labelStyle}>Places</label>
                  <input
                    type="number"
                    min={1}
                    max={9}
                    value={carForm.places || ""}
                    onChange={(e) => setCarForm((f) => ({ ...f, places: e.target.value === "" ? 5 : Number(e.target.value) }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Extra</label>
                  <input value={carForm.extra ?? ""} onChange={(e) => setCarForm((f) => ({ ...f, extra: e.target.value }))} style={inputStyle} placeholder="A/C" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Photo du véhicule</label>
                  <CloudinaryUpload
                    token={token}
                    onUploaded={(url) => setCarForm((f) => ({ ...f, image: url }))}
                  />
                  <div style={{ marginTop: 8 }}>
                    <label style={{ ...labelStyle, marginBottom: 4 }}>Ou entrez une URL / nom de fichier local</label>
                    <input value={carForm.image ?? ""} onChange={(e) => setCarForm((f) => ({ ...f, image: e.target.value }))} style={inputStyle} placeholder="https://res.cloudinary.com/... ou car-hyundai.png" />
                  </div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={carForm.description ?? ""}
                  onChange={(e) => setCarForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                  placeholder="Compacte, économe, parfaite pour la ville..."
                />
              </div>

              <div style={{ display: "flex", gap: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#a8a4a0" }}>
                  <input
                    type="checkbox"
                    checked={carForm.available ?? true}
                    onChange={(e) => setCarForm((f) => ({ ...f, available: e.target.checked }))}
                  />
                  Disponible
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#a8a4a0" }}>
                  <input
                    type="checkbox"
                    checked={carForm.featured ?? false}
                    onChange={(e) => setCarForm((f) => ({ ...f, featured: e.target.checked }))}
                  />
                  Mis en avant
                </label>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="submit"
                  disabled={carSaving}
                  style={{
                    flex: 1,
                    background: "#E11D2A",
                    color: "#0a0a0a",
                    border: "none",
                    borderRadius: 2,
                    padding: "12px",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: carSaving ? "wait" : "pointer",
                  }}
                >
                  {carSaving ? "Sauvegarde..." : editingCarId ? "Mettre à jour" : "Ajouter le véhicule"}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingCarId(null); setTab("fleet"); }}
                  style={{
                    background: "transparent",
                    color: "#a8a4a0",
                    border: "1px solid #232323",
                    borderRadius: 2,
                    padding: "12px 18px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Settings tab ──────────────────────────────────────────────── */}
        {tab === "settings" && (
          <div style={{ maxWidth: 480 }}>
            <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 22, marginBottom: 20 }}>
              Paramètres
            </div>

            <form
              onSubmit={changePassword}
              style={{ background: "#121212", border: "1px solid #1b1b1b", borderRadius: 4, padding: "clamp(16px, 3vw, 28px)", display: "flex", flexDirection: "column", gap: 14 }}
            >
              <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 14, letterSpacing: "0.08em", color: "#a8a4a0", marginBottom: 4 }}>
                CHANGER LE MOT DE PASSE
              </div>

              <div>
                <label style={labelStyle}>Mot de passe actuel</label>
                <input
                  type="password"
                  value={pwCurrent}
                  onChange={(e) => setPwCurrent(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label style={labelStyle}>Nouveau mot de passe</label>
                <input
                  type="password"
                  value={pwNew}
                  onChange={(e) => setPwNew(e.target.value)}
                  required
                  minLength={4}
                  style={inputStyle}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label style={labelStyle}>Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  value={pwConfirm}
                  onChange={(e) => setPwConfirm(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="••••••••"
                />
              </div>

              {pwMsg && (
                <div style={{ background: pwMsg.ok ? "rgba(34,197,94,.1)" : "rgba(225,29,42,.1)", border: `1px solid ${pwMsg.ok ? "rgba(34,197,94,.3)" : "rgba(225,29,42,.3)"}`, borderRadius: 2, padding: "10px 14px", color: pwMsg.ok ? "#22c55e" : "#E11D2A", fontSize: 13 }}>
                  {pwMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={pwSaving}
                style={{ background: "#E11D2A", color: "#0a0a0a", border: "none", borderRadius: 2, padding: "12px", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: pwSaving ? "wait" : "pointer" }}
              >
                {pwSaving ? "Sauvegarde..." : "Mettre à jour le mot de passe"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
