import React from "react";
import { ArrowRight, CheckCircle2, Heart, Briefcase, Sparkles } from "lucide-react";

interface DistrictScenesFeedProps {
  onSelectScene: (sceneTitle: string, guestCount: number) => void;
}

export const DistrictScenesFeed: React.FC<DistrictScenesFeedProps> = ({ onSelectScene }) => {
  return (
    <section
      role="region"
      aria-label="Use Case Personas"
      style={{
        padding: "80px 0",
        backgroundColor: "#ffffff",
        borderBottom: "2px solid #000000",
        color: "#000000",
      }}
    >
      <div className="container" style={{ maxWidth: "1160px" }}>
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
            Built for High-Stakes Producers
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "#4a5568",
              fontSize: "17px",
              maxWidth: "680px",
              margin: "0 auto",
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Whether executing multi-day destination weddings, executive leadership summits, or indie festivals — Festiya adapts to your operational scale.
          </p>
        </div>

        {/* 3-Column Bento-Style Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px",
          }}
        >
          {/* Card 1: Sage (#b7c6c2) */}
          <div
            style={{
              backgroundColor: "#b7c6c2",
              border: "2px solid #000000",
              borderRadius: "12px",
              boxShadow: "4px 4px 0px 0px #000000",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: "#000000",
            }}
          >
            <div>
              {/* White Pill Badge at Top */}
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  backgroundColor: "#ffffff",
                  border: "2px solid #000000",
                  fontSize: "11px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "20px",
                }}
              >
                WEDDING PLANNERS & DESIGNERS
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "24px",
                  fontWeight: 800,
                  marginBottom: "12px",
                  letterSpacing: "-0.02em",
                }}
              >
                Multi-Day Destination Celebrations
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  color: "#1f2937",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                  fontWeight: 500,
                }}
              >
                Harmonize Sangeet acoustic riders, palace load-ins, and multi-currency vendor deposits without formula drift.
              </p>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700 }}>
                  <CheckCircle2 size={16} /> Guest dietary & RSVP allocations
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700 }}>
                  <CheckCircle2 size={16} /> Heritage venue contingency playbooks
                </li>
              </ul>
            </div>

            <button
              aria-label="Load Wedding Preset"
              type="button"
              onClick={() => onSelectScene("Jaipur 3-Day Royal Wedding", 180)}
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <span>Load Wedding Preset</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2: Yellow (#ffe17c) with 8px hard shadow */}
          <div
            style={{
              backgroundColor: "#ffe17c",
              border: "2px solid #000000",
              borderRadius: "12px",
              boxShadow: "8px 8px 0px 0px #000000",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: "#000000",
            }}
          >
            <div>
              {/* White Pill Badge at Top */}
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  backgroundColor: "#ffffff",
                  border: "2px solid #000000",
                  fontSize: "11px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "20px",
                }}
              >
                CORPORATE SUMMIT DIRECTORS
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "24px",
                  fontWeight: 800,
                  marginBottom: "12px",
                  letterSpacing: "-0.02em",
                }}
              >
                Executive Summits & Dinners
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  color: "#1f2937",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                  fontWeight: 500,
                }}
              >
                Manage fiber video broadcasts, speaker green rooms, VIP security protocols, and audited vendor contracts.
              </p>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700 }}>
                  <CheckCircle2 size={16} /> Minute-level stage cue sheets
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700 }}>
                  <CheckCircle2 size={16} /> NDA-gated badge allocations
                </li>
              </ul>
            </div>

            <button
              aria-label="Load Summit Preset"
              type="button"
              onClick={() => onSelectScene("Apex Global Leadership Summit", 120)}
              className="btn btn-primary btn-sm"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <span>Load Summit Preset</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 3: Dark Gray (#272727) with white text */}
          <div
            style={{
              backgroundColor: "#272727",
              border: "2px solid #000000",
              borderRadius: "12px",
              boxShadow: "4px 4px 0px 0px #000000",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: "#ffffff",
            }}
          >
            <div>
              {/* White Pill Badge at Top */}
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  border: "2px solid #000000",
                  fontSize: "11px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "20px",
                }}
              >
                INDEPENDENT PRODUCERS
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#ffe17c",
                  marginBottom: "12px",
                  letterSpacing: "-0.02em",
                }}
              >
                Festivals & Curated Popups
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  color: "#b7c6c2",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                  fontWeight: 500,
                }}
              >
                Synthesize acoustic stage waves, artisanal food truck electrical grids, and crowd safety corridors in 45 seconds.
              </p>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>
                  <CheckCircle2 size={16} color="#ffe17c" /> Sound ordinance & curfew guards
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>
                  <CheckCircle2 size={16} color="#ffe17c" /> Instant client share proposal links
                </li>
              </ul>
            </div>

            <button
              aria-label="Load Festival Preset"
              type="button"
              onClick={() => onSelectScene("Aura Sunset Music & Tasting Festival", 250)}
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <span>Load Festival Preset</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
