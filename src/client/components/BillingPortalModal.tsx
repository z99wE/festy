import React, { useState } from "react";
import { X, Check, CreditCard, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { Workspace, SubscriptionTier, Entitlements } from "../../types/index.ts";

interface BillingPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace;
  entitlements: Entitlements | null;
  onUpgradeTier: (targetTier: SubscriptionTier) => Promise<void>;
}

export const BillingPortalModal: React.FC<BillingPortalModalProps> = ({
  isOpen,
  onClose,
  workspace,
  entitlements,
  onUpgradeTier,
}) => {
  if (!isOpen) return null;

  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const tiers = [
    {
      id: "free" as const,
      name: "Free",
      price: "$0",
      description: "For individuals planning occasional celebrations",
      features: [
        "2 active events",
        "5 AI plan generations / month",
        "Core budget & task checklists",
        "Standard currency handling",
      ],
    },
    {
      id: "plus" as const,
      name: "Plus",
      price: "$19/mo",
      description: "For active hosts & passionate family organizers",
      features: [
        "10 active events",
        "30 AI plan revisions / month",
        "Branded client proposal exports",
        "Granular client share links",
        "Custom budget categories",
      ],
    },
    {
      id: "pro" as const,
      name: "Planner Pro",
      price: "$49/mo",
      description: "For independent wedding & event planners",
      features: [
        "50 active events",
        "150 AI generations & revisions",
        "Client proposal portal & approvals",
        "Custom agency branding & logo",
        "Reusable event templates",
      ],
    },
    {
      id: "agency" as const,
      name: "Agency",
      price: "$149/mo",
      description: "For production studios and multi-planner teams",
      features: [
        "500 active events",
        "1,000 AI generations / month",
        "Multi-seat team roles & permissions",
        "Workspace activity audit logs",
        "Priority provider routing",
      ],
    },
  ];

  const handleSelectTier = async (tierId: SubscriptionTier) => {
    setLoadingTier(tierId);
    try {
      await onUpgradeTier(tierId);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Close billing modal overlay"
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="modal-content" style={{ maxWidth: "860px" }} role="dialog" aria-modal="true">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div className="badge badge-mint" style={{ marginBottom: "6px" }}>
              <ShieldCheck size={13} />
              <span>Workspace Entitlements & Billing</span>
            </div>
            <h2 className="serif-heading" style={{ fontSize: "24px" }}>
              Subscription & Usage Meter
            </h2>
            <p style={{ fontSize: "13px", color: "var(--ink-secondary)" }}>
              Workspace: <strong>{workspace.name}</strong> • Current Plan:{" "}
              <strong style={{ textTransform: "uppercase" }}>{workspace.subscriptionTier}</strong>
            </p>
          </div>
          <button onClick={onClose} style={{ color: "var(--ink-muted)", cursor: "pointer" }} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Usage meters */}
        {entitlements && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              padding: "18px",
              background: "var(--surface-alt)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--surface-border)",
              marginBottom: "24px",
            }}
          >
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase" }}>
                Active Events
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, marginTop: "4px" }}>
                {entitlements.currentActiveEvents} / {entitlements.maxActiveEvents}
              </div>
              <div style={{ height: "6px", background: "var(--surface-border)", borderRadius: "3px", marginTop: "8px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, (entitlements.currentActiveEvents / entitlements.maxActiveEvents) * 100)}%`,
                    background: "var(--coral)",
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase" }}>
                AI Generations & Revisions This Month
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, marginTop: "4px" }}>
                {entitlements.usedGenerationsThisMonth} / {entitlements.maxGenerationsPerMonth}
              </div>
              <div style={{ height: "6px", background: "var(--surface-border)", borderRadius: "3px", marginTop: "8px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, (entitlements.usedGenerationsThisMonth / entitlements.maxGenerationsPerMonth) * 100)}%`,
                    background: "var(--mint)",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tier Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
          }}
        >
          {tiers.map((t) => {
            const isCurrent = workspace.subscriptionTier === t.id;
            return (
              <div
                key={t.id}
                className="card"
                style={{
                  padding: "20px 16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: isCurrent ? "2px solid var(--coral)" : "1px solid var(--surface-border)",
                  background: isCurrent ? "#FFFDF9" : "var(--surface)",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 800 }}>{t.name}</span>
                    {isCurrent && <span className="badge badge-coral" style={{ fontSize: "10px" }}>Current</span>}
                  </div>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--ink)", marginBottom: "4px" }}>
                    {t.price}
                  </div>
                  <p style={{ fontSize: "11px", color: "var(--ink-secondary)", marginBottom: "14px", minHeight: "28px" }}>
                    {t.description}
                  </p>

                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", fontSize: "11.5px" }}>
                    {t.features.map((feat, i) => (
                      <li key={i} style={{ display: "flex", gap: "6px" }}>
                        <Check size={13} color="var(--mint)" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: "18px" }}>
                  {isCurrent ? (
                    <div style={{ textAlign: "center", fontSize: "12px", fontWeight: 700, color: "var(--mint)" }}>
                      ✓ Active Plan
                    </div>
                  ) : (
                    <button
                      aria-label={`Select ${t.name} plan`}
                      onClick={() => handleSelectTier(t.id)}
                      disabled={loadingTier === t.id}
                      className="btn btn-secondary btn-sm"
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      {loadingTier === t.id ? "Activating..." : "Select Plan"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: "11px", color: "var(--ink-muted)", marginTop: "20px", textAlign: "center" }}>
          Payments are processed securely via verified webhooks. You retain access to all saved data even upon downgrade.
        </p>
      </div>
    </div>
  );
};
