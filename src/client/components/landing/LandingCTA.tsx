import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface LandingCTAProps {
  onStartPlanning: () => void;
  onGoToPricing: () => void;
}

export const LandingCTA: React.FC<LandingCTAProps> = ({ onStartPlanning, onGoToPricing }) => {
  return (
    <section
      style={{
        padding: "80px 0",
        background: "var(--canvas)",
        borderTop: "1px solid var(--surface-border)",
        textAlign: "center",
      }}
    >
      <div className="container" style={{ maxWidth: "720px" }}>
        <h2 className="serif-heading" style={{ fontSize: "36px", marginBottom: "16px" }}>
          Ready to orchestrate your next milestone?
        </h2>
        <p style={{ color: "var(--ink-secondary)", fontSize: "17px", marginBottom: "28px", lineHeight: 1.5 }}>
          Join event producers and hosts delivering extraordinary celebrations on time, on budget, and without the stress.
        </p>

        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
          <button
            aria-label="Start Planning for Free"
            onClick={onStartPlanning}
            className="btn btn-primary"
            style={{ padding: "12px 28px", fontSize: "15px", fontWeight: 700 }}
          >
            <span>Start Planning — Free</span>
            <ArrowRight size={16} />
          </button>
          <button
            aria-label="View Pricing & Workspace Entitlements"
            onClick={onGoToPricing}
            className="btn btn-secondary"
            style={{ padding: "12px 24px", fontSize: "15px", fontWeight: 600 }}
          >
            View Pricing & Plans
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px", fontSize: "12px", color: "var(--ink-muted)", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle2 size={13} color="var(--mint)" /> 2 Active events on Free Tier
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle2 size={13} color="var(--mint)" /> No credit card required
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle2 size={13} color="var(--mint)" /> Exportable markdown & JSON
          </span>
        </div>
      </div>
    </section>
  );
};
