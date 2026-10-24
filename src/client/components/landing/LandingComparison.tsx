import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export const LandingComparison: React.FC = () => {
  return (
    <section
      role="region"
      aria-label="Problem vs Solution Matrix"
      style={{
        padding: "80px 0",
        backgroundColor: "#ffffff",
        borderBottom: "2px solid #000000",
        color: "#000000",
      }}
    >
      <div className="container" style={{ maxWidth: "1120px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              color: "#000000",
              letterSpacing: "-0.03em",
              marginBottom: "12px",
            }}
          >
            Problem vs Solution
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "#4a5568",
              fontSize: "17px",
              maxWidth: "680px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Eliminate communication breakdowns, floating spreadsheet formulas, and unaligned vendor contracts with an immutable production ledger.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "32px",
          }}
        >
          {/* Card A (Problem): #f4f4f5, 2px dashed gray border, 70% opacity */}
          <div
            style={{
              backgroundColor: "#f4f4f5",
              border: "2px dashed #9ca3af",
              borderRadius: "12px",
              opacity: 0.75,
              padding: "36px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "6px 14px",
                borderRadius: "9999px",
                backgroundColor: "#e4e4e7",
                color: "#18181b",
                border: "2px solid #71717a",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              LEGACY FRAGMENTATION
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "18px" }}>
              <li style={{ display: "flex", gap: "14px", fontSize: "15px", color: "#3f3f46", lineHeight: 1.5, fontWeight: 700 }}>
                <XCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Blank spreadsheets and floating formula errors causing unbudgeted cost overruns.</span>
              </li>
              <li style={{ display: "flex", gap: "14px", fontSize: "15px", color: "#3f3f46", lineHeight: 1.5, fontWeight: 700 }}>
                <XCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Vendor quotes buried across WhatsApp chats, email attachments, and lost PDF drafts.</span>
              </li>
              <li style={{ display: "flex", gap: "14px", fontSize: "15px", color: "#3f3f46", lineHeight: 1.5, fontWeight: 700 }}>
                <XCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Unsynchronized day-of cues resulting in catering, audio, and stage schedule collisions.</span>
              </li>
              <li style={{ display: "flex", gap: "14px", fontSize: "15px", color: "#3f3f46", lineHeight: 1.5, fontWeight: 700 }}>
                <XCircle size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Zero real-time scenario modeling when guest headcount surges or weather forces shifts.</span>
              </li>
            </ul>
          </div>

          {/* Card B (Solution): #ffe17c, 2px solid black border, 8px hard shadow */}
          <div
            style={{
              backgroundColor: "#ffe17c",
              border: "2px solid #000000",
              borderRadius: "12px",
              boxShadow: "8px 8px 0px 0px #000000",
              padding: "36px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "6px 14px",
                borderRadius: "9999px",
                backgroundColor: "#000000",
                color: "#ffe17c",
                border: "2px solid #000000",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              FESTIYA PRODUCTION LEDGER
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "18px" }}>
              <li style={{ display: "flex", gap: "14px", fontSize: "15px", color: "#000000", fontWeight: 700, lineHeight: 1.5 }}>
                <CheckCircle2 size={20} color="#000000" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Decimal-safe ledger tracking low, likely, and high estimates against committed actuals.</span>
              </li>
              <li style={{ display: "flex", gap: "14px", fontSize: "15px", color: "#000000", fontWeight: 700, lineHeight: 1.5 }}>
                <CheckCircle2 size={20} color="#000000" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Centralized partner pipeline with contract milestones, deposit logs, and contact sheets.</span>
              </li>
              <li style={{ display: "flex", gap: "14px", fontSize: "15px", color: "#000000", fontWeight: 700, lineHeight: 1.5 }}>
                <CheckCircle2 size={20} color="#000000" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Minute-by-minute run of show cue board with owner tags, public view links, and export.</span>
              </li>
              <li style={{ display: "flex", gap: "14px", fontSize: "15px", color: "#000000", fontWeight: 700, lineHeight: 1.5 }}>
                <CheckCircle2 size={20} color="#000000" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Festi Copilot: instant re-balancing of budgets, risk mitigations, and sensory activations.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
