interface SectionHeadProps {
  eyebrow: string;
  headline: React.ReactNode;
}

export default function SectionHead({ eyebrow, headline }: SectionHeadProps) {
  return (
    <div
      className="mb-12 lg:mb-16 mx-auto"
      style={{ maxWidth: 1480 }}
    >
      {/* Mobile: stacked. Desktop: 2-col side by side */}
      <div className="flex flex-col lg:grid lg:gap-12 gap-4" style={{ gridTemplateColumns: "1fr 2fr" }}>
        <div className="flex items-center gap-3">
          <span style={{ width: 24, height: 1, background: "#E11D2A", display: "inline-block", flexShrink: 0 }} />
          <span className="eyebrow">{eyebrow}</span>
        </div>
        <h2
          className="display"
          style={{ fontSize: "clamp(36px, 7vw, 108px)", lineHeight: 0.9 }}
        >
          {headline}
        </h2>
      </div>
    </div>
  );
}
