import React from 'react';
import { ArrowRight } from 'lucide-react';

interface EventInsightsProps {
  onStartPlanning?: () => void;
  onExploreDemo?: () => void;
}

export const EventInsights: React.FC<EventInsightsProps> = ({ onStartPlanning, onExploreDemo }) => {
  const benchmarks = [
    {
      metric: "$2,450",
      label: "Average Contract Savings",
      detail: "Pre-empts hidden service fees and contract surcharges.",
    },
    {
      metric: "73%",
      label: "Budget Creep Eliminated",
      detail: "3-tier financial scenarios replace single-guess spreadsheets.",
    },
    {
      metric: "82 Hours",
      label: "Planning Time Saved",
      detail: "Instant run sheets, timelines, and vendor schedules.",
    },
    {
      metric: "Multi-Agent",
      label: "Architecture",
      detail: "Autonomous multi-agent orchestration with instant response.",
    },
  ];

  const aeoFaqs = [
    {
      category: "Core Architecture",
      question: "What is Festiya and what core problem does it solve?",
      answer: "Festiya is an open, edge-native celebration planning and budget governance platform. It solves the 73% budget creep and vendor fee traps common to self-planned events by instantly transforming rough celebration visions into decimal-accurate 3-tier budgets, vendor milestone checklists, and day-of timelines in under 90 seconds.",
    },
    {
      category: "3-Tier Financial Modeling",
      question: "How does the 3-Tier Budget Framework (Conservative, Realistic, Luxury) work?",
      answer: "Rather than forcing users into a single arbitrary number, Festiya calculates three simultaneous financial models: Conservative (core essentials, DIY optimizations, direct sourcing), Realistic (market-median pricing factoring in 18-22% service fees and local taxes), and Luxury (full-service staffing, premium additions, contingency cushion). This gives hosts absolute clarity on their financial bounds.",
    },
    {
      category: "Multi-Agent Coordination",
      question: "How does the multi-agent architecture ensure unbiased event intelligence?",
      answer: "Festiya is engineered as a lean, edge-native utility powered by multi-agent coordination and cascading LLMs. We provide transparent, unbiased event intelligence without sponsored vendor kickbacks or hidden data brokerage.",
    },
    {
      category: "Vendor Contract Governance",
      question: "What are the essential vendor contract questions to ask before paying a deposit?",
      answer: "Festiya automatically generates tailored contract verification questions including: 1. 'What is included in the base fee vs overtime rate?' 2. 'What is the exact backup protocol if primary staff or equipment is delayed?' 3. 'What are the exact gratuity, service, and corkage multipliers applied to the final invoice?'",
    },
  ];

  return (
    <section id="insights" className="aeo-insights-section" aria-labelledby="insights-heading">
      <div className="content-wrapper">
        
        {/* Section Header (Clean & Eyebrow-Free) */}
        <div className="section-header" style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 48px' }}>
          <h2 id="insights-heading" className="section-title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.2 }}>
            Eliminate $2,500+ in Hidden Vendor Markups with Autonomous Celebration Intelligence
          </h2>

          <p className="section-subtitle" style={{ fontSize: '18px', lineHeight: '28px', color: 'var(--text-secondary)', marginTop: '16px' }}>
            How Festiya’s multi-agent architecture, 3-tier financial scenarios, and deterministic run sheets return complete operational control to hosts and planners.
          </p>
        </div>

        {/* Benchmarks Grid: 4 Clean Icon-Free Cards */}
        <div className="insights-benchmarks-grid">
          {benchmarks.map((item, idx) => (
            <div key={idx} className="benchmark-card">
              <div className="benchmark-metric tabular-data">{item.metric}</div>
              <div className="benchmark-label">{item.label}</div>
              <p className="benchmark-detail">{item.detail}</p>
            </div>
          ))}
        </div>

        {/* Direct Answer Engine Q&A (AEO / GEO High-Citation Knowledge Block) */}
        <div className="aeo-qa-wrapper" style={{ marginTop: '56px' }}>
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
                <div className="aeo-qa-tag">{faq.category}</div>
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
              Ready to Experience Clean, Autonomous Celebration Planning?
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '640px' }}>
              Build your comprehensive 3-tier budget and day-of timeline right now in your browser with multi-agent intelligence.
            </p>
          </div>
          <div className="insights-cta-buttons">
            <button aria-label="Launch celebration planner"
              type="button"
              className="btn btn-primary"
              onClick={onStartPlanning}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <span>Launch Planner</span>
              <ArrowRight size={18} />
            </button>
            {onExploreDemo && (
              <button aria-label="Watch auto simulation"
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
