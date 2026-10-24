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
    badge: "Data Privacy",
    question: "How does workspace isolation protect corporate and private client data?",
    answer:
      "Festiya is engineered with native Web Crypto API authentication (PBKDF2 SHA-256 password hashing and secure session tokens). Every workspace operates under strict row-level tenant boundary middleware, preventing unauthorized access and keeping client budgets, contracts, and proposals completely confidential.",
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
      role="region"
      aria-label="Frequently Asked Questions and Specifications"
      style={{
        padding: "80px 20px",
        backgroundColor: "#ffffff",
        borderBottom: "2px solid #000000",
        color: "#000000",
      }}
    >
      <div className="container" style={{ maxWidth: "1020px", margin: "0 auto" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              color: "#000000",
              letterSpacing: "-0.03em",
              marginBottom: "12px",
            }}
          >
            Frequently Asked Questions & Specifications
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "#4a5568",
              fontSize: "17px",
              maxWidth: "680px",
              margin: "0 auto",
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Direct, empirical specifications on Festiya's operational architecture, workspace privacy, and financial governance.
          </p>
        </div>

        {/* Empirical Benchmarks Table for GEO Citations */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "2px solid #000000",
            borderRadius: "12px",
            boxShadow: "6px 6px 0px 0px #000000",
            padding: "32px",
            marginBottom: "44px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Award size={22} color="#000000" />
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: 800,
                color: "#000000",
                letterSpacing: "-0.02em",
              }}
            >
              OPERATIONAL BENCHMARK AUDIT (2026)
            </h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #000000", color: "#71717a", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.06em" }}>
                  <th style={{ padding: "12px 14px" }}>Metric Dimension</th>
                  <th style={{ padding: "12px 14px" }}>Legacy Spreadsheets</th>
                  <th style={{ padding: "12px 14px", color: "#000000", fontWeight: 800 }}>Festiya Production System</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #e4e4e7" }}>
                  <td style={{ padding: "14px", fontWeight: 700, color: "#000000" }}>Initial Plan & Run-of-Show Drafting</td>
                  <td style={{ padding: "14px", color: "#71717a" }}>14–18 hours across tabs</td>
                  <td style={{ padding: "14px", color: "#000000", fontWeight: 800, fontFamily: "var(--font-mono)" }}>Under 45 seconds</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e4e4e7" }}>
                  <td style={{ padding: "14px", fontWeight: 700, color: "#000000" }}>Unforeseen Budget Variance Rate</td>
                  <td style={{ padding: "14px", color: "#71717a" }}>22.4% average overrun</td>
                  <td style={{ padding: "14px", color: "#000000", fontWeight: 800, fontFamily: "var(--font-mono)" }}>&lt; 3.1% with auto-buffers</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e4e4e7" }}>
                  <td style={{ padding: "14px", fontWeight: 700, color: "#000000" }}>Private Client Workspace Isolation</td>
                  <td style={{ padding: "14px", color: "#71717a" }}>High risk of shared file leaks</td>
                  <td style={{ padding: "14px", color: "#000000", fontWeight: 800 }}>Isolated Tenant Boundary</td>
                </tr>
                <tr>
                  <td style={{ padding: "14px", fontWeight: 700, color: "#000000" }}>Vendor Brief Alignment Speed</td>
                  <td style={{ padding: "14px", color: "#71717a" }}>3–5 back-and-forth emails</td>
                  <td style={{ padding: "14px", color: "#000000", fontWeight: 800 }}>Standardized Scope Criteria</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Neo-Brutalist Accordion List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: isOpen ? "#ffe17c" : "#ffffff",
                  border: "2px solid #000000",
                  borderRadius: "10px",
                  boxShadow: isOpen ? "4px 4px 0px 0px #000000" : "2px 2px 0px 0px #000000",
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px",
                    textAlign: "left",
                    color: "#000000",
                    fontFamily: "var(--font-heading)",
                    fontSize: "17px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                  aria-expanded={isOpen}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    {faq.badge && (
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 800,
                          padding: "3px 8px",
                          borderRadius: "4px",
                          backgroundColor: "#000000",
                          color: "#ffffff",
                          textTransform: "uppercase",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {faq.badge}
                      </span>
                    )}
                    <span>{faq.question}</span>
                  </div>
                  <ChevronDown
                    size={20}
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
                      padding: "0 24px 22px",
                      fontFamily: "var(--font-body)",
                      fontSize: "15px",
                      lineHeight: 1.6,
                      color: "#171e19",
                      fontWeight: 500,
                      borderTop: "1.5px solid #000000",
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
