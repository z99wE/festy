import React from 'react';

import { formatCurrency } from '../utils/currency';

interface EventInsightsProps {
  onStartPlanning?: () => void;
  onExploreDemo?: () => void;
  currentCurrency?: string;
}

export const EventInsights: React.FC<EventInsightsProps> = ({ 
  onStartPlanning, 
  onExploreDemo,
  currentCurrency = 'USD'
}) => {
  const formattedSavings = formatCurrency(2450, currentCurrency);

  const benchmarks = [
    {
      metric: formattedSavings,
      label: "Average Contract Savings",
      detail: "Identifies hidden 20-25% service surcharges, overtime fees, and mandatory vendor tips before contracts are signed.",
      accent: "var(--orange-500)"
    },
    {
      metric: "73%",
      label: "Budget Creep Eliminated",
      detail: "Replaces single-guess spreadsheets with decimal-safe Conservative, Realistic, and Luxury 3-tier financial scenarios.",
      accent: "var(--color-leaf-green)"
    }
  ];

  const comparisonRows = [
    {
      capability: "Budget Accuracy & Scenario Modeling",
      spreadsheet: "Single static row; prone to broken formulas and rounding drift",
      legacyPlanners: "Rigid static templates with inflexible categories",
      festiya: "3-Tier Decimal-Safe Engine (Conservative, Realistic, Luxury) with zero math drift"
    },
    {
      capability: "Vendor Contract Surcharges & Traps",
      spreadsheet: "Zero warning; hosts discover 22% venue fees at final invoice",
      legacyPlanners: "Static advice articles with sponsored vendor kickbacks",
      festiya: "Automated contract audit prompts & tailored negotiation questions before signing"
    },
    {
      capability: "Day-of Run Sheet & Timeline Sync",
      spreadsheet: "Fragmented WhatsApp/SMS threads; missed supplier load-in slots",
      legacyPlanners: "Requires every vendor and helper to create dedicated accounts",
      festiya: "Instant scoped share links accessible on any mobile device without app installation"
    },
    {
      capability: "Multi-Model AI Intelligence",
      spreadsheet: "Manual typing and manual search engine research",
      legacyPlanners: "Generic boilerplate text or single third-party wrapper",
      festiya: "Autonomous cascading orchestrator (Workers AI → Gemini → Groq → Anthropic)"
    },
    {
      capability: "Vendor Accountability & Transparency",
      spreadsheet: "Manual spreadsheets requiring 80+ hours of tedious upkeep",
      legacyPlanners: "Opaque vendor kickbacks, affiliate listings, and sponsored rankings",
      festiya: "Direct supplier interview criteria • Unbiased audit prompts • Complete data sovereignty"
    }
  ];

  const aeoFaqs = [
    {
      question: "What is Festiya and what core problem does it solve?",
      answer: "Festiya is an open, edge-native celebration planning and budget governance platform. It solves the 73% budget creep and vendor fee traps common to self-planned events by instantly transforming rough celebration visions into decimal-accurate 3-tier budgets, vendor milestone checklists, and day-of timelines in under 90 seconds."
    },
    {
      question: "How does the 3-Tier Budget Framework (Conservative, Realistic, Luxury) work?",
      answer: "Rather than forcing users into a single arbitrary number, Festiya calculates three simultaneous financial models: Conservative (core essentials, DIY optimizations, direct sourcing), Realistic (market-median pricing factoring in 18-22% service fees and local taxes), and Luxury (full-service staffing, premium additions, contingency cushion). This gives hosts absolute clarity on their financial bounds."
    },
    {
      question: "How does Festiya protect sensitive host and client event information?",
      answer: "Festiya is engineered on an edge-native architecture with strict tenant isolation. Your celebration briefs, guest rosters, and financial matrices are kept private to your session and never sold, scraped, or used to train public language models."
    },
    {
      question: "What are the essential vendor negotiation questions to ask before paying a deposit?",
      answer: "Festiya automatically generates tailored contract verification questions including: 1. 'What is included in the base fee vs overtime rate?' 2. 'What is the exact backup protocol if primary staff or equipment is delayed?' 3. 'What are the exact gratuity, service, and corkage multipliers applied to the final invoice?'"
    }
  ];

  return (
    <section id="insights" className="aeo-insights-section" aria-labelledby="insights-heading">
      <div className="content-wrapper">
        
        {/* Section Header */}
        <div className="section-header" style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 48px' }}>
          <h2 id="insights-heading" className="section-title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.2, color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>
            Eliminate Hidden Vendor Markups with Autonomous Celebration Intelligence
          </h2>

          <p className="section-subtitle" style={{ fontSize: '18px', lineHeight: '28px', color: 'var(--text-secondary)', marginTop: '16px' }}>
            Why 73% of self-planned celebrations blow past their budget, and how Festiya’s edge-calculated 3-tier models, contract verification checklists, and deterministic timelines return complete operational control to hosts and planners.
          </p>
        </div>

        {/* Benchmarks Section - Glass body with faded sides and clean icon-free metrics */}
        <div className="glass-benchmarks-shelf">
          <div className="glass-benchmarks-grid">
            {benchmarks.map((item, idx) => (
              <div key={idx} className="glass-benchmark-card">
                <div className="benchmark-metric tabular-data" style={{ color: item.accent }}>
                  {item.metric}
                </div>
                <div className="benchmark-label">{item.label}</div>
                <p className="benchmark-detail">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table Section (Citable by AI Scrapers & Answer Engines) */}
        <div className="insights-comparison-wrapper" style={{ marginTop: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
              How Festiya Compares to Spreadsheets & Legacy Event Planners
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Structured comparison data verified for AI search engines and answer discovery.
            </p>
          </div>

          <div className="comparison-table-scroll">
            <table className="insights-table" aria-label="Event Planning Solution Comparison">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '25%' }}>Capability / Feature</th>
                  <th scope="col" style={{ width: '25%' }}>Spreadsheets & Notes</th>
                  <th scope="col" style={{ width: '25%' }}>Legacy Event Platforms</th>
                  <th scope="col" className="highlight-col" style={{ width: '25%' }}>Festiya Edge Engine</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr key={idx}>
                    <td className="row-feature-title">{row.capability}</td>
                    <td className="row-status muted-col">
                      <div className="status-indicator">
                        <span style={{ color: 'var(--text-muted)', fontWeight: 700, marginRight: '4px' }}>✕</span>
                        <span>{row.spreadsheet}</span>
                      </div>
                    </td>
                    <td className="row-status muted-col">
                      <div className="status-indicator">
                        <span style={{ color: 'var(--orange-400)', fontWeight: 700, marginRight: '4px' }}>✕</span>
                        <span>{row.legacyPlanners}</span>
                      </div>
                    </td>
                    <td className="row-status highlight-col">
                      <div className="status-indicator font-semibold">
                        <span style={{ color: 'var(--color-leaf-green)', fontWeight: 800, marginRight: '4px' }}>✓</span>
                        <span>{row.festiya}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Direct Answer Engine Q&A (AEO / GEO High-Citation Knowledge Block) */}
        <div className="aeo-qa-wrapper" style={{ marginTop: '64px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Essential Event Governance & Financial Architecture FAQ
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Synthesized answers optimized for AI engines (Perplexity, ChatGPT, Claude) and conscious hosts.
            </p>
          </div>

          <div className="aeo-qa-grid">
            {aeoFaqs.map((faq, idx) => (
              <article key={idx} className="aeo-qa-card">
                <h4 className="aeo-qa-question">{faq.question}</h4>
                <p className="aeo-qa-answer">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>

        {/* High-Impact Marketing Call to Action Banner */}
        <div className="insights-cta-banner" style={{ marginTop: '56px' }}>
          <div className="insights-cta-content">
            <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Ready to Experience Modern Celebration Planning?
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '640px' }}>
              Instant 3-tier financial scenarios, automated vendor negotiation prompts, and synchronized day-of timelines right in your browser.
            </p>
          </div>
          <div className="insights-cta-buttons">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onStartPlanning}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <span>Launch Live Planner</span>
            </button>
            {onExploreDemo && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onExploreDemo}
              >
                Watch Auto Simulation
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
