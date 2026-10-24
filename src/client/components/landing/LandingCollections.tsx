import React from "react";
import { ArrowRight } from "lucide-react";

interface LandingCollectionsProps {
  onExploreDemoEvent: (eventId: string) => void;
  onSelectBudgetTemplate: () => void;
}

export const LandingCollections: React.FC<LandingCollectionsProps> = ({
  onExploreDemoEvent,
  onSelectBudgetTemplate,
}) => {
  return (
    <section style={{ padding: "90px 0", background: "var(--canvas)", borderBottom: "2px solid var(--surface-border)" }}>
      <div className="container" style={{ maxWidth: "1120px" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <h2 className="neopop-title" style={{ fontSize: "clamp(28px, 4vw, 42px)", color: "#FFFFFF", marginBottom: "16px" }}>
            PRODUCTION ARCHITECTURES & BLUEPRINTS
          </h2>
          <p style={{ color: "var(--ink-secondary)", fontSize: "16px", maxWidth: "680px", margin: "0 auto", lineHeight: 1.6 }}>
            Explore verified event blueprints loaded with real vendor ledgers, cue sheets, and risk mitigation buffers.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
            gap: "28px",
          }}
        >
          {/* Card 1 */}
          <div
            className="card"
            style={{
              background: "var(--surface)",
              border: "2px solid var(--surface-border)",
              boxShadow: "6px 6px 0px #000000",
              padding: "36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span className="badge badge-mint" style={{ marginBottom: "16px", display: "inline-block" }}>
                Heritage Destination
              </span>
              <h3 style={{ fontSize: "20px", marginBottom: "12px", fontWeight: 800, color: "#FFFFFF" }}>
                Jaipur 3-Day Royal Wedding
              </h3>
              <p style={{ fontSize: "14px", color: "var(--ink-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
                180 Guests across Jaigarh palace courtyards: live Manganiyar recitals, artisan thali banquets, and sunset ceremony cue sheets (₹45,00,000 ledger).
              </p>
            </div>
            <button
              aria-label="View Jaipur Wedding Workspace Demo"
              type="button"
              onClick={() => onExploreDemoEvent("evt_wedding_jaipur")}
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <span>Explore Jaipur Workspace</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 2 */}
          <div
            className="card"
            style={{
              background: "var(--surface)",
              border: "2px solid var(--surface-border)",
              boxShadow: "6px 6px 0px #000000",
              padding: "36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span className="badge badge-cobalt" style={{ marginBottom: "16px", display: "inline-block" }}>
                Executive Summit
              </span>
              <h3 style={{ fontSize: "20px", marginBottom: "12px", fontWeight: 800, color: "#FFFFFF" }}>
                Apex Global Leadership Dinner
              </h3>
              <p style={{ fontSize: "14px", color: "var(--ink-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
                120 VIPs at The Glasshouse NYC: redundant fiber broadcast, encrypted NDA badge control, and keynote audio/video rigging ($125,000 budget).
              </p>
            </div>
            <button
              aria-label="View Apex Summit Workspace Demo"
              type="button"
              onClick={() => onExploreDemoEvent("evt_apex_summit")}
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <span>Explore Apex Workspace</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 3 */}
          <div
            className="card"
            style={{
              background: "var(--surface)",
              border: "2px solid var(--surface-border)",
              boxShadow: "6px 6px 0px #000000",
              padding: "36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span className="badge badge-sunshine" style={{ marginBottom: "16px", display: "inline-block" }}>
                Private Gathering
              </span>
              <h3 style={{ fontSize: "20px", marginBottom: "12px", fontWeight: 800, color: "#FFFFFF" }}>
                Sunset Terrace Social & Dinner
              </h3>
              <p style={{ fontSize: "14px", color: "var(--ink-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
                50 Guests intimate gathering: acoustic vinyl DJ, craft mixologist bar, and curated zero-waste catering plan ($3,500 target).
              </p>
            </div>
            <button
              aria-label="Load Sunset Terrace Blueprint Template"
              type="button"
              onClick={onSelectBudgetTemplate}
              className="btn btn-secondary btn-sm"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <span>Load Terrace Blueprint</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
