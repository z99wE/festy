import React, { useState, useEffect } from 'react';
import { Sparkles, DollarSign, Calendar, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface Scenario {
  id: string;
  tag: string;
  prompt: string;
  guests: number;
  budgetTotal: number;
  currency: string;
  items: Array<{ category: string; amount: number; percentage: number }>;
  tasks: string[];
  vendorTip: { question: string; savings: string };
}

const SCENARIOS: Scenario[] = [
  {
    id: 'birthday',
    tag: 'Milestone 30th Birthday',
    prompt: '55 Guests • Rooftop Loft • Acoustic Jazz Duo • $4,800 Budget',
    guests: 55,
    budgetTotal: 4800,
    currency: '$',
    items: [
      { category: 'Venue & Rooftop Fee', amount: 1680, percentage: 35 },
      { category: 'Catering & Cocktails', amount: 1680, percentage: 35 },
      { category: 'Live Acoustic Music', amount: 576, percentage: 12 },
      { category: 'Photography & Lighting', amount: 480, percentage: 10 },
      { category: 'Contingency Reserve', amount: 384, percentage: 8 },
    ],
    tasks: [
      'Lock sound permit & curfew limits (30 days out)',
      'Confirm cocktail signature ingredient order (10 days out)',
      'Distribute acoustic load-in timetable to venue lead',
    ],
    vendorTip: {
      question: 'Ask: "Can we supply craft wine & cider with a flat corkage fee?"',
      savings: 'Saves ~$720 vs standard venue bar markups',
    },
  },
  {
    id: 'wedding',
    tag: 'Dream Vineyard Wedding',
    prompt: '110 Guests • Napa Vineyard • Farm-to-Table Dinner • $26,000 Budget',
    guests: 110,
    budgetTotal: 26000,
    currency: '$',
    items: [
      { category: 'Vineyard Lawn & Reception', amount: 10400, percentage: 40 },
      { category: 'Farm-to-Table Plated Dinner', amount: 7800, percentage: 30 },
      { category: 'Photo & Video Capture', amount: 3380, percentage: 13 },
      { category: 'Live Band & Sound Engineer', amount: 2600, percentage: 10 },
      { category: 'Floral & Ambience', amount: 1820, percentage: 7 },
    ],
    tasks: [
      'Lock backup tent rain guarantee clause (90 days out)',
      'Finalize guest dietary headcount with caterer (14 days out)',
      'Golden hour ceremony cue run sheet distributed to photographer',
    ],
    vendorTip: {
      question: 'Ask: "What is the per-plate delta between plated vs family-style service?"',
      savings: 'Saves ~$1,850 and reduces server headcount by 4',
    },
  },
  {
    id: 'corporate',
    tag: 'Corporate Gala & Offsite',
    prompt: '80 Guests • Art Gallery Gala • Keynote Stage + Open Bar • $11,500 Budget',
    guests: 80,
    budgetTotal: 11500,
    currency: '$',
    items: [
      { category: 'Gallery Rental & Security', amount: 4025, percentage: 35 },
      { category: 'Passed Hors d’oeuvres & Wine', amount: 4025, percentage: 35 },
      { category: 'AV, Microphones & Projection', amount: 1725, percentage: 15 },
      { category: 'Event Host & Stage Manager', amount: 920, percentage: 8 },
      { category: 'Printed Badges & Signage', amount: 805, percentage: 7 },
    ],
    tasks: [
      'Complete AV mic check & projector aspect ratio test (T-3h)',
      'VIP badge print lock & sponsor signage inspection (T-24h)',
      'Post-event invoice receipt collection protocol active',
    ],
    vendorTip: {
      question: 'Ask: "Is basic stage wash lighting bundled into the gallery rate?"',
      savings: 'Saves ~$950 in external AV lighting rig rental',
    },
  },
];

export const LiveInteractiveDemo: React.FC = () => {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const scenario = SCENARIOS[activeScenarioIdx];

  // Auto-typing simulation effect
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const targetText = scenario.prompt;
    setTypedText('');
    setIsTyping(true);
    setIsProcessing(false);
    setShowResults(false);

    let charIdx = 0;
    const typeInterval = setInterval(() => {
      if (charIdx < targetText.length) {
        setTypedText(targetText.slice(0, charIdx + 1));
        charIdx++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setIsProcessing(true);

        // Simulate AI orchestration analysis
        timeout = setTimeout(() => {
          setIsProcessing(false);
          setShowResults(true);
        }, 900);
      }
    }, 28);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(timeout);
    };
  }, [activeScenarioIdx, scenario.prompt]);

  // Auto-advance scenario every 9 seconds if user hasn't clicked
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
    }, 9500);

    return () => clearInterval(timer);
  }, []);

  const handleSelectScenario = (idx: number) => {
    setActiveScenarioIdx(idx);
  };

  const handleJumpToPlanner = () => {
    const el = document.getElementById('interactive-planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="live-demo-section" aria-label="Interactive Autonomous Planning Simulation">
      <div className="content-wrapper">
        {/* Section Header */}
        <div className="demo-header-wrapper">
          <div className="demo-badge">
            <Sparkles size={14} color="var(--orange-500)" />
            <span>Autonomous Intelligence in Action</span>
          </div>
          <h2 className="demo-title">
            Watch Festiya Architect an Event in Real Time
          </h2>
          <p className="demo-subtitle">
            See how natural celebration requirements transform into a decimal-accurate budget, milestone timeline, and vendor savings script in seconds.
          </p>

          {/* Scenario Selector Pills */}
          <div className="demo-scenario-pills" role="tablist" aria-label="Select sample event scenario">
            {SCENARIOS.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={activeScenarioIdx === idx}
                className={`demo-pill-btn ${activeScenarioIdx === idx ? 'active' : ''}`}
                onClick={() => handleSelectScenario(idx)}
              >
                <span>{s.tag}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Simulation Card Container */}
        <div className="demo-stage-card">
          {/* Simulated Input Console */}
          <div className="demo-console-bar">
            <div className="console-indicator">
              <span className="console-dot dot-red" />
              <span className="console-dot dot-yellow" />
              <span className="console-dot dot-green" />
              <span className="console-label">Festiya Autonomous Event Architect</span>
            </div>
            <div className="console-input-display">
              <span className="console-prompt-prefix">Event Prompt:</span>
              <span className="console-prompt-text">{typedText}</span>
              {isTyping && <span className="console-cursor" aria-hidden="true">|</span>}
            </div>
          </div>

          {/* Processing Status Banner */}
          {isProcessing && (
            <div className="demo-processing-banner">
              <div className="demo-spinner" />
              <span>Analyzing venue benchmarks & allocating 3-tier budget...</span>
            </div>
          )}

          {/* Live Generated Results Stage */}
          <div className={`demo-results-grid ${showResults ? 'visible' : 'pending'}`}>
            {/* 1. Budget Distribution Result */}
            <div className="demo-result-card budget">
              <div className="demo-card-header">
                <div className="demo-card-icon">
                  <DollarSign size={16} color="var(--orange-500)" />
                </div>
                <div>
                  <h3 className="demo-card-title">3-Tier Calculated Budget</h3>
                  <span className="demo-card-sub">
                    Target: <strong>${scenario.budgetTotal.toLocaleString()}</strong> ({scenario.guests} Guests)
                  </span>
                </div>
              </div>

              <div className="demo-budget-breakdown">
                {scenario.items.map((item) => (
                  <div key={item.category} className="demo-budget-row">
                    <div className="budget-row-meta">
                      <span className="budget-cat-name">{item.category}</span>
                      <span className="budget-cat-amount">
                        ${item.amount.toLocaleString()} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="demo-bar-track">
                      <div
                        className="demo-bar-fill"
                        style={{
                          width: showResults ? `${item.percentage * 2.5}%` : '0%',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Priority Milestone Checklist */}
            <div className="demo-result-card tasks">
              <div className="demo-card-header">
                <div className="demo-card-icon">
                  <Calendar size={16} color="var(--mint-500)" />
                </div>
                <div>
                  <h3 className="demo-card-title">Prioritized Milestones</h3>
                  <span className="demo-card-sub">Pre-negotiated timeline schedule</span>
                </div>
              </div>

              <div className="demo-tasks-list">
                {scenario.tasks.map((task, i) => (
                  <div key={i} className="demo-task-item">
                    <CheckCircle2 size={16} className="task-check-icon" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>

              {/* Vendor Leverage Script Box */}
              <div className="demo-vendor-leverage-box">
                <div className="leverage-badge">
                  <ShieldCheck size={13} color="#059669" />
                  <span>Negotiation Leverage Script</span>
                </div>
                <p className="leverage-question">{scenario.vendorTip.question}</p>
                <span className="leverage-savings">💰 {scenario.vendorTip.savings}</span>
              </div>
            </div>
          </div>

          {/* Interactive Footer CTA */}
          <div className="demo-card-footer">
            <span className="demo-footer-text">
              Generated in <strong>1.2 seconds</strong> with zero spreadsheet dread.
            </span>
            <button
              type="button"
              className="btn btn-primary demo-jump-btn"
              onClick={handleJumpToPlanner}
            >
              <span>Build your plan with custom numbers</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
