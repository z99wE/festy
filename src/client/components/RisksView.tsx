import React from "react";
import { AlertTriangle, CheckCircle2, ShieldCheck, ShieldAlert } from "lucide-react";
import { Risk, Event } from "../../types/index.ts";

interface RisksViewProps {
  risks: Risk[];
  event: Event;
  onToggleResolve: (id: string, isResolved: boolean) => void;
  onOpenAskFestiya: (prompt?: string) => void;
}

export const RisksView: React.FC<RisksViewProps> = ({
  risks,
  event,
  onToggleResolve,
  onOpenAskFestiya,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="card" style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Risks & Operational Contingencies</h3>
            <p style={{ fontSize: "13px", color: "var(--ink-secondary)", marginTop: "2px" }}>
              Identified weather, transit, and capacity risks paired with concrete mitigations.
            </p>
          </div>
          <button
            onClick={() => onOpenAskFestiya("Identify weather and vendor delay contingencies for this venue")}
            className="btn btn-secondary btn-sm"
          >
            <ShieldCheck size={14} color="var(--mint)" />
            <span>Stress-test event risks</span>
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {risks.map((risk) => (
          <div
            key={risk.id}
            className="card"
            style={{
              padding: "18px 22px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
              borderLeft: risk.isResolved ? "4px solid var(--mint)" : "4px solid #E67700",
              background: risk.isResolved ? "#FAFAF8" : "var(--surface)",
              opacity: risk.isResolved ? 0.8 : 1,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span className={`badge ${risk.isResolved ? "badge-mint" : "badge-sunshine"}`}>
                  {risk.isResolved ? "Mitigation Secured" : `${risk.severity} Severity`}
                </span>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)" }}>
                  {risk.risk}
                </span>
              </div>
              <p style={{ fontSize: "13.5px", color: "var(--ink-secondary)", lineHeight: 1.5, marginTop: "6px" }}>
                <strong>Mitigation Strategy:</strong> {risk.mitigation}
              </p>
            </div>

            <button
              onClick={() => onToggleResolve(risk.id, !risk.isResolved)}
              className={`btn btn-sm ${risk.isResolved ? "btn-secondary" : "btn-primary"}`}
              style={{ whiteSpace: "nowrap" }}
            >
              {risk.isResolved ? "Mark Unresolved" : "Mark Secured"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
