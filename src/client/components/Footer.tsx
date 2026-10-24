import React from "react";
import { Sparkles, Shield, Globe, Code2, Share2, MessageSquare } from "lucide-react";

interface FooterProps {
  onOpenExportModal: () => void;
  onOpenPricing: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenExportModal, onOpenPricing }) => {
  const socialIcons = [
    { name: "Global Edge", icon: Globe, href: "https://festiya.com" },
    { name: "Codebase", icon: Code2, href: "https://github.com/z99wE/festy" },
    { name: "Share Proposal", icon: Share2, href: "https://festiya.com" },
    { name: "Community", icon: MessageSquare, href: "https://discord.com" },
  ];

  return (
    <footer
      style={{
        backgroundColor: "#171e19",
        borderTop: "2px solid #000000",
        padding: "64px 0 40px",
        marginTop: "auto",
        fontSize: "14px",
        color: "#b7c6c2",
      }}
    >
      <div className="container" style={{ maxWidth: "1160px" }}>
        {/* 4 Columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "40px",
            marginBottom: "48px",
          }}
        >
          {/* Column 1: Brand & Social Squares */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "#ffe17c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000000",
                  border: "2px solid #000000",
                  boxShadow: "3px 3px 0px 0px #000000",
                  fontWeight: 900,
                  fontSize: "18px",
                }}
              >
                ⚡
              </div>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.03em",
                }}
              >
                FESTIYA
              </span>
            </div>
            <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#b7c6c2", marginBottom: "20px" }}>
              The high-precision event operations engine. Decimal-safe budgets, minute-by-minute cue sheets, and unified partner logistics.
            </p>

            {/* Social Icons: squares (#272727) with light gray border turning Yellow/Black on hover */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {socialIcons.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="footer-social-square"
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: "#272727",
                      border: "2px solid #71717a",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      transition: "all 0.2s ease",
                      boxShadow: "2px 2px 0px 0px #000000",
                    }}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                color: "#ffe17c",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontSize: "13px",
              }}
            >
              Platform
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              <li>
                <a href="#main-content" style={{ color: "#b7c6c2" }}>
                  Event Discovery & Planning
                </a>
              </li>
              <li>
                <button
                  aria-label="View Tiers and Subscription Limits"
                  type="button"
                  onClick={onOpenPricing}
                  style={{ color: "#b7c6c2", cursor: "pointer", fontSize: "14px", textAlign: "left", padding: 0 }}
                >
                  Tiers & Subscription Limits
                </button>
              </li>
              <li>
                <span style={{ color: "#b7c6c2" }}>Enterprise Budget Ledger</span>
              </li>
              <li>
                <span style={{ color: "#b7c6c2" }}>AI Planning Engine</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Operations */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                color: "#ffe17c",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontSize: "13px",
              }}
            >
              Operations
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              <li>
                <span style={{ color: "#b7c6c2" }}>Client Proposal Generation</span>
              </li>
              <li>
                <span style={{ color: "#b7c6c2" }}>Vendor Agreement Pipeline</span>
              </li>
              <li>
                <span style={{ color: "#b7c6c2" }}>Tokenized Client Portals</span>
              </li>
              <li>
                <span style={{ color: "#b7c6c2" }}>Run of Show Live Cues</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Governance */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                color: "#ffe17c",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontSize: "13px",
              }}
            >
              Governance & Privacy
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              <li>
                <button
                  aria-label="Export Account Data in JSON format"
                  type="button"
                  onClick={onOpenExportModal}
                  style={{ color: "#b7c6c2", cursor: "pointer", fontSize: "14px", textAlign: "left", padding: 0 }}
                >
                  Export Account Data (JSON)
                </button>
              </li>
              <li>
                <span style={{ color: "#b7c6c2" }}>WCAG 2.1 AA Compliance</span>
              </li>
              <li>
                <span style={{ color: "#b7c6c2" }}>Workspace Data Privacy</span>
              </li>
              <li>
                <span style={{ color: "#b7c6c2" }}>Private Tenant Isolation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "2px solid #272727",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "13px",
            color: "#71717a",
          }}
        >
          <div>
            © {new Date().getFullYear()} Festiya Operations Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
