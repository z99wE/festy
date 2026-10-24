import React from "react";
import { ArrowRight, Sparkles, ShieldCheck, Clock, FileSpreadsheet, Building2, Users } from "lucide-react";

interface LandingCollectionsProps {
  onExploreDemoEvent: (eventId: string) => void;
  onSelectBudgetTemplate: () => void;
}

export const LandingCollections: React.FC<LandingCollectionsProps> = ({
  onExploreDemoEvent,
  onSelectBudgetTemplate,
}) => {
  const features = [
    {
      icon: FileSpreadsheet,
      title: "Decimal Ledger Safety",
      description: "Deterministic integer-scaled decimal mathematics with 0% floating point errors across low, likely, and high estimates.",
      badge: "Financial Core",
      actionText: "Inspect Jaipur Blueprint",
      action: () => onExploreDemoEvent("evt_wedding_jaipur"),
    },
    {
      icon: Clock,
      title: "45s Synthesis Engine",
      description: "Generates minute-by-minute run-of-show cues, stage transitions, catering waves, and contingency playbooks in seconds.",
      badge: "Real-Time Ops",
      actionText: "Inspect Summit Blueprint",
      action: () => onExploreDemoEvent("evt_apex_summit"),
    },
    {
      icon: ShieldCheck,
      title: "Private Workspace Isolation",
      description: "Strict confidentiality for every client account. Your budgets, contracts, and vendor rosters remain completely protected.",
      badge: "Enterprise Security",
      actionText: "Explore Private Template",
      action: onSelectBudgetTemplate,
    },
  ];

  return (
    <section
      role="region"
      aria-label="Feature Grid"
      style={{
        padding: "80px 0",
        backgroundColor: "#ffe17c",
        borderTop: "2px solid #000000",
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
            Production Architectures & Blueprints
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "#171e19",
              fontSize: "17px",
              maxWidth: "680px",
              margin: "0 auto",
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Explore verified event blueprints loaded with real vendor ledgers, cue sheets, and risk mitigation buffers.
          </p>
        </div>

        {/* 3-Column Grid of White Cards with 2px border and 4px hard shadow */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px",
          }}
        >
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="feature-card"
                style={{
                  backgroundColor: "#ffffff",
                  border: "2px solid #000000",
                  borderRadius: "12px",
                  boxShadow: "4px 4px 0px 0px #000000",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div>
                  {/* Top: 16x16 icon box in #b7c6c2 that turns #ffe17c on hover */}
                  <div
                    className="feature-icon-box"
                    style={{
                      width: "48px",
                      height: "48px",
                      backgroundColor: "#b7c6c2",
                      border: "2px solid #000000",
                      borderRadius: "8px",
                      boxShadow: "2px 2px 0px 0px #000000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <Icon size={24} color="#000000" />
                  </div>

                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      backgroundColor: "#f4f4f5",
                      border: "2px solid #000000",
                      borderRadius: "9999px",
                      fontSize: "11px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "14px",
                    }}
                  >
                    {item.badge}
                  </span>

                  {/* Heading in Cabinet Grotesk 2xl */}
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "24px",
                      fontWeight: 800,
                      color: "#000000",
                      marginBottom: "12px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "15px",
                      color: "#4a5568",
                      lineHeight: 1.6,
                      marginBottom: "28px",
                      fontWeight: 500,
                    }}
                  >
                    {item.description}
                  </p>
                </div>

                <button
                  aria-label={item.actionText}
                  type="button"
                  onClick={item.action}
                  className="btn btn-secondary btn-sm"
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                  }}
                >
                  <span>{item.actionText}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
