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
        padding: "90px 0",
        background: "var(--surface)",
        borderTop: "2px solid var(--surface-border)",
        textAlign: "center",
      }}
    >
      <div className="container" style={{ maxWidth: "800px" }}>
        <h2 className="neopop-title" style={{ fontSize: "clamp(28px, 4.5vw, 48px)", color: "#FFFFFF", marginBottom: "16px" }}>
          READY TO DEPLOY YOUR PRODUCTION?
        </h2>
        <p style={{ color: "var(--ink-secondary)", fontSize: "16px", marginBottom: "36px", lineHeight: 1.6 }}>
          Run your next milestone on an immutable ledger. Zero credit card required. Free tier includes full workspace access and exports.
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "32px" }}>
          <button
            aria-label="Launch Event Workspace Now"
            type="button"
            onClick={onStartPlanning}
            className="btn btn-primary"
            style={{ padding: "14px 32px", fontSize: "14px" }}
          >
            <span>START PLANNING FREE</span>
            <ArrowRight size={18} />
          </button>
          <button
            aria-label="View Pricing and Workspace Entitlements"
            type="button"
            onClick={onGoToPricing}
            className="btn btn-secondary"
            style={{ padding: "14px 28px", fontSize: "14px" }}
          >
            <span>VIEW PRICING & TIERS</span>
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "24px", fontSize: "12px", color: "var(--ink-secondary)", flexWrap: "wrap", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={15} color="var(--neopop-mint)" /> Zero Credit Card
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={15} color="var(--neopop-mint)" /> Full D1 Edge Persistence
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={15} color="var(--neopop-mint)" /> Instant Export & Share
          </span>
        </div>
      </div>
    </section>
  );
};
