export default function GiantMark() {
  return (
    <div
      style={{
        background: "var(--bg)",
        padding: "60px 32px",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-anton, Anton)",
          fontSize: "clamp(140px, 26vw, 400px)",
          color: "transparent",
          WebkitTextStroke: "1px #232323",
          lineHeight: 0.9,
          letterSpacing: "0.04em",
          userSelect: "none",
        }}
      >
        MLIK&apos;A
      </div>
    </div>
  );
}
