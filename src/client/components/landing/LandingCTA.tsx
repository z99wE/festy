import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface LandingCTAProps {
  onStartPlanning: () => void;
  onGoToPricing: () => void;
}

export const LandingCTA: React.FC<LandingCTAProps> = ({ onStartPlanning, onGoToPricing }) => {
  return (
    <section
      role="region"
      aria-label="Final Call to Action"
      style={{
        padding: "90px 20px",
        backgroundColor: "#ffe17c",
        borderTop: "2px solid #000000",
        borderBottom: "2px solid #000000",
        textAlign: "center",
        position: "relative",
        color: "#000000",
      }}
    >
      <div className="container" style={{ maxWidth: "860px", margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(34px, 5vw, 56px)",
            fontWeight: 800,
            color: "#000000",
            letterSpacing: "-0.04em",
            marginBottom: "16px",
            lineHeight: 1.1,
          }}
        >
          Ready to Deploy Your Next Production?
        </h2>

        <p
          style={{
            fontFamily: "var(--font-body)",
            color: "#171e19",
            fontSize: "18px",
            marginBottom: "36px",
            lineHeight: 1.6,
            maxWidth: "660px",
            margin: "0 auto 36px",
            fontWeight: 500,
          }}
        >
          Run your milestone on an immutable decimal-safe ledger. Zero credit card required. Free tier includes full workspace access, Festi AI copilot, and PDF exports.
        </p>

        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "36px",
          }}
        >
          <button
            aria-label="Start Free Trial Now"
            type="button"
            onClick={onStartPlanning}
            className="btn btn-primary"
            style={{ padding: "16px 36px", fontSize: "15px" }}
          >
            <span>START FREE TRIAL</span>
            <ArrowRight size={18} />
          </button>

          <button
            aria-label="View Pricing and Tiers"
            type="button"
            onClick={onGoToPricing}
            className="btn btn-secondary"
            style={{ padding: "16px 32px", fontSize: "15px" }}
          >
            <span>VIEW TIERS & PRICING</span>
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "28px",
            fontSize: "13px",
            color: "#171e19",
            flexWrap: "wrap",
            fontWeight: 700,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={16} color="#000000" /> Zero Credit Card
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={16} color="#000000" /> Private Workspace Security
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={16} color="#000000" /> Instant Share & Export
          </span>
        </div>
      </div>
    </section>
  );
};
