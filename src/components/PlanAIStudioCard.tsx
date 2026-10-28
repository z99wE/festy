import React from 'react';
import { Copy, Check, Zap } from 'lucide-react';

export interface PlanAIStudioCardProps {
  customAIPrompt: string;
  onPromptChange: (val: string) => void;
  isAILoading: boolean;
  aiResponse: string;
  aiCopied: boolean;
  onCopyAI: () => void;
  onSubmitPrompt: (promptText: string) => void;
  activeOccasionName: string;
  guestCount: number;
  currency: string;
  budgetAmount: number;
}

export const PlanAIStudioCard: React.FC<PlanAIStudioCardProps> = ({
  customAIPrompt,
  onPromptChange,
  isAILoading,
  aiResponse,
  aiCopied,
  onCopyAI,
  onSubmitPrompt,
  activeOccasionName,
  guestCount,
  currency,
  budgetAmount,
}) => {
  const budgetFormatted = `${currency}${budgetAmount.toLocaleString()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitPrompt(customAIPrompt);
  };

  return (
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

      <div className="ai-studio-quick-prompts">
        <button
          type="button"
          aria-label="Auto-Optimize Budget"
          className="ai-quick-chip"
          onClick={() =>
            onSubmitPrompt(
              `Optimize budget breakdown and identify 3 areas to save 20% for ${activeOccasionName} with ${guestCount} guests and ${budgetFormatted} budget.`
            )
          }
        >
          Auto-Optimize Budget
        </button>
        <button
          type="button"
          aria-label="Day-of Run of Show"
          className="ai-quick-chip"
          onClick={() =>
            onSubmitPrompt(
              `Create a minute-by-minute day-of run-of-show schedule for ${activeOccasionName} with ${guestCount} guests.`
            )
          }
        >
          Day-of Run of Show
        </button>
        <button
          type="button"
          aria-label="Vendor Negotiation Script"
          className="ai-quick-chip"
          onClick={() =>
            onSubmitPrompt(
              `Draft top 5 vendor negotiation questions for catering, sound, and venue for ${activeOccasionName}.`
            )
          }
        >
          Vendor Negotiation Script
        </button>
        <button
          type="button"
          aria-label="Unique Experience Ideas"
          className="ai-quick-chip"
          onClick={() =>
            onSubmitPrompt(
              `Brainstorm 3 unique sensory decor and food experience ideas for ${activeOccasionName}.`
            )
          }
        >
          Unique Experience Ideas
        </button>
      </div>

      <form className="ai-studio-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          id="ai-studio-custom-prompt-input"
          aria-label="Custom Festi AI planning instruction"
          className="ai-studio-input"
          placeholder={`Ask Festi AI anything: e.g. "We need vegan food stations", "How to manage sound curfews"...`}
          value={customAIPrompt}
          onChange={(e) => onPromptChange(e.target.value)}
        />
        <button
          type="submit"
          aria-label="Ask Festi AI"
          className="btn btn-primary ai-studio-submit-btn"
          disabled={isAILoading || !customAIPrompt.trim()}
        >
          {isAILoading ? (
            <>
              <div
                className="festi-spin-icon"
                style={{ width: '12px', height: '12px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }}
              />
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

      {aiResponse && (
        <div className="ai-studio-result-panel">
          <div className="ai-result-header" style={{ justifyContent: 'flex-end' }}>
            <button
              type="button"
              aria-label="Copy Festi AI Blueprint"
              title="Copy Festi AI Blueprint"
              className="ai-copy-btn"
              onClick={onCopyAI}
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
  );
};
