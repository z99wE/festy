import React, { useState, useEffect } from 'react';

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
    prompt: '55 Guests, Rooftop Loft, Acoustic Jazz Duo, $4,800 Budget',
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
      'Lock sound permit and curfew limits (30 days out)',
      'Confirm cocktail signature ingredient order (10 days out)',
      'Distribute acoustic load-in timetable to venue lead',
    ],
    vendorTip: {
      question: 'Ask: "Can we supply craft wine and cider with a flat corkage fee?"',
      savings: 'Saves ~$720 versus standard venue bar markups',
    },
  },
  {
    id: 'wedding',
    tag: 'Dream Vineyard Wedding',
    prompt: '110 Guests, Napa Vineyard, Farm-to-Table Dinner, $26,000 Budget',
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
      question: 'Ask: "What is the per-plate delta between plated versus family-style service?"',
      savings: 'Saves ~$1,850 and reduces server headcount by 4',
    },
  },
  {
    id: 'corporate',
    tag: 'Corporate Gala & Offsite',
    prompt: '80 Guests, Art Gallery Gala, Keynote Stage and Open Bar, $11,500 Budget',
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
      'Complete AV mic check and projector aspect ratio test (T-3h)',
      'VIP badge print lock and sponsor signage inspection (T-24h)',
      'Post-event invoice receipt collection protocol active',
    ],
    vendorTip: {
      question: 'Ask: "Is basic stage wash lighting bundled into the gallery rate?"',
      savings: 'Saves ~$950 in external AV lighting rig rental',
    },
  },
];

interface BudgetItem {
  category: string;
  amount: number;
  percentage: number;
}

const BudgetRow: React.FC<{ item: BudgetItem; showResults: boolean }> = ({ item, showResults }) => {
  const scale = showResults ? Math.min(1, (item.percentage * 2.5) / 100) : 0;
  return (
    <div className="demo-budget-row">
      <div className="budget-row-meta">
        <span className="budget-cat-name">{item.category}</span>
        <span className="budget-cat-amount">
          ${item.amount.toLocaleString()} ({item.percentage}%)
        </span>
      </div>
      <div className="demo-bar-track">
        <div
          className="demo-bar-fill"
          style={{ transform: `scaleX(${scale})` }}
        />
      </div>
    </div>
  );
};

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
    let charIndex = 0;
    setTypedText('');
    setIsTyping(true);
    setIsProcessing(false);
    setShowResults(false);

    const onFinish = () => {
      setIsProcessing(false);
      setShowResults(true);
    };

    const onDoneTyping = () => {
      setIsTyping(false);
      setIsProcessing(true);
      timeout = setTimeout(onFinish, 500);
    };

    const typeChar = () => {
      if (charIndex < targetText.length) {
        setTypedText(targetText.slice(0, charIndex + 1));
        charIndex++;
        timeout = setTimeout(typeChar, 24 + Math.random() * 18);
        return;
      }
      onDoneTyping();
    };

    timeout = setTimeout(typeChar, 200);

    return () => clearTimeout(timeout);
  }, [activeScenarioIdx]);

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
          <h2 className="demo-title" style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)', fontWeight: 850 }}>
            Watch Festiya Architect an Event in Real Time
          </h2>
          <p className="demo-subtitle">
            See how natural celebration requirements transform into a decimal-accurate budget, milestone timeline, and vendor run sheet in seconds.
          </p>

          {/* Scenario Selector Pills */}
          <div className="demo-scenario-pills" role="tablist" aria-label="Select sample event scenario">
            {SCENARIOS.map((s, idx) => (
              <button
                key={s.id}
                aria-label={`Select scenario ${s.tag}`}
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
          {/* Simulated Input Console in Brand Purple / Blue (NO BLACK) */}
          <div className="demo-console-bar">
            <div className="console-indicator">
              <span className="console-dot dot-red" />
              <span className="console-dot dot-yellow" />
              <span className="console-dot dot-green" />
              <span className="console-label">Festiya Autonomous Event Architect</span>
            </div>
            <div className="console-input-display">
              <span className="console-prompt-prefix">Event Brief:</span>
              <span className="console-prompt-text">{typedText}</span>
              {isTyping && <span className="console-cursor" aria-hidden="true">|</span>}
            </div>
          </div>

          {/* Processing Status Banner */}
          {isProcessing && (
            <div className="demo-processing-banner">
              <div className="demo-spinner" />
              <span>Analyzing venue benchmarks and allocating 3-tier budget...</span>
            </div>
          )}

          {/* Live Generated Results Stage */}
          <div className={`demo-results-grid ${showResults ? 'visible' : 'pending'}`}>
            {/* 1. Budget Distribution Result */}
            <div className="demo-result-card budget">
              <div className="demo-card-header">
                <div>
                  <h3 className="demo-card-title">3-Tier Calculated Budget</h3>
                  <span className="demo-card-sub">
                    Target: <strong>${scenario.budgetTotal.toLocaleString()}</strong> ({scenario.guests} Guests)
                  </span>
                </div>
              </div>

              <div className="demo-budget-breakdown">
                {scenario.items.map((item) => (
                  <BudgetRow
                    key={item.category}
                    item={item}
                    showResults={showResults}
                  />
                ))}
              </div>
            </div>

            {/* 2. Priority Milestone Checklist */}
            <div className="demo-result-card tasks">
              <div className="demo-card-header">
                <div>
                  <h3 className="demo-card-title">Prioritized Milestones</h3>
                  <span className="demo-card-sub">Pre-negotiated timeline schedule</span>
                </div>
              </div>

              <div className="demo-tasks-list">
                {scenario.tasks.map((task, i) => (
                  <div key={i} className="demo-task-item">
                    <span className="demo-task-bullet">•</span>
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Footer CTA */}
          <div className="demo-card-footer">
            <span className="demo-footer-text">
              Generated in <strong>1.2 seconds</strong> with zero spreadsheet dread.
            </span>
            <button aria-label="Build your plan with custom numbers"
              type="button"
              className="btn btn-primary demo-jump-btn"
              onClick={handleJumpToPlanner}
            >
              <span>Build your plan with custom numbers</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
