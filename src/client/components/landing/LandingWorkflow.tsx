import React from "react";

export const LandingWorkflow: React.FC = () => {
  const steps = [
    {
      step: "01",
      accent: "var(--neopop-mint)",
      title: "PARAMETRIC BRIEFING",
      description: "Define scale, target currency, venue constraints, and cultural or acoustic requirements in under 60 seconds.",
    },
    {
      step: "02",
      accent: "var(--neopop-gold)",
      title: "MULTI-TIER LEDGER LOCK",
      description: "Auto-synthesize low/likely/high budget allocations, milestone task dependencies, and partner contracts.",
    },
    {
      step: "03",
      accent: "var(--neopop-blue)",
      title: "SYNCHRONIZED RUN OF SHOW",
      description: "Deploy minute-by-minute day-of cue sheets with lead tags, vendor load-ins, and client proposal links.",
    },
  ];

  return (
    <section style={{ padding: "90px 0", background: "var(--surface)", borderBottom: "2px solid var(--surface-border)" }}>
      <div className="container" style={{ maxWidth: "1120px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 className="neopop-title" style={{ fontSize: "clamp(28px, 4vw, 42px)", color: "#FFFFFF", marginBottom: "16px" }}>
            THREE-PHASE EXECUTION ENGINE
          </h2>
          <p style={{ color: "var(--ink-secondary)", fontSize: "16px", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
            Engineered to eliminate decision fatigue, spreadsheet drift, and misaligned production cues.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "28px",
          }}
        >
          {steps.map((item) => (
            <div
              key={item.step}
              className="card"
              style={{
                background: "var(--surface-alt)",
                border: "2px solid var(--surface-border-strong)",
                boxShadow: "6px 6px 0px #000000",
                padding: "36px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-sm)",
                  background: "#0C0E14",
                  border: `2px solid ${item.accent}`,
                  color: item.accent,
                  fontWeight: 800,
                  fontSize: "18px",
                  fontFamily: "var(--font-mono)",
                  marginBottom: "20px",
                  boxShadow: "3px 3px 0px #000000",
                }}
              >
                {item.step}
              </div>
              <h3 style={{ fontSize: "18px", marginBottom: "12px", fontWeight: 800, color: "#FFFFFF", letterSpacing: "0.02em" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--ink-secondary)", lineHeight: 1.6 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
