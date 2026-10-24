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
    <section style={{ padding: "80px 0", background: "var(--surface)" }}>
      <div className="container" style={{ maxWidth: "1080px" }}>
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <h2 className="serif-heading" style={{ fontSize: "36px", marginBottom: "12px" }}>
            Production Blueprints
          </h2>
          <p style={{ color: "var(--ink-secondary)", fontSize: "17px" }}>
            Real-world event architectures calibrated with authentic vendor budgets and timelines.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Card 1 */}
          <div className="card" style={{ borderTop: "4px solid var(--coral)", padding: "28px" }}>
            <span className="badge badge-coral" style={{ marginBottom: "12px", fontWeight: 700 }}>Heritage Destination</span>
            <h3 style={{ fontSize: "20px", marginBottom: "8px", fontWeight: 700 }}>Jaipur 3-Day Wedding</h3>
            <p style={{ fontSize: "14px", color: "var(--ink-secondary)", marginBottom: "20px", lineHeight: 1.5 }}>
              180 Guests across palace courtyards: live Manganiyar recitals, artisan thali banquets, and sunset ceremony cue sheets.
            </p>
            <button
              aria-label="View Jaipur Wedding Workspace Demo"
              onClick={() => onExploreDemoEvent("evt_wedding_jaipur")}
              className="btn btn-secondary btn-sm"
              style={{ fontWeight: 600 }}
            >
              <span>Explore Jaipur Workspace</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 2 */}
          <div className="card" style={{ borderTop: "4px solid var(--cobalt)", padding: "28px" }}>
            <span className="badge badge-cobalt" style={{ marginBottom: "12px", fontWeight: 700 }}>Executive Summit</span>
            <h3 style={{ fontSize: "20px", marginBottom: "8px", fontWeight: 700 }}>Apex Global Leadership Dinner</h3>
            <p style={{ fontSize: "14px", color: "var(--ink-secondary)", marginBottom: "20px", lineHeight: 1.5 }}>
              120 VIPs at The Glasshouse NYC: redundant fiber broadcast, encrypted NDA badge control, and keynote audio/video rigging.
            </p>
            <button
              aria-label="View Apex Summit Workspace Demo"
              onClick={() => onExploreDemoEvent("evt_apex_summit")}
              className="btn btn-secondary btn-sm"
              style={{ fontWeight: 600 }}
            >
              <span>Explore Apex Summit Workspace</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 3 */}
          <div className="card" style={{ borderTop: "4px solid var(--sunshine)", padding: "28px" }}>
            <span className="badge badge-sunshine" style={{ marginBottom: "12px", fontWeight: 700 }}>Private Celebration</span>
            <h3 style={{ fontSize: "20px", marginBottom: "8px", fontWeight: 700 }}>Rooftop Sunset Gathering</h3>
            <p style={{ fontSize: "14px", color: "var(--ink-secondary)", marginBottom: "20px", lineHeight: 1.5 }}>
              60 Guests on an urban terrace: micro-lighting rigging, acoustic sets, and artisanal food truck pairings.
            </p>
            <button
              aria-label="Load Rooftop Sunset Blueprint Template"
              onClick={onSelectBudgetTemplate}
              className="btn btn-secondary btn-sm"
              style={{ fontWeight: 600 }}
            >
              <span>Use Rooftop Template</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
