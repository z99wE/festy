import React from "react";
import { Sparkles, Shield, Heart } from "lucide-react";

interface FooterProps {
  onOpenExportModal: () => void;
  onOpenPricing: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenExportModal, onOpenPricing }) => {
  return (
    <footer
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--surface-border)",
        padding: "48px 0 32px",
        marginTop: "auto",
        fontSize: "13px",
        color: "var(--ink-secondary)",
      }}
    >
      <div className="container" style={{ maxWidth: "1080px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "32px",
            marginBottom: "36px",
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "var(--coral)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFF",
                }}
              >
                <Sparkles size={16} />
              </div>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--ink)" }}>Festiya</span>
            </div>
            <p style={{ fontSize: "13px", lineHeight: 1.5, color: "var(--ink-secondary)" }}>
              Make a moment of it. Global AI-powered event planning and operations workspace.
            </p>
            <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--mint)" }}>
              <Shield size={14} />
              <span>Cloudflare-first deployment • WCAG 2.2 AA compliant</span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "12px" }}>Product</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>
                <a href="#main-content" style={{ color: "var(--ink-secondary)" }}>
                  Event Discovery & Planning
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenPricing}
                  style={{ color: "var(--ink-secondary)", cursor: "pointer", fontSize: "13px" }}
                >
                  Pricing & Entitlements
                </button>
              </li>
              <li>
                <span style={{ color: "var(--ink-muted)" }}>Multi-Provider AI Gateway</span>
              </li>
            </ul>
          </div>

          {/* Planners & Agencies */}
          <div>
            <h4 style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "12px" }}>For Planners</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>
                <span style={{ color: "var(--ink-secondary)" }}>Client Proposal Generator</span>
              </li>
              <li>
                <span style={{ color: "var(--ink-secondary)" }}>Vendor & Partner Tracking</span>
              </li>
              <li>
                <span style={{ color: "var(--ink-secondary)" }}>Scoped Share Links</span>
              </li>
            </ul>
          </div>

          {/* Trust & GDPR */}
          <div>
            <h4 style={{ fontWeight: 700, color: "var(--ink)", marginBottom: "12px" }}>Privacy & Rights</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>
                <button
                  onClick={onOpenExportModal}
                  style={{ color: "var(--cobalt)", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
                >
                  GDPR Data Export (Article 20)
                </button>
              </li>
              <li>
                <span style={{ color: "var(--ink-muted)" }}>Zero private prompt logging</span>
              </li>
              <li>
                <span style={{ color: "var(--ink-muted)" }}>Tenant-scoped security</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--surface-border)",
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
          <div>© 2026 Festiya Workspace. All rights reserved.</div>
          <div>Deployed on Cloudflare Workers + D1 Database.</div>
        </div>
      </div>
    </footer>
  );
};
