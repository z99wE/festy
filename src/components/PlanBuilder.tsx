import React, { useState, useId } from 'react';
import {
  DollarSign,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Lightbulb,
  Briefcase,
  Copy,
  Check,
  PartyPopper,
  Sliders,
} from 'lucide-react';
import { playPopSound, playCelebrationSound } from '../utils/audio';

interface PlanBuilderProps {
  activeOccasion: string;
  onOccasionChange: (occasion: string) => void;
  soundEnabled: boolean;
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
}) => {
  const [guestCount, setGuestCount] = useState<number>(65);
  const [budgetAmount, setBudgetAmount] = useState<number>(5500);
  const [currency, setCurrency] = useState<string>('$');
  const [activeTab, setActiveTab] = useState<'budget' | 'tasks' | 'vendors' | 'ideas' | 'risks'>('budget');
  const [copied, setCopied] = useState<boolean>(false);

  const guestSliderId = useId();
  const budgetSliderId = useId();
  const currencySelectId = useId();

  // Dynamic Event Archetypes
  const occasions = [
    { id: 'birthday', label: '🎂 Milestone Birthday', subtitle: 'Fun, energetic, personal memories' },
    { id: 'wedding', label: '💍 Joyful Wedding', subtitle: 'Heartfelt, elegant, multi-generational' },
    { id: 'community', label: '🎪 Community Carnival', subtitle: 'Street festival, vibrant, open-air' },
    { id: 'work', label: '🚀 Creative Gala / Launch', subtitle: 'Impactful, polished, team celebration' },
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
      label: 'Live DJ/acoustic performers, microphones & stage',
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
      criteria: ['Capacity for ' + guestCount + ' seated/standing', 'All-weather backup access', 'Restroom cleanliness & wheelchair accessibility'],
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

  const handleCopyPlan = () => {
    const summaryText = `FESTIYA EVENT PLAN (${activeOccasion.toUpperCase()})\n` +
      `Guests: ${guestCount} | Budget: ${currency}${budgetAmount.toLocaleString()}\n\n` +
      `BUDGET BREAKDOWN:\n` +
      budgetCategories.map((b) => `- ${b.category}: ~${currency}${Math.round(budgetAmount * b.percentage).toLocaleString()}`).join('\n') +
      `\n\nNEXT TASKS:\n` +
      tasks.map((t) => `[${t.completed ? 'X' : ' '}] ${t.title} (${t.offset})`).join('\n');

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    playPopSound(soundEnabled);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="plan-builder-section" id="interactive-planner" aria-labelledby="planner-heading">
      <div className="content-wrapper">
        <div className="section-header">
          <h2 id="planner-heading" className="section-title">
            From Event Idea to an Executable Festival Plan
          </h2>
          <p className="section-subtitle">
            Configure your celebration parameters below. Festiya generates an instant, decimal-accurate
            budget, prioritized task checklist, and vendor questions without the stressful spreadsheets.
          </p>
        </div>

        <div className="planner-dashboard-grid">
          {/* Controls Column */}
          <aside className="builder-controls-card" aria-label="Event Configuration Controls">
            <div className="controls-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={20} color="var(--orange-500)" />
                <h3 style={{ fontSize: '1.25rem' }}>Your Event Brief</h3>
              </div>
              <span className="badge-pill sunshine">Live AI Preview</span>
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

              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--orange-600)', marginBottom: '8px' }}>
                {currency}{budgetAmount.toLocaleString()}
              </div>

              <input
                id={budgetSliderId}
                type="range"
                min="1000"
                max="30000"
                step="500"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(Number(e.target.value))}
                className="slider-input"
                aria-valuemin={1000}
                aria-valuemax={30000}
                aria-valuenow={budgetAmount}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-faint)', marginTop: '4px' }}>
                <span>{currency}1,000</span>
                <span>{currency}15,000</span>
                <span>{currency}30,000+</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div
              style={{
                background: 'var(--bg-canvas-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: '1px solid var(--border-subtle)',
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
                  {currency}{Math.round(budgetAmount / guestCount)}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Contingency Buffer
                </span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-mint-dark)' }}>
                  {currency}{Math.round(budgetAmount * 0.06).toLocaleString()}
                </div>
              </div>
            </div>
          </aside>

          {/* Generated Plan Output Column */}
          <main className="live-plan-card" aria-label="Structured Event Plan Output">
            <div className="plan-card-hero-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge-pill sunshine">Validated Schema v1.0</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Updated live</span>
                </div>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}>
                  {activeOccasion === 'birthday' && 'Milestone Birthday Celebration'}
                  {activeOccasion === 'wedding' && 'Heartfelt Wedding & Feast'}
                  {activeOccasion === 'community' && 'Community Street Carnival'}
                  {activeOccasion === 'work' && 'Creative Team Showcase & Gala'}
                </h3>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCopyPlan}
                aria-label="Copy plan summary to clipboard"
              >
                {copied ? <Check size={16} color="var(--accent-mint-dark)" /> : <Copy size={16} />}
                {copied ? 'Copied to Clipboard!' : 'Copy Plan'}
              </button>
            </div>

            {/* Summary Box */}
            <div className="plan-summary-box">
              <p>
                <strong>Plan Concept:</strong> Designed for an unforgettable gathering of{' '}
                <strong>{guestCount} guests</strong> with a balanced target of{' '}
                <strong>{currency}{budgetAmount.toLocaleString()}</strong>. Highlights include welcoming
                ambiance, distinct tasting stations, live entertainment flow, and zero unexpected cost spikes.
              </p>
            </div>

            {/* Plan Tabs */}
            <div className="plan-tabs-nav" role="tablist" aria-label="Plan Sections">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'budget'}
                className={`plan-tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
                onClick={() => setActiveTab('budget')}
              >
                <DollarSign size={16} aria-hidden="true" />
                Budget Allocation
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'tasks'}
                className={`plan-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => setActiveTab('tasks')}
              >
                <CheckCircle2 size={16} aria-hidden="true" />
                Milestones ({tasks.filter((t) => t.completed).length}/{tasks.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'vendors'}
                className={`plan-tab-btn ${activeTab === 'vendors' ? 'active' : ''}`}
                onClick={() => setActiveTab('vendors')}
              >
                <Briefcase size={16} aria-hidden="true" />
                Vendor Criteria
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'ideas'}
                className={`plan-tab-btn ${activeTab === 'ideas' ? 'active' : ''}`}
                onClick={() => setActiveTab('ideas')}
              >
                <Lightbulb size={16} aria-hidden="true" />
                Festive Ideas
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'risks'}
                className={`plan-tab-btn ${activeTab === 'risks' ? 'active' : ''}`}
                onClick={() => setActiveTab('risks')}
              >
                <AlertTriangle size={16} aria-hidden="true" />
                Risks & Mitigations
              </button>
            </div>

            {/* TAB CONTENT: Budget */}
            {activeTab === 'budget' && (
              <div role="tabpanel" aria-labelledby="budget-tab">
                <div className="budget-table-wrap">
                  <table className="budget-table">
                    <thead>
                      <tr>
                        <th scope="col">Category</th>
                        <th scope="col">Allocation</th>
                        <th scope="col">Likely Estimate</th>
                        <th scope="col">Range (Low – High)</th>
                        <th scope="col">Key Consideration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetCategories.map((item) => {
                        const likely = Math.round(budgetAmount * item.percentage);
                        const low = Math.round(budgetAmount * item.lowRatio);
                        const high = Math.round(budgetAmount * item.highRatio);
                        return (
                          <tr key={item.id}>
                            <td>
                              <strong style={{ color: 'var(--text-primary)' }}>{item.category}</strong>
                              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.label}</div>
                            </td>
                            <td>
                              <span className="budget-item-tag">{Math.round(item.percentage * 100)}%</span>
                            </td>
                            <td>
                              <strong style={{ color: 'var(--orange-700)' }}>
                                {currency}{likely.toLocaleString()}
                              </strong>
                            </td>
                            <td style={{ fontSize: '0.88rem' }}>
                              {currency}{low.toLocaleString()} – {currency}{high.toLocaleString()}
                            </td>
                            <td style={{ fontSize: '0.85rem' }}>{item.vendorNotes}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="budget-totals-row">
                  <span>Target Budget Health</span>
                  <span style={{ color: 'var(--orange-700)' }}>
                    Committed & Buffer: 100% ({currency}{budgetAmount.toLocaleString()})
                  </span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Tasks / Milestones */}
            {activeTab === 'tasks' && (
              <div role="tabpanel" aria-labelledby="tasks-tab">
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Interactive checklist. Toggle items as you progress — Festiya recalculates your milestones:
                </p>
                <div className="checklist-container">
                  {tasks.map((task) => (
                    <div key={task.id} className="task-item-card">
                      <div className="task-item-left">
                        <input
                          type="checkbox"
                          id={task.id}
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="task-checkbox"
                          aria-label={`Mark "${task.title}" as complete`}
                        />
                        <div>
                          <label
                            htmlFor={task.id}
                            className={`task-text ${task.completed ? 'completed' : ''}`}
                            style={{ cursor: 'pointer' }}
                          >
                            {task.title}
                          </label>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <Calendar size={13} aria-hidden="true" />
                            {task.offset}
                          </div>
                        </div>
                      </div>

                      <div className="task-meta">
                        <span className={`task-priority-badge ${task.priority}`}>
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Vendor Criteria */}
            {activeTab === 'vendors' && (
              <div role="tabpanel" aria-labelledby="vendors-tab">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {vendorCategories.map((vc, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-canvas-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '20px',
                        border: '1.5px solid var(--border-subtle)',
                      }}
                    >
                      <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
                        {vc.category}
                      </h4>
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--orange-700)', textTransform: 'uppercase' }}>
                          Selection Criteria
                        </span>
                        <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                          {vc.criteria.map((crit, cIdx) => (
                            <li key={cIdx}>{crit}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-mint-dark)', textTransform: 'uppercase' }}>
                          Key Questions To Ask Before Hiring
                        </span>
                        <ul style={{ paddingLeft: '20px', marginTop: '6px', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                          {vc.questions.map((q, qIdx) => (
                            <li key={qIdx}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Festive Ideas */}
            {activeTab === 'ideas' && (
              <div role="tabpanel" aria-labelledby="ideas-tab">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                  {ideas.map((idea, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--orange-50)',
                        border: '1.5px solid var(--orange-200)',
                        borderRadius: 'var(--radius-md)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--orange-600)', marginBottom: '8px' }}>
                          <PartyPopper size={20} />
                          <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{idea.title}</strong>
                        </div>
                        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {idea.desc}
                        </p>
                      </div>
                      <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--orange-200)' }}>
                        <span className="badge-pill sunshine" style={{ fontSize: '0.75rem' }}>
                          {idea.impact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Risks & Mitigations */}
            {activeTab === 'risks' && (
              <div role="tabpanel" aria-labelledby="risks-tab">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {risks.map((r, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        borderLeft: '4px solid var(--accent-coral)',
                        borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                        padding: '16px 20px',
                        borderTop: '1px solid var(--border-subtle)',
                        borderRight: '1px solid var(--border-subtle)',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <AlertTriangle size={18} color="var(--accent-coral)" />
                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.98rem' }}>Potential Risk:</strong>
                        <span style={{ color: 'var(--text-primary)' }}>{r.risk}</span>
                      </div>
                      <div style={{ fontSize: '0.92rem', color: 'var(--accent-mint-dark)', marginLeft: '26px' }}>
                        <strong>Festiya Mitigation:</strong> {r.mitigation}
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
