import React from "react";
import { CheckCircle2, X } from "lucide-react";

export const LandingComparison: React.FC = () => {
  return (
    <section style={{ padding: "80px 0", background: "var(--surface)" }}>
      <div className="container" style={{ maxWidth: "1080px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 className="serif-heading" style={{ fontSize: "36px", marginBottom: "14px" }}>
            Why elite producers choose Festiya
          </h2>
          <p style={{ color: "var(--ink-secondary)", fontSize: "17px", maxWidth: "620px", margin: "0 auto" }}>
            Traditional event planning is scattered across documents, group chats, and floating spreadsheets. Festiya turns messy coordination into structured execution.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Fragmented Way */}
          <div
            className="card"
            style={{
              background: "var(--surface-alt)",
              border: "1px dashed var(--surface-border)",
              padding: "32px",
            }}
          >
            <div className="badge badge-neutral" style={{ marginBottom: "16px", fontWeight: 700 }}>
              The Fragmented Way
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
              <li style={{ display: "flex", gap: "12px", fontSize: "14px", color: "var(--ink-secondary)" }}>
                <X size={18} color="#E03131" style={{ flexShrink: 0 }} />
                <span>Blank pages and guesswork that lead to missed milestone deadlines</span>
              </li>
              <li style={{ display: "flex", gap: "12px", fontSize: "14px", color: "var(--ink-secondary)" }}>
                <X size={18} color="#E03131" style={{ flexShrink: 0 }} />
                <span>Tracking finances across loose receipts and unformatted spreadsheets</span>
              </li>
              <li style={{ display: "flex", gap: "12px", fontSize: "14px", color: "var(--ink-secondary)" }}>
                <X size={18} color="#E03131" style={{ flexShrink: 0 }} />
                <span>Losing critical vendor agreements and revised quotes in chat threads</span>
              </li>
              <li style={{ display: "flex", gap: "12px", fontSize: "14px", color: "var(--ink-secondary)" }}>
                <X size={18} color="#E03131" style={{ flexShrink: 0 }} />
                <span>Unsynchronized day-of cues where sound, catering, and hosts collide</span>
              </li>
            </ul>
          </div>

          {/* Festiya Operating System */}
          <div
            className="card"
            style={{
              border: "2px solid var(--coral)",
              boxShadow: "0 10px 30px rgba(255, 98, 87, 0.08)",
              padding: "32px",
            }}
          >
            <div className="badge badge-coral" style={{ marginBottom: "16px", fontWeight: 700 }}>
              The Festiya Command Center
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
              <li style={{ display: "flex", gap: "12px", fontSize: "14px", fontWeight: 600 }}>
                <CheckCircle2 size={18} color="var(--mint)" style={{ flexShrink: 0 }} />
                <span>Structured event briefs convert automatically into phase-based task work</span>
              </li>
              <li style={{ display: "flex", gap: "12px", fontSize: "14px", fontWeight: 600 }}>
                <CheckCircle2 size={18} color="var(--mint)" style={{ flexShrink: 0 }} />
                <span>Decimal-safe ledger tracking low/likely/high estimates vs. committed actuals</span>
              </li>
              <li style={{ display: "flex", gap: "12px", fontSize: "14px", fontWeight: 600 }}>
                <CheckCircle2 size={18} color="var(--mint)" style={{ flexShrink: 0 }} />
                <span>Centralized partner CRM with contract status, quotes, and contact sheets</span>
              </li>
              <li style={{ display: "flex", gap: "12px", fontSize: "14px", fontWeight: 600 }}>
                <CheckCircle2 size={18} color="var(--mint)" style={{ flexShrink: 0 }} />
                <span>Live run-of-show cue sheets with lead tags and client proposal sharing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
