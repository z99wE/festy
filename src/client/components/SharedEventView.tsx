import React from "react";
import { Sparkles, Calendar, MapPin, Users, DollarSign, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Event, Plan, BudgetItem, Task, Vendor, Idea, RunOfShowItem } from "../../types/index.ts";
import { formatMoney } from "../../utils/money.ts";

interface SharedEventViewProps {
  event: Event;
  plan: Plan | null;
  budgetItems: BudgetItem[];
  tasks: Task[];
  vendors: Vendor[];
  ideas: Idea[];
  runOfShow: RunOfShowItem[];
  allowedSections: string[];
  role: string;
  onExitPreview: () => void;
}

export const SharedEventView: React.FC<SharedEventViewProps> = ({
  event,
  plan,
  budgetItems,
  tasks,
  vendors,
  ideas,
  runOfShow,
  allowedSections,
  role,
  onExitPreview,
}) => {
  return (
    <div style={{ minHeight: "100vh", background: "var(--canvas)", paddingBottom: "80px" }}>
      {/* Top Banner */}
      <div
        style={{
          background: "var(--ink)",
          color: "#FFFFFF",
          padding: "12px 0",
          fontSize: "13px",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>
            🔒 Viewing read-only client proposal for <strong>{event.name}</strong>
          </span>
          <button
            aria-label="Exit client preview"
            onClick={onExitPreview}
            style={{
              color: "var(--sunshine)",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            ← Exit Preview Mode
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--surface-border)", padding: "40px 0" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <div className="badge badge-coral" style={{ marginBottom: "12px" }}>
            Event Proposal & Operations
          </div>
          <h1 className="serif-heading" style={{ fontSize: "38px", color: "var(--ink)", marginBottom: "14px" }}>
            {event.name}
          </h1>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "14px", color: "var(--ink-secondary)" }}>
            <div>🗓️ {event.startDate ? event.startDate : "Date Pending Confirmation"}</div>
            {event.locationAddress && <div>📍 {event.locationAddress}</div>}
            <div>👥 ~{event.guestCount || "TBD"} guests</div>
            <div>💰 Target Budget: {formatMoney(event.targetBudget, event.currency)}</div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: "900px", paddingTop: "32px", display: "flex", flexDirection: "column", gap: "32px" }}>
        {/* Executive Summary */}
        {allowedSections.includes("summary") && plan && (
          <div className="card">
            <h2 className="serif-heading" style={{ fontSize: "22px", marginBottom: "12px" }}>
              Executive Concept
            </h2>
            <p style={{ fontSize: "15px", lineHeight: 1.6, color: "var(--ink)", marginBottom: "18px" }}>
              {plan.summary}
            </p>

            {plan.assumptions?.length > 0 && (
              <div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "8px" }}>Key Planning Assumptions</h4>
                <ul style={{ listStyle: "disc", paddingLeft: "20px", fontSize: "13.5px", color: "var(--ink-secondary)", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {plan.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Budget */}
        {allowedSections.includes("budget") && budgetItems.length > 0 && (
          <div className="card">
            <h2 className="serif-heading" style={{ fontSize: "22px", marginBottom: "14px" }}>
              Budget Allocations & Quotes
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--surface-border)", textAlign: "left" }}>
                  <th style={{ padding: "8px 0" }}>Category / Line Item</th>
                  <th style={{ padding: "8px 0" }}>Estimate</th>
                  <th style={{ padding: "8px 0" }}>Quote</th>
                  <th style={{ padding: "8px 0" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {budgetItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--surface-border)" }}>
                    <td style={{ padding: "10px 0", fontWeight: 600 }}>
                      {item.label} <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>({item.category})</span>
                    </td>
                    <td style={{ padding: "10px 0" }}>
                      {formatMoney(item.likelyEstimate || item.lowEstimate, item.currency)}
                    </td>
                    <td style={{ padding: "10px 0", fontWeight: 700 }}>
                      {item.quotedAmount ? formatMoney(item.quotedAmount, item.currency) : "—"}
                    </td>
                    <td style={{ padding: "10px 0" }}>
                      <span className="badge badge-neutral" style={{ textTransform: "capitalize" }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Timeline */}
        {allowedSections.includes("timeline") && tasks.length > 0 && (
          <div className="card">
            <h2 className="serif-heading" style={{ fontSize: "22px", marginBottom: "14px" }}>
              Milestones & Timeline Checklist
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {tasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    background: "var(--surface-alt)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "13.5px",
                  }}
                >
                  <CheckCircle2 size={16} color={t.status === "done" ? "var(--mint)" : "var(--ink-muted)"} />
                  <span style={{ fontWeight: 600, textDecoration: t.status === "done" ? "line-through" : "none" }}>
                    {t.title}
                  </span>
                  {t.dueDate && <span style={{ fontSize: "12px", color: "var(--ink-muted)", marginLeft: "auto" }}>Due: {t.dueDate}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vendors */}
        {allowedSections.includes("vendors") && vendors.length > 0 && (
          <div className="card">
            <h2 className="serif-heading" style={{ fontSize: "22px", marginBottom: "14px" }}>
              Confirmed & Shortlisted Partners
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {vendors.map((v) => (
                <div key={v.id} style={{ padding: "12px", background: "var(--surface-alt)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "11px", color: "var(--ink-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    {v.category}
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 700, marginTop: "2px" }}>{v.name}</div>
                  {v.quoteAmount && (
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--coral)", marginTop: "4px" }}>
                      Quote: {formatMoney(v.quoteAmount, v.quoteCurrency || event.currency)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Run of Show */}
        {allowedSections.includes("runOfShow") && runOfShow.length > 0 && (
          <div className="card">
            <h2 className="serif-heading" style={{ fontSize: "22px", marginBottom: "14px" }}>
              Event Day Schedule (Run-of-Show)
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {runOfShow.map((ros) => (
                <div key={ros.id} style={{ display: "flex", gap: "16px", padding: "8px 0", borderBottom: "1px solid var(--surface-border)" }}>
                  <div style={{ fontWeight: 800, color: "var(--coral)", width: "70px" }}>{ros.timeLabel}</div>
                  <div style={{ fontWeight: 600 }}>{ros.activity}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
