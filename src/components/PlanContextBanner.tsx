import React from 'react';
import { Calendar, MapPin, Zap } from 'lucide-react';
import type { EventPlanningContext } from '../data/globalCelebrations';
import { openFestiAIChat } from '../utils/chatEvents';

export interface PlanContextBannerProps {
  planningContext: EventPlanningContext;
  guestCount: number;
  onTriggerAI: (promptText: string) => void;
  onClearContext?: () => void;
}

export const PlanContextBanner: React.FC<PlanContextBannerProps> = ({
  planningContext,
  guestCount,
  onTriggerAI,
  onClearContext,
}) => {
  const defaultPrompt =
    planningContext.aiPrompt ||
    `Synthesize a master 3-tier budget and day-of timeline for ${planningContext.name} with ${guestCount} guests.`;

  const chatPrompt =
    `I am planning ${planningContext.name} (${planningContext.dates}). ${planningContext.aiPrompt || 'Give me budget advice and vendor questions.'}`;

  return (
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
          aria-label="Re-generate with Festi AI"
          className="btn btn-primary"
          style={{ padding: '8px 14px', fontSize: '13px' }}
          onClick={() => onTriggerAI(defaultPrompt)}
        >
          <Zap size={15} />
          <span>Re-generate with Festi AI</span>
        </button>

        <button
          type="button"
          aria-label="Chat with Festi AI"
          className="btn btn-secondary"
          style={{ padding: '8px 14px', fontSize: '13px' }}
          onClick={() => openFestiAIChat(chatPrompt)}
        >
          <span>Chat with Festi AI</span>
        </button>

        {onClearContext && (
          <button
            type="button"
            aria-label="Switch to default template"
            title="Switch to default template"
            className="search-clear-btn"
            style={{ width: '28px', height: '28px', fontSize: '16px' }}
            onClick={onClearContext}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
