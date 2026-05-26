"use client";
import { useRef, useState, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_CHIPS = [
  "Voyage en famille à Djerba",
  "Tarif 2 semaines",
  "Livraison aéroport",
  "Comparer 2 voitures",
];

function renderBoldRed(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} style={{ color: "#E11D2A", fontWeight: 600 }}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function AIConcierge() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour ! Je suis le concierge IA de **MLIK'A**. Je peux vous aider à choisir votre voiture, vérifier les disponibilités ou répondre à vos questions. Comment puis-je vous aider ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 100);
      // Prevent body scroll on mobile when panel open
      if (isMobile) document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open, isMobile]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = async (text: string) => {
    if (!text.trim() || thinking) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setThinking(true);
    setChipsVisible(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Désolé, une erreur est survenue. Contactez-nous au **52 526 595** sur WhatsApp." },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full"
        style={{
          background: "rgba(10,10,10,.96)",
          border: "1px solid rgba(225,29,42,.2)",
          padding: "10px 18px 10px 10px",
          boxShadow: "0 20px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(225,29,42,.15)",
        }}
      >
        <div className="relative" style={{ width: 38, height: 38 }}>
          <div
            className="pulse-ring absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle, #E11D2A, #8e0d16)", opacity: 0.3 }}
          />
          <div
            className="pulse-ring-2 absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle, #E11D2A, #8e0d16)", opacity: 0.2 }}
          />
          <div
            className="relative grid place-items-center rounded-full"
            style={{
              width: 38,
              height: 38,
              background: "radial-gradient(circle, #E11D2A, #8e0d16)",
              fontFamily: "var(--font-anton, Anton)",
              fontSize: 14,
              color: "#000",
            }}
          >
            IA
          </div>
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 13, letterSpacing: "0.06em" }}>MLIK&apos;A · IA</div>
          <div style={{ fontSize: 10, color: "#6b6864", letterSpacing: "0.04em" }}>Réservez en parlant</div>
        </div>
      </button>
    );
  }

  // Mobile: full-screen overlay. Desktop: fixed 420×640 bottom-right
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        background: "rgba(10,10,10,.98)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }
    : {
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        width: 420,
        maxHeight: 640,
        background: "rgba(10,10,10,.96)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(225,29,42,.1)",
        borderRadius: 8,
        boxShadow: "0 40px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(225,29,42,.1)",
        overflow: "hidden",
      };

  return (
    <div style={panelStyle}>
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4"
        style={{ borderBottom: "1px solid #1b1b1b", flexShrink: 0 }}
      >
        <div className="relative">
          <div
            className="grid place-items-center rounded-full"
            style={{
              width: 42,
              height: 42,
              background: "radial-gradient(circle, #E11D2A, #8e0d16)",
              fontFamily: "var(--font-anton, Anton)",
              fontSize: 15,
              color: "#000",
            }}
          >
            IA
          </div>
          <span
            className="absolute rounded-full"
            style={{ width: 10, height: 10, background: "#22c55e", border: "2px solid #0a0a0a", bottom: 0, right: 0 }}
          />
        </div>
        <div className="flex-1">
          <div style={{ fontFamily: "var(--font-anton, Anton)", fontSize: 18, letterSpacing: "0.04em" }}>MLIK&apos;A — IA</div>
          <div style={{ fontSize: 11, color: "#6b6864" }}>En ligne · répond en quelques secondes</div>
        </div>
        <button
          onClick={() => setOpen(false)}
          style={{ fontSize: 22, color: "#6b6864", padding: "4px 8px", minHeight: 44, minWidth: 44, display: "grid", placeItems: "center" }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = "#f5f3ef")}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = "#6b6864")}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 sm:p-5"
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              maxWidth: "88%",
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user" ? "#E11D2A" : "#121212",
              color: m.role === "user" ? "#0a0a0a" : "#f5f3ef",
              borderRadius: m.role === "user" ? "8px 8px 2px 8px" : "8px 8px 8px 2px",
              padding: "10px 14px",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {renderBoldRed(m.content)}
          </div>
        ))}

        {thinking && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "#121212",
              borderRadius: "8px 8px 8px 2px",
              padding: "12px 16px",
              display: "flex",
              gap: 4,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background: "#6b6864",
                  display: "inline-block",
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
            <style>{`@keyframes pulse { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }`}</style>
          </div>
        )}

        {chipsVisible && messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => send(chip)}
                className="transition-all duration-200"
                style={{
                  padding: "8px 14px",
                  background: "#121212",
                  border: "1px solid #232323",
                  borderRadius: 999,
                  fontSize: 13,
                  color: "#a8a4a0",
                  cursor: "pointer",
                  minHeight: 44,
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.borderColor = "#E11D2A";
                  e.currentTarget.style.color = "#f5f3ef";
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.currentTarget.style.borderColor = "#232323";
                  e.currentTarget.style.color = "#a8a4a0";
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div style={{ borderTop: "1px solid #1b1b1b", padding: "12px 14px", flexShrink: 0 }}>
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Posez votre question..."
            rows={1}
            style={{
              flex: 1,
              background: "#121212",
              border: "1px solid #232323",
              borderRadius: 6,
              padding: "10px 12px",
              fontSize: 14,
              color: "#f5f3ef",
              resize: "none",
              minHeight: 44,
              maxHeight: 120,
              lineHeight: 1.5,
              outline: "none",
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || thinking}
            className="grid place-items-center rounded-full transition-all duration-200"
            style={{
              width: 44,
              height: 44,
              background: input.trim() && !thinking ? "#E11D2A" : "#232323",
              flexShrink: 0,
              fontSize: 16,
              color: input.trim() && !thinking ? "#0a0a0a" : "#6b6864",
            }}
          >
            →
          </button>
        </div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#6b6864",
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Propulsé par Claude · Réponses indicatives
        </div>
      </div>
    </div>
  );
}
