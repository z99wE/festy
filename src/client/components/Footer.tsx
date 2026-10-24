import React from "react";
import { Sparkles, Shield } from "lucide-react";

interface FooterProps {
  onOpenExportModal: () => void;
  onOpenPricing: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenExportModal, onOpenPricing }) => {
  return (
    <footer
      style={{
        background: "var(--surface)",
        borderTop: "2px solid var(--surface-border)",
        padding: "60px 0 36px",
        marginTop: "auto",
        fontSize: "13px",
        color: "var(--ink-secondary)",
      }}
    >
      <div className="container" style={{ maxWidth: "1120px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "36px",
            marginBottom: "44px",
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--neopop-mint)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                  border: "1.5px solid #000",
                  boxShadow: "2px 2px 0px #000",
                }}
              >
                <Sparkles size={16} />
              </div>
              <span className="neopop-title" style={{ fontSize: "18px", color: "#FFFFFF" }}>FESTIYA</span>
            </div>
            <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--ink-secondary)" }}>
              The high-precision event operations engine. Decimal-safe budgets, minute-by-minute cue sheets, and unified partner logistics.
            </p>
            <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--neopop-mint)", fontWeight: 700 }}>
              <Shield size={14} />
              <span>Edge Deployment • Row-Level Multi-Tenant Isolation</span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 style={{ fontWeight: 800, color: "#FFFFFF", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "12px" }}>
              Platform
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>
                <a href="#main-content" style={{ color: "var(--ink-secondary)" }}>
                  Event Discovery & Planning
                </a>
              </li>
              <li>
                <button
                  aria-label="Open pricing and entitlements"
                  type="button"
                  onClick={onOpenPricing}
                  style={{ color: "var(--ink-secondary)", cursor: "pointer", fontSize: "13px", textAlign: "left", padding: 0 }}
                >
                  Tiers & Subscription Limits
                </button>
              </li>
              <li>
                <span style={{ color: "var(--ink-muted)" }}>Edge Reasoning Gateway</span>
              </li>
            </ul>
          </div>

          {/* Planners & Agencies */}
          <div>
            <h4 style={{ fontWeight: 800, color: "#FFFFFF", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "12px" }}>
              Operations
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>
                <span style={{ color: "var(--ink-secondary)" }}>Client Proposal Generation</span>
              </li>
              <li>
                <span style={{ color: "var(--ink-secondary)" }}>Vendor Agreement Pipeline</span>
              </li>
              <li>
                <span style={{ color: "var(--ink-secondary)" }}>Tokenized Client Portals</span>
              </li>
            </ul>
          </div>

          {/* Privacy & GDPR */}
          <div>
            <h4 style={{ fontWeight: 800, color: "#FFFFFF", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "12px" }}>
              Governance
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>
                <button
                  aria-label="Download account data export"
                  type="button"
                  onClick={onOpenExportModal}
                  style={{ color: "var(--ink-secondary)", cursor: "pointer", fontSize: "13px", textAlign: "left", padding: 0 }}
                >
                  Export Workspace Data (JSON)
                </button>
              </li>
              <li>
                <span style={{ color: "var(--ink-secondary)" }}>WCAG 2.1 AA Standard</span>
              </li>
              <li>
                <span style={{ color: "var(--ink-secondary)" }}>Zero External Server Telemetry</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1.5px solid var(--surface-border)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "12px",
            color: "var(--ink-muted)",
          }}
        >
          <div>
            © {new Date().getFullYear()} Festiya Operations Inc. All rights reserved.
          </div>
          <div style={{ fontFamily: "var(--font-mono)", color: "var(--neopop-mint)" }}>
            CLOUDFLARE EDGE PRODUCTION
          </div>
        </div>
      </div>
    </footer>
  );
};
