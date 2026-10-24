import React from "react";
import { CheckCircle2, X } from "lucide-react";

export const LandingComparison: React.FC = () => {
  return (
    <section style={{ padding: "90px 0", background: "var(--canvas)", borderBottom: "2px solid var(--surface-border)" }}>
      <div className="container" style={{ maxWidth: "1120px" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <h2 className="neopop-title" style={{ fontSize: "clamp(28px, 4vw, 42px)", color: "#FFFFFF", marginBottom: "16px" }}>
            EXECUTIVE COMPARISON MATRIX
          </h2>
          <p style={{ color: "var(--ink-secondary)", fontSize: "16px", maxWidth: "680px", margin: "0 auto", lineHeight: 1.6 }}>
            Eliminate communication breakdowns, floating spreadsheet formulas, and unaligned vendor contracts with an immutable production ledger.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "28px",
          }}
        >
          {/* Fragmented Way */}
          <div
            className="card"
            style={{
              background: "#0D0F15",
              border: "2px solid var(--surface-border)",
              boxShadow: "6px 6px 0px #000000",
              padding: "36px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(255, 51, 102, 0.15)",
                color: "var(--neopop-crimson)",
                border: "1.5px solid var(--neopop-crimson)",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              LEGACY FRAGMENTATION
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "20px" }}>
              <li style={{ display: "flex", gap: "14px", fontSize: "14px", color: "var(--ink-secondary)", lineHeight: 1.5 }}>
                <X size={18} color="var(--neopop-crimson)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Blank spreadsheet templates and formula errors causing untracked cost overruns.</span>
              </li>
              <li style={{ display: "flex", gap: "14px", fontSize: "14px", color: "var(--ink-secondary)", lineHeight: 1.5 }}>
                <X size={18} color="var(--neopop-crimson)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Vendor quotes buried across WhatsApp, email attachments, and floating PDF drafts.</span>
              </li>
              <li style={{ display: "flex", gap: "14px", fontSize: "14px", color: "var(--ink-secondary)", lineHeight: 1.5 }}>
                <X size={18} color="var(--neopop-crimson)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Unsynchronized day-of cues resulting in catering, audio, and guest schedule collisions.</span>
              </li>
              <li style={{ display: "flex", gap: "14px", fontSize: "14px", color: "var(--ink-secondary)", lineHeight: 1.5 }}>
                <X size={18} color="var(--neopop-crimson)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Zero real-time scenario modeling when guest headcount surges or weather forces shifts.</span>
              </li>
            </ul>
          </div>

          {/* Festiya Operating System */}
          <div
            className="card"
            style={{
              background: "var(--surface)",
              border: "2px solid var(--neopop-mint)",
              boxShadow: "6px 6px 0px #000000",
              padding: "36px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                background: "rgba(0, 229, 153, 0.15)",
                color: "var(--neopop-mint)",
                border: "1.5px solid var(--neopop-mint)",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              FESTIYA PRODUCTION LEDGER
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "20px" }}>
              <li style={{ display: "flex", gap: "14px", fontSize: "14px", color: "#FFFFFF", fontWeight: 600, lineHeight: 1.5 }}>
                <CheckCircle2 size={18} color="var(--neopop-mint)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Decimal-safe ledger tracking low, likely, and high estimates against committed actuals.</span>
              </li>
              <li style={{ display: "flex", gap: "14px", fontSize: "14px", color: "#FFFFFF", fontWeight: 600, lineHeight: 1.5 }}>
                <CheckCircle2 size={18} color="var(--neopop-mint)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Centralized partner pipeline with contract milestones, deposit logs, and contact sheets.</span>
              </li>
              <li style={{ display: "flex", gap: "14px", fontSize: "14px", color: "#FFFFFF", fontWeight: 600, lineHeight: 1.5 }}>
                <CheckCircle2 size={18} color="var(--neopop-mint)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Minute-by-minute run of show cue board with owner tags, public view links, and export.</span>
              </li>
              <li style={{ display: "flex", gap: "14px", fontSize: "14px", color: "#FFFFFF", fontWeight: 600, lineHeight: 1.5 }}>
                <CheckCircle2 size={18} color="var(--neopop-mint)" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Festi Copilot: instant re-balancing of budgets, risk mitigations, and sensory activations.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
