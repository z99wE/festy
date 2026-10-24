import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ReactBitsDust } from "../festive/ReactBitsDust.tsx";

interface LandingCTAProps {
  onStartPlanning: () => void;
  onGoToPricing: () => void;
}

export const LandingCTA: React.FC<LandingCTAProps> = ({ onStartPlanning, onGoToPricing }) => {
  return (
    <section
      className="festive-ambient-canvas"
      style={{
        padding: "100px 0 90px",
        background: "linear-gradient(180deg, #10131E 0%, var(--surface) 100%)",
        borderTop: "2px solid var(--surface-border)",
        textAlign: "center",
        position: "relative",
      }}
    >
      <ReactBitsDust />

      <div className="container" style={{ maxWidth: "840px", position: "relative", zIndex: 1 }}>
        {/* Celebrating Duo Mascots */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "28px",
          }}
        >
          <img
            src="/mascot-pink.png"
            alt="Fluffy Pink Mascot Celebrating"
            className="mascot-waving-plush"
            style={{ width: "95px" }}
          />
          <div
            className="mascot-speech-bubble"
            style={{
              background: "#FFD026",
              borderColor: "#000000",
              color: "#000000",
              fontWeight: 900,
              fontSize: "13px",
            }}
          >
            LET'S MAKE YOUR CELEBRATION UNFORGETTABLE! 🎉
          </div>
          <img
            src="/mascot-mint.png"
            alt="Bubble Mint Plush Mascot Celebrating"
            className="mascot-mint-plush"
            style={{ width: "90px" }}
          />
        </div>

        <h2 className="neopop-title" style={{ fontSize: "clamp(30px, 4.8vw, 52px)", color: "#FFFFFF", marginBottom: "16px" }}>
          READY TO DEPLOY YOUR PRODUCTION?
        </h2>
        <p style={{ color: "var(--ink-secondary)", fontSize: "16px", marginBottom: "36px", lineHeight: 1.6 }}>
          Run your next milestone on an immutable ledger. Zero credit card required. Free tier includes full workspace access, Festi AI copilot, and PDF exports.
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "36px" }}>
          <button
            aria-label="Launch Event Workspace Now"
            type="button"
            onClick={onStartPlanning}
            className="btn btn-primary"
            style={{ padding: "16px 36px", fontSize: "14px" }}
          >
            <span>START PLANNING FREE</span>
            <ArrowRight size={18} />
          </button>
          <button
            aria-label="View Pricing and Workspace Entitlements"
            type="button"
            onClick={onGoToPricing}
            className="btn btn-secondary"
            style={{ padding: "16px 32px", fontSize: "14px" }}
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
