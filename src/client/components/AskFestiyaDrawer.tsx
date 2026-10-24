import React, { useState } from "react";
import { X, Sparkles, Send, ArrowRight, Check, AlertCircle, RefreshCw } from "lucide-react";
import { EventPlan, Event } from "../../types/index.ts";

interface AskFestiyaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  initialPrompt?: string;
  onRequestRevision: (instruction: string) => Promise<{ plan: EventPlan; providerUsed: string }>;
  onApplyPlan: (newPlan: EventPlan) => void;
}

export const AskFestiyaDrawer: React.FC<AskFestiyaDrawerProps> = ({
  isOpen,
  onClose,
  event,
  initialPrompt = "",
  onRequestRevision,
  onApplyPlan,
}) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [proposedPlan, setProposedPlan] = useState<EventPlan | null>(null);
  const [applied, setApplied] = useState(false);

  const quickPrompts = [
    "Recalculate budget assuming +25 unexpected guests",
    "Trim 15% across catering and decor line items",
    "Propose a solid contingency plan for sudden outdoor rain",
    "Suggest 3 signature interactive guest experiences",
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;
    setLoading(true);
    setApplied(false);
    try {
      const res = await onRequestRevision(textToSend);
      setProposedPlan(res.plan);
    } catch (err) {
      console.error("Revision error:", err);
      alert("Failed to generate proposed revision. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (proposedPlan) {
      onApplyPlan(proposedPlan);
      setApplied(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Close Ask Festiya drawer overlay"
      className="drawer-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="drawer-panel" role="region" aria-label="Ask Festiya assistant panel">
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--surface-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "var(--coral-light)",
                color: "var(--coral)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="serif-heading" style={{ fontSize: "18px" }}>
                Ask Festiya
              </h3>
              <p style={{ fontSize: "11px", color: "var(--ink-secondary)" }}>
                Refine, recalculate & propose plan adjustments
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "var(--ink-muted)", cursor: "pointer" }} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: "24px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Quick Prompts */}
          <div>
            <label className="form-label" style={{ marginBottom: "8px", display: "block" }}>
              Suggested adjustments:
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  aria-label={qp}
                  onClick={() => {
                    setPrompt(qp);
                    handleSend(qp);
                  }}
                  disabled={loading}
                  style={{
                    textAlign: "left",
                    padding: "8px 12px",
                    background: "var(--surface-alt)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "12.5px",
                    color: "var(--ink)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <span>{qp}</span>
                  <ArrowRight size={13} color="var(--ink-muted)" />
                </button>
              ))}
            </div>
          </div>

          {/* Proposed Plan Preview Box */}
          {proposedPlan && (
            <div
              className="card"
              style={{
                border: "2px solid var(--mint)",
                background: "var(--mint-bg)",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <Check size={16} color="var(--mint)" />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--mint)" }}>
                  Proposed Revision Ready
                </span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--ink)", lineHeight: 1.5, marginBottom: "12px" }}>
                <strong>New Target:</strong> {proposedPlan.budget.currency} {proposedPlan.budget.target?.toLocaleString() || "—"}  
                <br />
                <strong>Latest Assumption:</strong> {proposedPlan.assumptions[0]}
              </p>

              {applied ? (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--mint)", fontWeight: 700, fontSize: "13px" }}>
                  <Check size={16} />
                  <span>Changes Applied to Active Workspace</span>
                </div>
              ) : (
                <button
                  aria-label="Apply proposed revision to workspace"
                  onClick={handleApply}
                  className="btn btn-primary btn-sm"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Apply Proposed Revision to Workspace
                </button>
              )}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--surface-border)" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(prompt);
            }}
            style={{ display: "flex", gap: "8px" }}
          >
            <input
              id="ask-festiya-prompt-input"
              aria-label="Ask Festiya prompt"
              className="form-input"
              placeholder="e.g. Cut budget by 10% or add vegan desserts"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              style={{ fontSize: "13.5px" }}
            />
            <button
              aria-label="Send prompt to Festiya"
              type="submit"
              disabled={loading || !prompt.trim()}
              className="btn btn-primary"
              style={{ padding: "0 16px" }}
            >
              {loading ? <RefreshCw size={16} className="spin" /> : <Send size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
