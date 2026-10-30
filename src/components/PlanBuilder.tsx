import React, { useState, useId, useMemo } from 'react';
import { playPopSound, playCelebrationSound } from '../utils/audio';
import { getCurrencyBudgetScale, convertCurrency, useLiveRates } from '../utils/currency';
import type { EventPlanningContext } from '../data/globalCelebrations';
import { aiOrchestrator } from '../services/aiOrchestrator';
import {
  OCCASIONS,
  BUDGET_CATEGORIES,
  INITIAL_TASKS,
  PLAN_IDEAS,
  PLAN_RISKS,
} from '../data/planBuilderData';
import type { TaskItem, VendorCategory } from '../data/planBuilderData';
import { PlanAIStudioCard } from './PlanAIStudioCard';
import { PlanControlsCard } from './PlanControlsCard';
import { PlanContextBanner } from './PlanContextBanner';
import { PlanTabPanes } from './PlanTabPanes';

interface PlanBuilderProps {
  activeOccasion: string;
  onOccasionChange: (occasion: string) => void;
  soundEnabled: boolean;
  planningContext?: EventPlanningContext | null;
  onClearPlanningContext?: () => void;
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

  const [customAIPrompt, setCustomAIPrompt] = useState<string>('');
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiCopied, setAiCopied] = useState<boolean>(false);

  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);

  const guestSliderId = useId();
  const budgetSliderId = useId();
  const currencySelectId = useId();

  const liveRates = useLiveRates();
  const budgetScale = useMemo(() => {
    void liveRates;
    return getCurrencyBudgetScale(currency);
  }, [currency, liveRates]);

  const handleCurrencyChange = (newCurrency: string) => {
    if (newCurrency === currency) return;
    const converted = convertCurrency(budgetAmount, currency, newCurrency);
    const targetScale = getCurrencyBudgetScale(newCurrency);
    const stepped = Math.round(converted / targetScale.step) * targetScale.step;
    const clamped = Math.min(targetScale.max, Math.max(targetScale.min, stepped));
    setBudgetAmount(clamped);
    setCurrency(newCurrency);
  };

  const [prevContext, setPrevContext] = useState(planningContext);
  if (planningContext !== prevContext) {
    setPrevContext(planningContext);
    if (planningContext?.budgetUSD) {
      setBudgetAmount(planningContext.budgetUSD);
    }
    if (planningContext?.guestRange) {
      const match = planningContext.guestRange.match(/\d+/);
      if (match) setGuestCount(Number(match[0]));
    }
    if (planningContext?.aiPrompt) {
      setCustomAIPrompt(planningContext.aiPrompt);
    }
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = !t.completed;
        if (next) playCelebrationSound(soundEnabled);
        else playPopSound(soundEnabled);
        return { ...t, completed: next };
      })
    );
  };

  const vendorCategories: VendorCategory[] = useMemo(() => [
    {
      category: 'Venue & Environment',
      criteria: [`Capacity for ${guestCount} seated/standing`, 'All-weather backup access', 'Restroom cleanliness & accessibility'],
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
  ], [guestCount]);

  const activeOccasionName = planningContext
    ? planningContext.name
    : OCCASIONS.find((o) => o.id === activeOccasion)?.label || 'Celebration Blueprint';

  const handleTriggerAIGenerator = async (promptText: string) => {
    if (!promptText.trim()) return;
    setIsAILoading(true);
    setAiResponse('');

    const eventName = planningContext ? planningContext.name : activeOccasion;
    const systemPrompt = `You are Festi, the Celebration Architect. Generate a practical, highly-structured event plan for "${eventName}".
Parameters: ${guestCount} guests, budget of ${currency}${budgetAmount.toLocaleString()}.
Use concise bullet points, specific timelines, and actionable vendor negotiation tips. Never output Python code, code blocks, or technical programming scripts. Stay strictly focused on celebration planning.`;

    try {
      const res = await aiOrchestrator.generateCompletion(
        [{ role: 'user', content: promptText }],
        systemPrompt
      );
      setAiResponse(res.content);
      playCelebrationSound(soundEnabled);
    } catch {
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
      BUDGET_CATEGORIES.map((b) => `- ${b.category}: ~${currency}${Math.round(budgetAmount * b.percentage).toLocaleString()}`).join('\n') +
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

  const handleSelectTab = (tab: 'budget' | 'tasks' | 'vendors' | 'ideas' | 'risks') => {
    setActiveTab(tab);
    playPopSound(soundEnabled);
  };

  const handleSelectOccasion = (id: string) => {
    onOccasionChange(id);
    playPopSound(soundEnabled);
  };

  return (
    <section className="plan-builder-section" id="interactive-planner" aria-labelledby="planner-heading">
      <div className="content-wrapper">
        <div className="section-header" style={{ margin: '0 auto 28px' }}>
          <div className="tab-hero-logo" style={{ marginBottom: '14px' }}>
            <img
              src="/festiya-logo.webp"
              alt="Festiya Logo"
              width={130}
              height={48}
              style={{ height: '42px', width: 'auto', display: 'inline-block', filter: 'drop-shadow(0 4px 12px rgba(255, 94, 30, 0.16))' }}
            />
          </div>
          <h2 id="planner-heading" className="section-title" style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>
            Planner & AI Cost Simulator
          </h2>
          <p className="section-subtitle">
            Configure your celebration parameters below. Festiya models conservative, likely, and luxury expenditure thresholds
            with decimal-accurate precision, backed by instant multi-LLM artificial intelligence to architect custom plans.
          </p>
        </div>

        {planningContext && (
          <PlanContextBanner
            planningContext={planningContext}
            guestCount={guestCount}
            onTriggerAI={handleTriggerAIGenerator}
            onClearContext={onClearPlanningContext}
          />
        )}

        <PlanAIStudioCard
          customAIPrompt={customAIPrompt}
          onPromptChange={setCustomAIPrompt}
          isAILoading={isAILoading}
          aiResponse={aiResponse}
          aiCopied={aiCopied}
          onCopyAI={handleCopyAIResponse}
          onSubmitPrompt={handleTriggerAIGenerator}
          activeOccasionName={activeOccasionName}
          guestCount={guestCount}
          currency={currency}
          budgetAmount={budgetAmount}
        />

        <div className="planner-dashboard-grid" style={{ marginTop: '28px' }}>
          <PlanControlsCard
            activeOccasion={activeOccasion}
            onSelectOccasion={handleSelectOccasion}
            guestCount={guestCount}
            onGuestCountChange={setGuestCount}
            guestSliderId={guestSliderId}
            budgetAmount={budgetAmount}
            onBudgetAmountChange={setBudgetAmount}
            budgetSliderId={budgetSliderId}
            budgetScale={budgetScale}
            currency={currency}
            onCurrencyChange={handleCurrencyChange}
            currencySelectId={currencySelectId}
          />

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
                aria-label="Copy plan summary to clipboard"
                className="btn btn-secondary"
                onClick={handleCopyPlan}
              >
                {copied ? 'Copied to Clipboard!' : 'Copy Plan'}
              </button>
            </div>

            <div className="plan-summary-box">
              <p>
                <strong>Plan Concept:</strong> Designed for an unforgettable gathering of{' '}
                <strong>{guestCount} guests</strong> with a balanced target of{' '}
                <strong>{currency}{budgetAmount.toLocaleString()}</strong>. Highlights include welcoming
                beverage stations, acoustic zoning, and vendor questions to save up to 22% on overhead.
              </p>
            </div>

            <nav className="plan-tabs-row" aria-label="Plan Sections">
              <button
                type="button"
                aria-label="Budget Blueprint tab"
                className={`plan-tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
                onClick={() => handleSelectTab('budget')}
              >
                <span>Budget Blueprint</span>
              </button>
              <button
                type="button"
                aria-label="Tasks and Milestones tab"
                className={`plan-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => handleSelectTab('tasks')}
              >
                <span>Tasks & Milestones ({tasks.filter((t) => t.completed).length}/{tasks.length})</span>
              </button>
              <button
                type="button"
                aria-label="Vendor Questions tab"
                className={`plan-tab-btn ${activeTab === 'vendors' ? 'active' : ''}`}
                onClick={() => handleSelectTab('vendors')}
              >
                <span>Vendor Questions</span>
              </button>
              <button
                type="button"
                aria-label="Creative Ideas tab"
                className={`plan-tab-btn ${activeTab === 'ideas' ? 'active' : ''}`}
                onClick={() => handleSelectTab('ideas')}
              >
                <span>Creative Ideas</span>
              </button>
              <button
                type="button"
                aria-label="Risks and Safeguards tab"
                className={`plan-tab-btn ${activeTab === 'risks' ? 'active' : ''}`}
                onClick={() => handleSelectTab('risks')}
              >
                <span>Risks & Safeguards</span>
              </button>
            </nav>

            <PlanTabPanes
              activeTab={activeTab}
              budgetCategories={BUDGET_CATEGORIES}
              budgetAmount={budgetAmount}
              currency={currency}
              tasks={tasks}
              onToggleTask={toggleTask}
              vendorCategories={vendorCategories}
              ideas={PLAN_IDEAS}
              risks={PLAN_RISKS}
            />
          </main>
        </div>
      </div>
    </section>
  );
};
