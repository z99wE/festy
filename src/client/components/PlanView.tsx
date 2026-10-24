import React from "react";
import { Sparkles, HelpCircle, CheckCircle, RefreshCw, MessageSquare } from "lucide-react";
import { Plan, Event } from "../../types/index.ts";

interface PlanViewProps {
  plan: Plan | null;
  event: Event;
  onOpenAskFestiya: (prompt?: string) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const PlanView: React.FC<PlanViewProps> = ({
  plan,
  event,
  onOpenAskFestiya,
  onRegenerate,
  isRegenerating,
}) => {
  if (!plan) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
        <Sparkles size={36} color="var(--coral)" style={{ margin: "0 auto 16px" }} />
        <h3 className="serif-heading" style={{ fontSize: "22px", marginBottom: "8px" }}>
          No structured plan generated yet
        </h3>
        <p style={{ color: "var(--ink-secondary)", fontSize: "14px", maxWidth: "480px", margin: "0 auto 24px" }}>
          Turn the event brief into an actionable plan with budget allocations, timelines, and partner criteria.
        </p>
        <button
          aria-label="Generate AI plan"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="btn btn-primary"
        >
          <Sparkles size={16} />
          <span>{isRegenerating ? "Generating..." : "Generate AI Plan"}</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Plan Header & Version banner */}
      <div
        className="card"
        style={{
          borderLeft: "5px solid var(--coral)",
          background: "linear-gradient(180deg, #FFFFFF 0%, #FFFDFB 100%)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span className="badge badge-coral">Plan Blueprint v{plan.version}</span>
              <span className="badge badge-neutral">Schema v{plan.schemaVersion}</span>
              <span className="badge badge-mint">Active</span>
            </div>
            <h2 className="serif-heading" style={{ fontSize: "24px", color: "var(--ink)" }}>
              Executive Concept & Strategy
            </h2>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              aria-label="Ask Festiya about concept"
              onClick={() => onOpenAskFestiya("Suggest creative improvements to the executive concept")}
              className="btn btn-secondary btn-sm"
            >
              <MessageSquare size={14} />
              <span>Ask Festiya</span>
            </button>
            <button
              aria-label="Regenerate plan"
              title="Regenerate plan"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="btn btn-secondary btn-sm"
            >
              <RefreshCw size={14} className={isRegenerating ? "spin" : ""} />
              <span>{isRegenerating ? "Updating..." : "Re-synthesize"}</span>
            </button>
          </div>
        </div>

        <p style={{ fontSize: "16px", color: "var(--ink)", lineHeight: 1.65 }}>
          {plan.summary}
        </p>
      </div>

      {/* Assumptions & Open Questions 2-column Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {/* Planning Assumptions */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <CheckCircle size={18} color="var(--mint)" />
            <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Planning Assumptions</h3>
          </div>
          <p style={{ fontSize: "12px", color: "var(--ink-muted)", marginBottom: "14px" }}>
            Core baselines used to determine capacity, timeline, and vendor allocations.
          </p>

          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
            {plan.assumptions?.map((assump, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  gap: "10px",
                  fontSize: "13.5px",
                  color: "var(--ink)",
                  padding: "10px 12px",
                  background: "var(--surface-alt)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--surface-border)",
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: "var(--coral)", fontWeight: 700 }}>•</span>
                <span>{assump}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Unresolved Questions */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <HelpCircle size={18} color="var(--cobalt)" />
            <h3 style={{ fontSize: "17px", fontWeight: 700 }}>Unresolved Questions</h3>
          </div>
          <p style={{ fontSize: "12px", color: "var(--ink-muted)", marginBottom: "14px" }}>
            Key decisions that will unlock subsequent bookings and exact budget confirmations.
          </p>

          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
            {plan.openQuestions?.map((q, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "10px",
                  fontSize: "13.5px",
                  color: "var(--ink)",
                  padding: "10px 12px",
                  background: "var(--cobalt-light)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid #D5DCF8",
                  lineHeight: 1.5,
                }}
              >
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ color: "var(--cobalt)", fontWeight: 700 }}>?</span>
                  <span>{q}</span>
                </div>
                <button
                  aria-label={`Resolve question: ${q}`}
                  onClick={() => onOpenAskFestiya(`Help me decide: ${q}`)}
                  className="badge badge-cobalt"
                  style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  Resolve
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
