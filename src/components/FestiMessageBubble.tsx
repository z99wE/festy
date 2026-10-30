import React from 'react';
import { ShieldAlert } from 'lucide-react';
import type {
  AgentBudgetArtifact,
  AgentTimelineArtifact,
  AgentContractArtifact,
  AgentGameTheoryArtifact,
  AgentBudgetCategory,
  AgentTimelineItem,
  AgentContractItem,
  ParetoTradeoff,
  MinimaxScenario,
} from '../services/multiAgentEngine';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'festi';
  text: string;
  time: string;
  suggestions?: string[];
  threatNeutralized?: boolean;
  threatCategory?: string;
  guardReason?: string;
  modelUsed?: string;
  agentsEngaged?: string[];
  budgetArtifact?: AgentBudgetArtifact;
  timelineArtifact?: AgentTimelineArtifact;
  contractArtifact?: AgentContractArtifact;
  gameTheoryArtifact?: AgentGameTheoryArtifact;
  occasionId?: string;
  occasionTitle?: string;
}

export interface FestiMessageBubbleProps {
  message: ChatMessage;
  onApplyPlan: (m: ChatMessage) => void;
  onSelectSuggestion: (sug: string) => void;
}

const bulletStyle: React.CSSProperties = { margin: '0 0 6px 0', lineHeight: 1.5 };
const bulletWrapStyle: React.CSSProperties = { display: 'flex', gap: '6px', alignItems: 'flex-start' };
const bulletDotStyle: React.CSSProperties = { color: 'var(--coral-pop, #ff6b4a)', flexShrink: 0 };
const paraStyle: React.CSSProperties = { margin: '0 0 8px 0', lineHeight: 1.5 };
const shieldIconStyle: React.CSSProperties = { color: '#059669', flexShrink: 0 };

function renderBulletLine(line: string, idx: number) {
  const isBullet = line.startsWith('•') || line.startsWith('-');
  if (isBullet) {
    const cleanText = line.replace(/^[-•]\s*/, '');
    return (
      <p key={idx} style={bulletStyle}>
        <span style={bulletWrapStyle}>
          <span style={bulletDotStyle}>•</span>
          <span>{cleanText}</span>
        </span>
      </p>
    );
  }
  return (
    <p key={idx} style={bulletStyle}>
      {line}
    </p>
  );
}

function renderMessageText(rawText: string) {
  const sanitized = rawText
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*/g, '')
    .trim();

  const paragraphs = sanitized.split(/\n\s*\n/).filter(Boolean);
  if (paragraphs.length <= 1) {
    const lines = sanitized.split('\n').filter(Boolean);
    if (lines.length > 1) {
      return lines.map(renderBulletLine);
    }
  }

  return paragraphs.map((para, idx) => (
    <p key={idx} style={paraStyle}>
      {para}
    </p>
  ));
}

const CategoryItem: React.FC<{ cat: AgentBudgetCategory; currency: string }> = ({ cat, currency }) => {
  const barStyle: React.CSSProperties = { width: `${Math.min(100, cat.percentage * 2.2)}%` };
  return (
    <div className="festi-category-item">
      <div className="festi-cat-header-line">
        <span className="festi-cat-title">{cat.category}</span>
        <span className="festi-cat-figure">
          {currency}{cat.amount.toLocaleString()} ({cat.percentage}%)
        </span>
      </div>
      <div className="festi-cat-bar-track">
        <div className="festi-cat-bar-fill" style={barStyle} />
      </div>
      <span className="festi-cat-note">{cat.notes}</span>
    </div>
  );
};

const SuggestionPill: React.FC<{ sug: string; onSelect: (s: string) => void }> = ({ sug, onSelect }) => {
  const label = 'Suggestion: ' + sug;
  return (
    <button
      type="button"
      aria-label={label}
      className="festi-suggestion-pill"
      onClick={() => onSelect(sug)}
    >
      {sug}
    </button>
  );
};

const TimelineNode: React.FC<{ item: AgentTimelineItem }> = ({ item }) => (
  <div className="festi-timeline-node">
    <span className="festi-timeline-stamp">{item.time}</span>
    <div className="festi-timeline-details">
      <span className="festi-timeline-event">{item.title}</span>
      <p className="festi-timeline-subtext">{item.detail}</p>
    </div>
  </div>
);

const SafeguardNode: React.FC<{ item: AgentContractItem }> = ({ item }) => (
  <div className="festi-safeguard-node">
    <span className="festi-safeguard-title">{item.riskArea}</span>
    <p className="festi-safeguard-risk-clause">{item.clauseWarning}</p>
    <div className="festi-safeguard-ask">
      <strong>Ask Vendor:</strong> "{item.verificationQuestion}"
    </div>
  </div>
);

const TradeNode: React.FC<{ trade: ParetoTradeoff }> = ({ trade }) => (
  <div className="festi-gt-trade-node">
    <div className="festi-gt-trade-cols">
      <div className="festi-gt-col">
        <span className="festi-gt-col-label">Concession Given (Low Host Cost):</span>
        <span className="festi-gt-col-value">{trade.concessionGiven}</span>
      </div>
      <div className="festi-gt-col highlight">
        <span className="festi-gt-col-label">Extracted Gain (High Host Value):</span>
        <span className="festi-gt-col-value">{trade.concessionExtracted}</span>
      </div>
    </div>
    <div className="festi-gt-payoff">
      <span>Payoff Logic: {trade.payoffRationale}</span>
    </div>
  </div>
);

const ScenarioNode: React.FC<{ sc: MinimaxScenario }> = ({ sc }) => (
  <div className="festi-gt-scenario-node">
    <div className="festi-gt-scenario-header">
      <span className="festi-gt-scenario-name">{sc.riskScenario}</span>
      <span className="festi-gt-scenario-saving">Protected Margin: {sc.estimatedProtectedMargin}</span>
    </div>
    <p className="festi-gt-scenario-strategy">{sc.minimaxOptimalStrategy}</p>
  </div>
);

function renderBudgetArtifact(b: AgentBudgetArtifact) {
  return (
    <div className="festi-artifact-card">
      <div className="festi-artifact-header">
        <span className="festi-artifact-label">3-Tier Decimal Budget Matrix</span>
        <span className="festi-artifact-meta">
          {b.currency}{b.totalBudget.toLocaleString()} • {b.guestCount} Guests (${b.costPerGuest}/guest)
        </span>
      </div>

      <div className="festi-tier-matrix">
        <div className="festi-tier-box">
          <span className="festi-tier-name">Conservative</span>
          <span className="festi-tier-number">{b.currency}{b.tiers.conservative.toLocaleString()}</span>
        </div>
        <div className="festi-tier-box highlight">
          <span className="festi-tier-name">Realistic Target</span>
          <span className="festi-tier-number">{b.currency}{b.tiers.realistic.toLocaleString()}</span>
        </div>
        <div className="festi-tier-box">
          <span className="festi-tier-name">Luxury</span>
          <span className="festi-tier-number">{b.currency}{b.tiers.luxury.toLocaleString()}</span>
        </div>
      </div>

      <div className="festi-categories-grid">
        {b.categories.map((cat, cIdx) => (
          <CategoryItem key={cIdx} cat={cat} currency={b.currency} />
        ))}
      </div>
    </div>
  );
}

function renderGameTheoryArtifact(gt: AgentGameTheoryArtifact) {
  return (
    <div className="festi-artifact-card">
      <div className="festi-artifact-header">
        <span className="festi-artifact-label">Game-Theoretic Bargaining Protocol</span>
        <span className="festi-artifact-meta">Nash Equilibrium & Savage Minimax</span>
      </div>

      <div className="festi-gt-batna-card">
        <div className="festi-gt-anchor-row">
          <span className="festi-gt-kicker">BATNA Walk-Away Anchor:</span>
          <p className="festi-gt-text">{gt.batnaAnchor}</p>
        </div>
        <div className="festi-gt-anchor-row">
          <span className="festi-gt-kicker">Reservation Ceiling:</span>
          <p className="festi-gt-text">{gt.reservationCeiling}</p>
        </div>
      </div>

      {gt.paretoTradeoffs.length > 0 && (
        <div className="festi-gt-section">
          <span className="festi-gt-section-title">Pareto-Optimal Value Exchange</span>
          <div className="festi-gt-trades-list">
            {gt.paretoTradeoffs.map((trade, tIdx) => (
              <TradeNode key={tIdx} trade={trade} />
            ))}
          </div>
        </div>
      )}

      {gt.minimaxScenarios.length > 0 && (
        <div className="festi-gt-section">
          <span className="festi-gt-section-title">Minimax Regret Risk Mitigation</span>
          <div className="festi-gt-scenarios-list">
            {gt.minimaxScenarios.map((sc, scIdx) => (
              <ScenarioNode key={scIdx} sc={sc} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * FestiMessageBubble component renders chat bubbles with support for
 * rich agent blueprints (budget matrix, chronological timeline, contracts, game theory).
 */
export const FestiMessageBubble: React.FC<FestiMessageBubbleProps> = ({
  message: m,
  onApplyPlan,
  onSelectSuggestion,
}) => {
  const isUser = m.sender === 'user';
  const showApplyBtn = Boolean(m.budgetArtifact || m.timelineArtifact);

  return (
    <div className={`festi-chat-bubble-row ${isUser ? 'user-row' : 'festi-row'}`}>
      {!isUser && (
        <div className="festi-mini-avatar">
          <img
            src="/festiya-logo-nav.webp"
            alt="Festiya AI Assistant Avatar"
            title="Festiya AI Assistant"
            width={28}
            height={28}
          />
        </div>
      )}

      <div className={`festi-chat-bubble ${isUser ? 'user-bubble' : 'festi-bubble'}`}>
        {m.threatNeutralized && (
          <div className="festi-guard-neutralized-alert">
            <ShieldAlert size={13} style={shieldIconStyle} />
            <span>
              Shield Defended: <strong>{m.threatCategory || 'Off-Topic Shield'}</strong>
            </span>
          </div>
        )}

        {m.agentsEngaged && m.agentsEngaged.length > 0 && (
          <div className="festi-agents-trail">
            <span className="festi-trail-title">Agents active:</span>
            <span className="festi-trail-names">{m.agentsEngaged.join(' • ')}</span>
          </div>
        )}

        <div className="festi-msg-text">
          {renderMessageText(m.text)}
        </div>

        {m.budgetArtifact && renderBudgetArtifact(m.budgetArtifact)}

        {m.timelineArtifact && (
          <div className="festi-artifact-card">
            <div className="festi-artifact-header">
              <span className="festi-artifact-label">Chronological Run of Show</span>
              <span className="festi-artifact-meta">{m.timelineArtifact.occasionName}</span>
            </div>
            <div className="festi-timeline-flow">
              {m.timelineArtifact.items.map((item, tIdx) => (
                <TimelineNode key={tIdx} item={item} />
              ))}
            </div>
          </div>
        )}

        {m.contractArtifact && (
          <div className="festi-artifact-card">
            <div className="festi-artifact-header">
              <span className="festi-artifact-label">Contract Safeguards & Fee Protection</span>
            </div>
            <div className="festi-safeguard-flow">
              {m.contractArtifact.safeguards.map((item, sIdx) => (
                <SafeguardNode key={sIdx} item={item} />
              ))}
            </div>
          </div>
        )}

        {m.gameTheoryArtifact && renderGameTheoryArtifact(m.gameTheoryArtifact)}

        {showApplyBtn && (
          <button
            type="button"
            aria-label="Apply this plan to active workspace"
            className="festi-apply-workspace-btn"
            onClick={() => onApplyPlan(m)}
          >
            <span>Apply this plan to active workspace →</span>
          </button>
        )}

        {m.suggestions && m.suggestions.length > 0 && (
          <div className="festi-msg-suggestions">
            {m.suggestions.map((sug, idx) => (
              <SuggestionPill key={idx} sug={sug} onSelect={onSelectSuggestion} />
            ))}
          </div>
        )}

        <div className="festi-msg-footer">
          <span className="festi-msg-time">{m.time}</span>
          {m.modelUsed && (
            <span className="festi-msg-provider">
              via {m.modelUsed.replace('provider-', '').toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
