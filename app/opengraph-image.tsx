import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MLIK'A — Location de Voiture Premium en Tunisie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Red accent line */}
        <div style={{ width: 60, height: 4, background: "#E11D2A", marginBottom: 32, display: "flex" }} />

        {/* Brand */}
        <div style={{ fontSize: 28, color: "#a8a4a0", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, display: "flex" }}>
          MLIK&apos;A
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#f5f3ef",
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            marginBottom: 32,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>LOCATION DE</span>
          <span style={{ color: "#E11D2A" }}>VOITURE</span>
          <span>EN TUNISIE</span>
        </div>

        {/* Subline */}
        <div style={{ fontSize: 22, color: "#a8a4a0", maxWidth: 600, lineHeight: 1.5, display: "flex" }}>
          Flotte récente · Livraison gratuite · Disponible 24h/24
        </div>

        {/* URL */}
        <div style={{ position: "absolute", bottom: 60, right: 80, fontSize: 18, color: "#6b6864", display: "flex" }}>
          mlikrentcar.com
        </div>
      </div>
    ),
    { ...size }
  );
}
