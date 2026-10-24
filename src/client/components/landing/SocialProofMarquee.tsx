import React from "react";

const BRANDS = [
  "ACME CORP",
  "GLOBEX PRODUCTIONS",
  "FESTIYA STAGES",
  "APEX LIVE",
  "ROYAL PALACE SUMMIT",
  "SOLOKNUCKLE VIP",
  "HORIZON FESTIVALS",
  "AURORA BANQUETS",
];

export const SocialProofMarquee: React.FC = () => {
  return (
    <section
      role="region"
      aria-label="Partner Brand Marquee"
      style={{
        width: "100%",
        backgroundColor: "#171e19",
        borderTop: "2px solid #000000",
        borderBottom: "2px solid #000000",
        overflow: "hidden",
        padding: "18px 0",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "48px",
          width: "max-content",
          animation: "marqueeScroll 26s linear infinite",
          userSelect: "none",
        }}
      >
        {/* Double array for seamless infinite looping */}
        {[...BRANDS, ...BRANDS].map((brand, idx) => (
          <span
            key={idx}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              color: "#b7c6c2",
              opacity: 0.5,
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: "48px",
            }}
          >
            <span>{brand}</span>
            <span style={{ fontSize: "14px" }}>✦</span>
          </span>
        ))}
      </div>
    </section>
  );
};
