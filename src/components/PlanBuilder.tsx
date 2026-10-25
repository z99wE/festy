import React, { useState, useId, useEffect } from 'react';
import {
  Copy,
  Check,
  Calendar,
  MapPin,
  Zap,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

import { playPopSound, playCelebrationSound } from '../utils/audio';
import { type EventPlanningContext } from '../data/globalCelebrations';
import { aiOrchestrator } from '../services/aiOrchestrator';
import { openFestiAIChat } from './FestiChatbot';

interface PlanBuilderProps {
  activeOccasion: string;
  onOccasionChange: (occasion: string) => void;
  soundEnabled: boolean;
  planningContext?: EventPlanningContext | null;
  onClearPlanningContext?: () => void;
}

interface BudgetItem {
  id: string;
  category: string;
  label: string;
  percentage: number;
  lowRatio: number;
  highRatio: number;
  vendorNotes: string;
}

interface TaskItem {
  id: string;
  title: string;
  offset: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  completed: boolean;
}

interface VendorCategory {
  category: string;
  criteria: string[];
  questions: string[];
}

export const PlanBuilder: React.FC<PlanBuilderProps> = ({
  activeOccasion,
  onOccasionChange,
  soundEnabled,
  planningContext,
  onClearPlanningContext,
}) => {
  const [guestCount, setGuestCount] = useState<number>(65);
  const [budgetAmount, setBudgetAmount] = useState<number>(5500);
  const [currency, setCurrency] = useState<string>('$');
  const [activeTab, setActiveTab] = useState<'budget' | 'tasks' | 'vendors' | 'ideas' | 'risks'>('budget');
  const [copied, setCopied] = useState<boolean>(false);

  // AI Architect Studio State
  const [customAIPrompt, setCustomAIPrompt] = useState<string>('');
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiCopied, setAiCopied] = useState<boolean>(false);

  const guestSliderId = useId();
  const budgetSliderId = useId();
  const currencySelectId = useId();

  // If planningContext arrives from the Worldwide Long Weekend or Festival calendar
  useEffect(() => {
    if (planningContext) {
      if (planningContext.budgetUSD) {
        setBudgetAmount(planningContext.budgetUSD);
      }
      if (planningContext.guestRange) {
        const match = planningContext.guestRange.match(/\d+/);
        if (match) setGuestCount(Number(match[0]));
      }
      if (planningContext.aiPrompt) {
        setCustomAIPrompt(planningContext.aiPrompt);
      }
    }
  }, [planningContext]);

  // Dynamic Event Archetypes
  const occasions = [
    { id: 'birthday', label: '🎂 Milestone Birthday', subtitle: 'Fun, energetic, personal memories' },
    { id: 'wedding', label: '💍 Joyful Wedding', subtitle: 'Heartfelt, elegant, multi-generational' },
    { id: 'family_reunion', label: '🏡 Family Reunion', subtitle: 'Multi-day, garden feasts & keepsakes' },
    { id: 'cultural_fest', label: 'Cultural Festival', subtitle: 'Heritage, banquets & lantern spectacles' },
    { id: 'community', label: '🎪 Community Carnival', subtitle: 'Street festival, vibrant, open-air' },
    { id: 'retreat', label: '🏔️ Offsite & Retreat', subtitle: 'Luxury lodges, strategy & nature breaks' },
    { id: 'festival', label: '🎶 Music & Street Fest', subtitle: 'Live stages, street food & high vibe' },
    { id: 'work', label: '🚀 Gala & Showcase', subtitle: 'Impactful, polished, team celebration' },
  ];

  // Calculated Budget Categories based on budget amount
  const budgetCategories: BudgetItem[] = [
    {
      id: 'b1',
      category: 'Venue & Staging',
      label: 'Main space rental, festive lighting & setup',
      percentage: 0.32,
      lowRatio: 0.28,
      highRatio: 0.36,
      vendorNotes: 'Verify load-in hours, sound curfew & AV equipment compatibility.',
    },
    {
      id: 'b2',
      category: 'Food & Refreshments',
      label: 'Interactive food stations, drinks & custom cake/bites',
      percentage: 0.38,
      lowRatio: 0.34,
      highRatio: 0.42,
      vendorNotes: 'Confirm dietary accommodations (vegan, gluten-free, allergy-safe).',
    },
    {
      id: 'b3',
      category: 'Sound & Entertainment',
      label: 'Live performers, microphones, DJ & ambiance',
      percentage: 0.14,
      lowRatio: 0.12,
      highRatio: 0.18,
      vendorNotes: 'Review playlist constraints and generator power needs.',
    },
    {
      id: 'b4',
      category: 'Decor & Atmosphere',
      label: 'Warm festoon lighting, florals, signage & photo backdrops',
      percentage: 0.10,
      lowRatio: 0.08,
      highRatio: 0.12,
      vendorNotes: 'Opt for reusable/biodegradable celebration elements.',
    },
    {
      id: 'b5',
      category: 'Safety & Contingency Buffer',
      label: 'Weather backup, extra supplies & emergency fund',
      percentage: 0.06,
      lowRatio: 0.05,
      highRatio: 0.08,
      vendorNotes: 'Reserved for unexpected last-minute additions.',
    },
  ];

  // Dynamic Tasks / Milestones with interactive toggle
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 't1', title: 'Lock down date & send save-the-dates', offset: '8 weeks out', priority: 'critical', completed: true },
    { id: 't2', title: 'Confirm venue contract & deposit', offset: '6 weeks out', priority: 'high', completed: true },
    { id: 't3', title: 'Review caterer menu tastings & dietary counts', offset: '4 weeks out', priority: 'high', completed: false },
    { id: 't4', title: 'Finalize music playlist & speaker cues', offset: '2 weeks out', priority: 'medium', completed: false },
    { id: 't5', title: 'Distribute run-of-show to key volunteers / vendors', offset: '3 days out', priority: 'critical', completed: false },
    { id: 't6', title: 'Festival day kickoff & welcoming the crowd', offset: 'Day of event', priority: 'high', completed: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.completed;
          if (next) playCelebrationSound(soundEnabled);
          else playPopSound(soundEnabled);
          return { ...t, completed: next };
        }
        return t;
      })
    );
  };

  // Vendor Categories & Questions
  const vendorCategories: VendorCategory[] = [
    {
      category: 'Venue & Environment',
      criteria: ['Capacity for ' + guestCount + ' seated/standing', 'All-weather backup access', 'Restroom cleanliness & accessibility'],
      questions: ['What is the exact load-out cutoff time?', 'Are we allowed to bring outside local catering?'],
    },
    {
      category: 'Catering & Beverages',
      criteria: ['Transparent per-head pricing', 'Staff-to-guest ratio of at least 1:15', 'Full cleanup and waste recycling included'],
      questions: ['What is the tasting schedule before signing?', 'How do you handle severe nut/gluten allergies?'],
    },
    {
      category: 'Music & Atmosphere',
      criteria: ['Experience with mixed-age crowd flow', 'Backup sound equipment on-site', 'Public liability insurance certificate'],
      questions: ['Do you provide wireless roaming microphones for toasts?', 'Can we supply a custom must-play / do-not-play list?'],
    },
  ];

  // Creative Ideas & Calculated Impact
  const ideas = [
    {
      title: 'Festival Welcome Sips Station',
      desc: 'Greet guests with chilled citrus spritzers and warm cider upon entry before mingling starts.',
      impact: 'Low cost, high experiential warmth',
    },
    {
      title: 'Interactive Audio Guestbook & Memory Wall',
      desc: 'Set up a rotary phone station where guests record voice wishes, paired with instant photo strips.',
      impact: 'Medium cost, cherished keepsake',
    },
    {
      title: 'Starlight Lantern Finale',
      desc: 'Conclude the celebration with glowing warm amber lanterns and a coordinated group toast.',
      impact: 'Minimal cost, unforgettable visual wrap',
    },
  ];

  // Risks & Mitigations
  const risks = [
    {
      risk: 'Unplanned weather change (rain/wind for outdoor areas)',
      mitigation: 'Pre-secured marquee rental option with 48h cancellation clause.',
    },
    {
      risk: 'Vendor arrival delays during peak traffic hours',
      mitigation: 'Stagger load-in times 90 minutes earlier than run-of-show start.',
    },
    {
      risk: 'Guest count surge past initial RSVP headcount',
      mitigation: 'Requested 10% food buffer margin from caterer guaranteed in contract.',
    },
  ];

  // AI Generation Trigger
  const handleTriggerAIGenerator = async (promptText: string) => {
    if (!promptText.trim()) return;
    setIsAILoading(true);
    setAiResponse('');

    const eventName = planningContext ? planningContext.name : activeOccasion;
    const systemPrompt = `You are Festi, the Autonomous Event Architect for Festiya. Generate a practical, highly-structured, and realistic event plan for "${eventName}".
Parameters: ${guestCount} guests, budget of ${currency}${budgetAmount.toLocaleString()}.
Use concise bullet points, specific timelines, and actionable vendor negotiation tips. Avoid fluff.`;

    try {
      const res = await aiOrchestrator.generateCompletion(
        [{ role: 'user', content: promptText }],
        systemPrompt
      );
      setAiResponse(res.content);
      playCelebrationSound(soundEnabled);
    } catch (err) {
      console.warn('AI Generation failed, falling back:', err);
      const fallback = aiOrchestrator.generateDeterministicResponse(promptText);
      setAiResponse(fallback);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleCopyPlan = () => {
    const activeTitle = planningContext ? planningContext.name : activeOccasion.toUpperCase();
    const summaryText =
      `FESTIYA EVENT PLAN (${activeTitle})\n` +
      `Guests: ${guestCount} | Budget: ${currency}${budgetAmount.toLocaleString()}\n` +
      (planningContext?.dates ? `Dates: ${planningContext.dates} | Location: ${planningContext.location}\n\n` : '\n') +
      `BUDGET BREAKDOWN:\n` +
      budgetCategories
        .map(
          (b) =>
            `- ${b.category}: ~${currency}${Math.round(budgetAmount * b.percentage).toLocaleString()}`
        )
        .join('\n') +
      `\n\nNEXT TASKS:\n` +
      tasks.map((t) => `[${t.completed ? 'X' : ' '}] ${t.title} (${t.offset})`).join('\n') +
      (aiResponse ? `\n\nAI ARCHITECT BLUEPRINT:\n${aiResponse}` : '');

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    playPopSound(soundEnabled);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAIResponse = () => {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
    setAiCopied(true);
    playPopSound(soundEnabled);
    setTimeout(() => setAiCopied(false), 2000);
  };

  const activeOccasionName = planningContext
    ? planningContext.name
    : occasions.find((o) => o.id === activeOccasion)?.label || 'Celebration Blueprint';

  return (
    <section className="plan-builder-section" id="interactive-planner" aria-labelledby="planner-heading">
      <div className="content-wrapper">
        {/* Section Header */}
        <div className="section-header">
          <h2 id="planner-heading" className="section-title" style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>
            Planner & AI Cost Simulator
          </h2>
          <p className="section-subtitle">
            Configure your celebration parameters below. Festiya models conservative, likely, and luxury expenditure thresholds
            with decimal-accurate precision, backed by instant multi-LLM artificial intelligence to architect custom plans.
          </p>
        </div>

        {/* ACTIVE PLANNING BLUEPRINT CONTEXT BANNER (when navigated from World Calendar) */}
        {planningContext && (
          <div className="planner-active-context-banner">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <span className="context-badge">Active Worldwide Blueprint</span>
                  <span className="context-dates-badge">
                    <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {planningContext.dates}
                  </span>
                  <span className="context-location-badge">
                    <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {planningContext.location}
                  </span>
                </div>
                <h3 className="context-title">{planningContext.name}</h3>
                {planningContext.theme && (
                  <p className="context-subtitle">"{planningContext.theme}"</p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '8px 14px', fontSize: '13px' }}
                onClick={() =>
                  handleTriggerAIGenerator(
                    planningContext.aiPrompt ||
                      `Synthesize a master 3-tier budget and day-of timeline for ${planningContext.name} with ${guestCount} guests.`
                  )
                }
              >
                <Zap size={15} />
                <span>Re-generate with Festi AI</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '13px' }}
                onClick={() =>
                  openFestiAIChat(
                    `I am planning ${planningContext.name} (${planningContext.dates}). ${planningContext.aiPrompt || 'Give me budget advice and vendor questions.'}`
                  )
                }
              >
                <span>Chat with Festi AI</span>
              </button>

              {onClearPlanningContext && (
                <button
                  type="button"
                  className="search-clear-btn"
                  style={{ width: '28px', height: '28px', fontSize: '16px' }}
                  onClick={onClearPlanningContext}
                  title="Switch to default template"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}

        {/* AI ARCHITECT STUDIO CARD */}
        <div className="planner-ai-studio-card">
          <div className="ai-studio-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--bubblegum-purple-blue, #5b42f3)', margin: 0 }}>
                Festi AI Celebration Architect
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Ask Festi AI to customize your budget, run-of-show schedule, or vendor negotiation questions anytime.
            </span>
          </div>

          {/* Quick AI Action Chips */}
          <div className="ai-studio-quick-prompts">
            <button
              type="button"
              className="ai-quick-chip"
              onClick={() =>
                handleTriggerAIGenerator(
                  `Optimize budget breakdown and identify 3 areas to save 20% for ${activeOccasionName} with ${guestCount} guests and ${currency}${budgetAmount.toLocaleString()} budget.`
                )
              }
            >
              💰 Auto-Optimize Budget
            </button>
            <button
              type="button"
              className="ai-quick-chip"
              onClick={() =>
                handleTriggerAIGenerator(
                  `Create a minute-by-minute day-of run-of-show schedule for ${activeOccasionName} with ${guestCount} guests.`
                )
              }
            >
              📋 Day-of Run of Show
            </button>
            <button
              type="button"
              className="ai-quick-chip"
              onClick={() =>
                handleTriggerAIGenerator(
                  `Draft top 5 vendor negotiation questions for catering, sound, and venue for ${activeOccasionName}.`
                )
              }
            >
              ❓ Vendor Negotiation Script
            </button>
            <button
              type="button"
              className="ai-quick-chip"
              onClick={() =>
                handleTriggerAIGenerator(
                  `Brainstorm 3 unique sensory decor and food experience ideas for ${activeOccasionName}.`
                )
              }
            >
              💡 Unique Experience Ideas
            </button>
          </div>

          {/* Custom AI Prompt Input Form */}
          <form
            className="ai-studio-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleTriggerAIGenerator(customAIPrompt);
            }}
          >
            <input
              type="text"
              className="ai-studio-input"
              placeholder={`Ask Festi AI anything: e.g. "We need vegan food stations", "How to manage sound curfews", "Plan a 4-day weekend schedule"...`}
              value={customAIPrompt}
              onChange={(e) => setCustomAIPrompt(e.target.value)}
              aria-label="Custom Festi AI planning instruction"
            />
            <button
              type="submit"
              className="btn btn-primary ai-studio-submit-btn"
              disabled={isAILoading || !customAIPrompt.trim()}
            >
              {isAILoading ? (
                <>
                  <div className="festi-spin-icon" style={{ width: '12px', height: '12px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }} />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Zap size={14} />
                  <span>Ask Festi AI</span>
                </>
              )}
            </button>
          </form>

          {/* AI Output Panel */}
          {aiResponse && (
            <div className="ai-studio-result-panel">
              <div className="ai-result-header" style={{ justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="ai-copy-btn"
                  onClick={handleCopyAIResponse}
                  title="Copy Festi AI Blueprint"
                >
                  {aiCopied ? (
                    <>
                      <Check size={13} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Festi AI Blueprint</span>
                    </>
                  )}
                </button>
              </div>
              <div className="ai-result-content">
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0, fontSize: '13px', lineHeight: 1.55 }}>
                  {aiResponse}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* 2-Column Planner Dashboard Grid */}
        <div className="planner-dashboard-grid" style={{ marginTop: '28px' }}>
          {/* Controls Column */}
          <aside className="builder-controls-card" aria-label="Event Configuration Controls">
            <div className="controls-card-header">
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Your Event Brief</h3>
            </div>

            {/* Occasion Selection */}
            <div className="form-group">
              <span className="form-label">Occasion / Celebration Type</span>
              <div className="category-btn-grid" role="group" aria-label="Occasion options">
                {occasions.map((occ) => {
                  const isSelected = activeOccasion === occ.id;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      className={`category-choice-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        onOccasionChange(occ.id);
                        playPopSound(soundEnabled);
                      }}
                      aria-pressed={isSelected}
                    >
                      <span>{occ.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guest Count Slider */}
            <div className="form-group">
              <label htmlFor={guestSliderId} className="form-label">
                <span>Guest Count</span>
                <span className="form-label-value">{guestCount} Guests</span>
              </label>
              <input
                id={guestSliderId}
                type="range"
                min="10"
                max="500"
                step="5"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="slider-input"
                aria-valuemin={10}
                aria-valuemax={500}
                aria-valuenow={guestCount}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-faint)', marginTop: '4px' }}>
                <span>10 (Intimate)</span>
                <span>250 (Large)</span>
                <span>500+ (Festival)</span>
              </div>
            </div>

            {/* Target Budget Slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label htmlFor={budgetSliderId} className="form-label" style={{ margin: 0 }}>
                  Target Budget
                </label>
                <div className="currency-row">
                  <label htmlFor={currencySelectId} className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}>
                    Currency
                  </label>
                  <select
                    id={currencySelectId}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="currency-select"
                    aria-label="Currency"
                  >
                    <option value="$">USD ($)</option>
                    <option value="€">EUR (€)</option>
                    <option value="£">GBP (£)</option>
                    <option value="₹">INR (₹)</option>
                    <option value="A$">AUD (A$)</option>
                    <option value="C$">CAD (C$)</option>
                  </select>
                </div>
              </div>

              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--bubblegum-purple-blue, #5b42f3)', marginBottom: '8px' }}>
                {currency}{budgetAmount.toLocaleString()}
              </div>

              <input
                id={budgetSliderId}
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(Number(e.target.value))}
                className="slider-input"
                aria-valuemin={1000}
                aria-valuemax={50000}
                aria-valuenow={budgetAmount}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-faint)', marginTop: '4px' }}>
                <span>{currency}1,000</span>
                <span>{currency}25,000</span>
                <span>{currency}50,000+</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div
              style={{
                background: 'var(--bg-canvas-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: '1.5px solid var(--border-medium)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Per Guest
                </span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {currency}{Math.round(budgetAmount / Math.max(1, guestCount))}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Contingency Buffer
                </span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>
                  {currency}{Math.round(budgetAmount * 0.06).toLocaleString()}
                </div>
              </div>
            </div>
          </aside>

          {/* Generated Plan Output Column */}
          <main className="live-plan-card" aria-label="Structured Event Plan Output">
            <div className="plan-card-hero-header">
              <div>
                <div style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Updated live with Festi AI modeling</span>
                </div>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>
                  {activeOccasionName}
                </h3>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCopyPlan}
                aria-label="Copy plan summary to clipboard"
              >
                {copied ? 'Copied to Clipboard!' : 'Copy Plan'}
              </button>
            </div>

            {/* Summary Box */}
            <div className="plan-summary-box">
              <p>
                <strong>Plan Concept:</strong> Designed for an unforgettable gathering of{' '}
                <strong>{guestCount} guests</strong> with a balanced target of{' '}
                <strong>{currency}{budgetAmount.toLocaleString()}</strong>. Highlights include welcoming
                beverage stations, acoustic zoning, and vendor questions to save up to 22% on overhead.
              </p>
            </div>

            {/* Workspace Navigation Tabs */}
            <nav className="plan-tabs-row" aria-label="Plan Sections">
              <button
                type="button"
                className={`plan-tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('budget');
                  playPopSound(soundEnabled);
                }}
              >
                <span>Budget Blueprint</span>
              </button>
              <button
                type="button"
                className={`plan-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('tasks');
                  playPopSound(soundEnabled);
                }}
              >
                <span>Tasks & Milestones ({tasks.filter((t) => t.completed).length}/{tasks.length})</span>
              </button>
              <button
                type="button"
                className={`plan-tab-btn ${activeTab === 'vendors' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('vendors');
                  playPopSound(soundEnabled);
                }}
              >
                <span>Vendor Questions</span>
              </button>
              <button
                type="button"
                className={`plan-tab-btn ${activeTab === 'ideas' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('ideas');
                  playPopSound(soundEnabled);
                }}
              >
                <span>Creative Ideas</span>
              </button>
              <button
                type="button"
                className={`plan-tab-btn ${activeTab === 'risks' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('risks');
                  playPopSound(soundEnabled);
                }}
              >
                <span>Risks & Safeguards</span>
              </button>
            </nav>

            {/* Tab 1: Budget Table */}
            {activeTab === 'budget' && (
              <div className="tab-pane active" aria-labelledby="tab-budget">
                <table className="budget-table">
                  <thead>
                    <tr>
                      <th scope="col">Category</th>
                      <th scope="col">Conservative</th>
                      <th scope="col">Target</th>
                      <th scope="col">Luxury</th>
                      <th scope="col">Vendor Tip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetCategories.map((cat) => {
                      const targetVal = Math.round(budgetAmount * cat.percentage);
                      const lowVal = Math.round(budgetAmount * cat.lowRatio);
                      const highVal = Math.round(budgetAmount * cat.highRatio);

                      return (
                        <tr key={cat.id}>
                          <td>
                            <strong>{cat.category}</strong>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.label}</div>
                          </td>
                          <td className="number-cell">{currency}{lowVal.toLocaleString()}</td>
                          <td className="number-cell font-bold" style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>
                            {currency}{targetVal.toLocaleString()}
                          </td>
                          <td className="number-cell">{currency}{highVal.toLocaleString()}</td>
                          <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{cat.vendorNotes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 2: Interactive Tasks Checklist */}
            {activeTab === 'tasks' && (
              <div className="tab-pane active" aria-labelledby="tab-tasks">
                <ul className="tasks-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className={`task-row ${task.completed ? 'completed' : ''}`}
                      onClick={() => toggleTask(task.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleTask(task.id);
                        }
                      }}
                      aria-pressed={task.completed}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}} // handled by parent onClick
                        className="task-checkbox"
                        aria-label={`Mark task "${task.title}" as complete`}
                      />
                      <div className="task-content">
                        <span className="task-title">{task.title}</span>
                        <div className="task-meta">
                          <span>{task.offset}</span>
                          <span style={{ margin: '0 6px' }}>•</span>
                          <span
                            className={`badge-pill ${
                              task.priority === 'critical' ? 'sunshine' : task.priority === 'high' ? 'sunset' : 'mint'
                            }`}
                            style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tab 3: Vendor Vetting Matrix */}
            {activeTab === 'vendors' && (
              <div className="tab-pane active" aria-labelledby="tab-vendors">
                <div className="vendor-matrix-grid">
                  {vendorCategories.map((vc, idx) => (
                    <div key={idx} className="vendor-card">
                      <h4>{vc.category}</h4>
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          Must-Have Criteria:
                        </span>
                        <ul style={{ paddingLeft: '18px', margin: '6px 0 0', fontSize: '0.85rem' }}>
                          {vc.criteria.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          Negotiation Questions:
                        </span>
                        <ul style={{ paddingLeft: '18px', margin: '6px 0 0', fontSize: '0.85rem' }}>
                          {vc.questions.map((q, i) => (
                            <li key={i} style={{ fontStyle: 'italic' }}>
                              "{q}"
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Creative Ideas */}
            {activeTab === 'ideas' && (
              <div className="tab-pane active" aria-labelledby="tab-ideas">
                <div className="ideas-grid">
                  {ideas.map((idea, idx) => (
                    <div key={idx} className="idea-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Lightbulb size={16} style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }} />
                        <h4 style={{ margin: 0 }}>{idea.title}</h4>
                      </div>
                      <p style={{ fontSize: '0.88rem', margin: '0 0 10px' }}>{idea.desc}</p>
                      <span className="badge-pill mint" style={{ fontSize: '0.74rem' }}>
                        {idea.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Risks & Safeguards */}
            {activeTab === 'risks' && (
              <div className="tab-pane active" aria-labelledby="tab-risks">
                <div className="risks-grid">
                  {risks.map((item, idx) => (
                    <div key={idx} className="risk-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <AlertTriangle size={16} style={{ color: '#D97706' }} />
                        <h4 style={{ margin: 0 }}>Potential Risk</h4>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {item.risk}
                      </p>
                      <div style={{ background: 'var(--bg-canvas)', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #059669' }}>
                        <strong style={{ fontSize: '0.8rem', color: '#059669' }}>Safeguard: </strong>
                        <span style={{ fontSize: '0.85rem' }}>{item.mitigation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
};
