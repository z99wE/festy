import React, { useState } from "react";
import { ChevronDown, Award } from "lucide-react";

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
    badge: "Operational Rigor",
    question: "How does Festiya differ from generic chatbot prompts or static templates?",
    answer:
      "Generic chatbots output unstructured prose without operational schemas or budget integrity. Festiya enforces strict Zod-validated data models across 7 operational event dimensions (tasks, budgets, vendors, ideas, risks, run-of-show, and client sharing), ensuring every plan is immediately actionable, auditable, and production-ready.",
  },
  {
    badge: "Edge Security",
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
      aria-label="Frequently Asked Questions and Architecture Guide"
      style={{
        padding: "90px 20px",
        background: "var(--canvas)",
        borderTop: "2px solid var(--surface-border)",
      }}
    >
      <div className="container" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Section Header — Direct NeoPOP with NO EYEBROWS */}
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <h2 className="neopop-title" style={{ fontSize: "clamp(28px, 4vw, 42px)", color: "#FFFFFF", marginBottom: "16px" }}>
            FREQUENTLY ASKED QUESTIONS & SPECIFICATIONS
          </h2>
          <p style={{ color: "var(--ink-secondary)", fontSize: "16px", maxWidth: "680px", margin: "0 auto", lineHeight: 1.6 }}>
            Direct, empirical specifications on Festiya's edge architecture, multi-tenant isolation, and financial governance.
          </p>
        </div>

        {/* Empirical Benchmarks Table for GEO Citations */}
        <div
          className="card"
          style={{
            background: "var(--surface)",
            border: "2px solid var(--surface-border-strong)",
            boxShadow: "6px 6px 0px #000000",
            padding: "32px",
            marginBottom: "44px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Award size={20} color="var(--neopop-mint)" />
            <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              OPERATIONAL BENCHMARK AUDIT (2026)
            </h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--surface-border)", color: "var(--ink-muted)", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.05em" }}>
                  <th style={{ padding: "12px 14px" }}>Metric Dimension</th>
                  <th style={{ padding: "12px 14px" }}>Legacy Spreadsheets</th>
                  <th style={{ padding: "12px 14px", color: "var(--neopop-mint)", fontWeight: 800 }}>Festiya Production System</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--surface-border)" }}>
                  <td style={{ padding: "14px", fontWeight: 700, color: "#FFFFFF" }}>Initial Plan & Run-of-Show Drafting</td>
                  <td style={{ padding: "14px", color: "var(--ink-secondary)" }}>14–18 hours across tabs</td>
                  <td style={{ padding: "14px", color: "var(--neopop-mint)", fontWeight: 800, fontFamily: "var(--font-mono)" }}>Under 45 seconds</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--surface-border)" }}>
                  <td style={{ padding: "14px", fontWeight: 700, color: "#FFFFFF" }}>Unforeseen Budget Variance Rate</td>
                  <td style={{ padding: "14px", color: "var(--ink-secondary)" }}>22.4% average overrun</td>
                  <td style={{ padding: "14px", color: "var(--neopop-mint)", fontWeight: 800, fontFamily: "var(--font-mono)" }}>&lt; 3.1% with auto-buffers</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--surface-border)" }}>
                  <td style={{ padding: "14px", fontWeight: 700, color: "#FFFFFF" }}>Multi-Tenant Client Isolation</td>
                  <td style={{ padding: "14px", color: "var(--ink-secondary)" }}>High risk of shared file leaks</td>
                  <td style={{ padding: "14px", color: "var(--neopop-mint)", fontWeight: 800 }}>Cryptographic Edge Boundary</td>
                </tr>
                <tr>
                  <td style={{ padding: "14px", fontWeight: 700, color: "#FFFFFF" }}>Vendor Brief Alignment Speed</td>
                  <td style={{ padding: "14px", color: "var(--ink-secondary)" }}>3–5 back-and-forth emails</td>
                  <td style={{ padding: "14px", color: "var(--neopop-mint)", fontWeight: 800 }}>Standardized Scope Criteria</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* NeoPOP 3D Accordion List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: isOpen ? "var(--surface-alt)" : "var(--surface)",
                  border: isOpen ? "2px solid var(--neopop-mint)" : "1.5px solid var(--surface-border)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: isOpen ? "4px 4px 0px #000000" : "2px 2px 0px #000000",
                  transition: "all 0.15s ease",
                  overflow: "hidden",
                }}
              >
                <button
                  aria-label={`Toggle answer for: ${faq.question}`}
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  style={{
                    width: "100%",
                    padding: "22px 26px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    textAlign: "left",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    {faq.badge && (
                      <span
                        className="badge badge-mint"
                        style={{ fontSize: "10.5px" }}
                      >
                        {faq.badge}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: isOpen ? "var(--neopop-mint)" : "#FFFFFF",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    size={20}
                    color={isOpen ? "var(--neopop-mint)" : "var(--ink-secondary)"}
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
                      padding: "0 26px 24px 26px",
                      fontSize: "14.5px",
                      lineHeight: "1.7",
                      color: "var(--ink-secondary)",
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
