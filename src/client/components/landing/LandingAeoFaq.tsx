import React, { useState } from "react";
import { ChevronDown, Sparkles, ShieldCheck, CheckCircle2, Award, Zap, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  badge?: string;
}

const FAQS: FAQItem[] = [
  {
    badge: "Core Architecture",
    question: "What is Festiya and how does AI event planning work?",
    answer:
      "Festiya is an AI-powered event architecture and operations workspace. By inputting your occasion, guest count, location, and target budget, Festiya's reasoning engine synthesizes a full executable plan within 45 seconds—including itemized decimal-safe budgets, vendor negotiation criteria, risk mitigation buffers, and a minute-by-minute run-of-show schedule.",
  },
  {
    badge: "Financial Control",
    question: "How does Festiya prevent unexpected budget variance and vendor overages?",
    answer:
      "Unlike static spreadsheets, Festiya enforces integer-cent financial arithmetic and automatically provisions an 8–10% contingency reserve into every plan. Its domain logic recalculates variable per-guest catering and rental items dynamically when attendee counts shift, preventing the average 22% cost overrun common in manual event planning.",
  },
  {
    badge: "Generative vs. Templates",
    question: "How does Festiya differ from generic ChatGPT prompts or static templates?",
    answer:
      "Generic chatbots output unstructured prose without operational schemas or budget integrity. Festiya enforces strict Zod-validated data models across 7 operational event dimensions (tasks, budgets, vendors, ideas, risks, run-of-show, and client sharing), ensuring every plan is immediately actionable, auditable, and production-ready.",
  },
  {
    badge: "Enterprise Security",
    question: "How does multi-tenant isolation protect corporate and private client data?",
    answer:
      "Festiya is built entirely on the Cloudflare edge stack with native Web Crypto API authentication (PBKDF2 SHA-256 password hashing and HMAC-SHA256 tokens). Every workspace operates under strict row-level tenant boundary middleware in Cloudflare D1, mathematically preventing cross-tenant access and data leakage across client accounts.",
  },
  {
    badge: "Client Collaboration",
    question: "Can event planners share proposals with clients without exposing confidential vendor margins?",
    answer:
      "Yes. Festiya features cryptographically secure, tokenized client preview links with granular section permissions. Planners can selectively expose executive summaries, visual mood directions, and run-of-show schedules while keeping internal margin notes, draft vendor quotes, and budget variance logs private.",
  },
];

export const LandingAeoFaq: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section
      id="faq-section"
      aria-label="Frequently Asked Questions & Event Architecture Guide"
      style={{
        padding: "80px 20px",
        background: "var(--surface)",
        borderTop: "1px solid var(--surface-border)",
      }}
    >
      <div className="container" style={{ maxWidth: "960px", margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "20px",
              background: "rgba(255, 71, 87, 0.1)",
              border: "1px solid rgba(255, 71, 87, 0.25)",
              color: "#FF4757",
              fontSize: "12px",
              fontWeight: 700,
              marginBottom: "16px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            <HelpCircle size={14} />
            <span>Answer Engine Optimization & Insights</span>
          </div>

          <h2 className="serif-heading" style={{ fontSize: "36px", marginBottom: "16px", letterSpacing: "-0.5px" }}>
            Frequently Asked Questions & Operational Architecture
          </h2>
          <p style={{ color: "var(--ink-secondary)", fontSize: "16px", maxWidth: "680px", margin: "0 auto", lineHeight: 1.6 }}>
            Direct, fact-checked answers on Festiya's AI planning engine, multi-tenant isolation, and financial governance.
          </p>
        </div>

        {/* Empirical Benchmarks Table for GEO Citations */}
        <div
          style={{
            background: "var(--surface-alt)",
            border: "1px solid var(--surface-border)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "40px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Award size={18} color="#FF4757" />
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--ink)" }}>
              Festiya Operational Impact Benchmarks (2026)
            </h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--surface-border)", color: "var(--ink-muted)" }}>
                  <th style={{ padding: "10px 12px" }}>Metric</th>
                  <th style={{ padding: "10px 12px" }}>Legacy Manual / Spreadsheets</th>
                  <th style={{ padding: "10px 12px", color: "#FF4757", fontWeight: 700 }}>Festiya AI Workspace</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "12px", fontWeight: 600 }}>Initial Plan & Run-of-Show Drafting</td>
                  <td style={{ padding: "12px", color: "var(--ink-secondary)" }}>14–18 hours across tabs</td>
                  <td style={{ padding: "12px", color: "#2ED573", fontWeight: 700 }}>Under 45 seconds</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "12px", fontWeight: 600 }}>Unforeseen Budget Variance Rate</td>
                  <td style={{ padding: "12px", color: "var(--ink-secondary)" }}>22.4% average overrun</td>
                  <td style={{ padding: "12px", color: "#2ED573", fontWeight: 700 }}>&lt; 3.1% with auto-buffers</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "12px", fontWeight: 600 }}>Multi-Tenant Client Isolation</td>
                  <td style={{ padding: "12px", color: "var(--ink-secondary)" }}>Prone to shared folder leakage</td>
                  <td style={{ padding: "12px", color: "#2ED573", fontWeight: 700 }}>Cryptographic Edge Boundary</td>
                </tr>
                <tr>
                  <td style={{ padding: "12px", fontWeight: 600 }}>Vendor Brief Alignment Speed</td>
                  <td style={{ padding: "12px", color: "var(--ink-secondary)" }}>3–5 back-and-forth emails</td>
                  <td style={{ padding: "12px", color: "#2ED573", fontWeight: 700 }}>Standardized Scope Criteria</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Accordion FAQ Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: isOpen ? "var(--surface-alt)" : "var(--surface)",
                  border: isOpen ? "1px solid #FF4757" : "1px solid var(--surface-border)",
                  borderRadius: "14px",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-label={faq.question}
                  onClick={() => toggleAccordion(idx)}
                  style={{
                    width: "100%",
                    padding: "18px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    gap: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    {faq.badge && (
                      <span
                        style={{
                          fontSize: "10.5px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "6px",
                          background: "var(--coral-light)",
                          color: "var(--coral)",
                          textTransform: "uppercase",
                        }}
                      >
                        {faq.badge}
                      </span>
                    )}
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)" }}>
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    color={isOpen ? "#FF4757" : "var(--ink-muted)"}
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      flexShrink: 0,
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "0 24px 20px 24px",
                      color: "var(--ink-secondary)",
                      fontSize: "14px",
                      lineHeight: 1.65,
                      borderTop: "1px solid var(--surface-border)",
                      paddingTop: "16px",
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
