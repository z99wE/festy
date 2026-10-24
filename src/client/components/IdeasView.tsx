import React from "react";
import { Sparkles, Check, Plus, Tag, ArrowRight } from "lucide-react";
import { Idea, Event } from "../../types/index.ts";

interface IdeasViewProps {
  ideas: Idea[];
  event: Event;
  onAcceptIdea: (idea: Idea) => void;
  onOpenAskFestiya: (prompt?: string) => void;
}

export const IdeasView: React.FC<IdeasViewProps> = ({
  ideas,
  event,
  onAcceptIdea,
  onOpenAskFestiya,
}) => {
  const costBadges = {
    low: { class: "badge-mint", label: "Low Cost Impact" },
    medium: { class: "badge-sunshine", label: "Medium Cost Impact" },
    high: { class: "badge-coral", label: "High Cost Impact" },
    unknown: { class: "badge-neutral", label: "Cost Variable" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="card" style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Curated Experiences & Ideas</h3>
            <p style={{ fontSize: "13px", color: "var(--ink-secondary)", marginTop: "2px" }}>
              Tailored concepts that make your event distinct without blowing the budget.
            </p>
          </div>
          <button
            onClick={() => onOpenAskFestiya("Brainstorm 3 surprising sensory guest ideas for this celebration")}
            className="btn btn-secondary btn-sm"
          >
            <Sparkles size={14} color="var(--coral)" />
            <span>Brainstorm new ideas</span>
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {ideas.map((idea) => {
          const cBadge = costBadges[idea.estimatedCostImpact] || costBadges.unknown;
          return (
            <div
              key={idea.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderLeft: idea.isAccepted ? "4px solid var(--mint)" : "1px solid var(--surface-border)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span className="badge badge-neutral">
                    <Tag size={11} />
                    <span>{idea.category}</span>
                  </span>
                  <span className={`badge ${cBadge.class}`}>{cBadge.label}</span>
                </div>

                <h4 style={{ fontSize: "17px", fontWeight: 700, color: "var(--ink)", marginBottom: "8px" }}>
                  {idea.title}
                </h4>

                <p style={{ fontSize: "13.5px", color: "var(--ink-secondary)", lineHeight: 1.55 }}>
                  {idea.description}
                </p>
              </div>

              <div style={{ marginTop: "18px", paddingTop: "12px", borderTop: "1px solid var(--surface-border)" }}>
                {idea.isAccepted ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--mint)", fontSize: "13px", fontWeight: 700 }}>
                    <Check size={16} />
                    <span>Accepted into Plan & Tasks</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onAcceptIdea(idea)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <Plus size={14} />
                    <span>Accept & Add to Tasks</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
