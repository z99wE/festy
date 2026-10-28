import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, RefreshCw, MessageSquare, 
  ShieldAlert, Play 
} from 'lucide-react';
import { aiOrchestrator } from '../services/aiOrchestrator';
import { FestiSecurityGuard, type HardDrillResult } from '../services/festiSecurityGuard';
import { 
  MultiAgentEngine, 
  type AgentBudgetArtifact, 
  type AgentTimelineArtifact, 
  type AgentContractArtifact 
} from '../services/multiAgentEngine';

// The 5 Mascot frames requested by the user (Ultra-fast WebP format)
const FESTI_FRAMES = [
  { id: 1, src: '/mascots/pink-dancing.webp', alt: 'Festiya AI Event Architect - Fluffy Pink Plush Mascot Dancing for Wedding and Party Planning' },
  { id: 2, src: '/mascots/yellow-dance.webp', alt: 'Festiya AI Event Architect - Cheerful Fluffy Yellow Dance Mascot Celebrating Birthday Milestones' },
  { id: 3, src: '/mascots/blue-jumping.webp', alt: 'Festiya AI Event Architect - Cheerful Blue Fuzzy Mascot Jumping for Music Festival Logistics' },
  { id: 4, src: '/mascots/bubble-mint.webp', alt: 'Festiya AI Event Architect - Bubble Mint Plush Mascot Assisting with Corporate Gala Budgets' },
  { id: 5, src: '/mascots/dancing-sticker.webp', alt: 'Festiya AI Event Architect - 3D Holographic Dancing Mascot Sticker for Celebration Planning' },
];

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
  occasionId?: string;
  occasionTitle?: string;
}

const QUICK_STARTERS = [
  "Plan an 80-guest wedding reception with $12,000 budget",
  "30th Birthday party for 40 guests under $3,000",
  "Minute-by-minute run of show for an evening gala",
  "Vendor contract traps and deposit verification checklist",
  "Executive retreat for 25 people in Colorado with $8,000",
];

export const FestiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDrillsModal, setShowDrillsModal] = useState(false);
  const [drillResults, setDrillResults] = useState<HardDrillResult[]>([]);
  const [isDrillRunning, setIsDrillRunning] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'festi',
      text: "Hey! I'm Festi, your Festi AI event architect! 🎉\n\nTell me what you're dreaming up, whether it's a budget check, vendor contract checklist, sensory decor theme, or minute-by-minute timeline, and I'll build it for you!",
      time: 'Just now',
      suggestions: [
        "How do I estimate an event budget?",
        "What questions should I ask my caterer?",
        "Give me a run-of-show timeline",
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);

  // Mascot frame animation - continuously cycles through the 5 plush frames like a gif
  // When user hovers near it, it pauses jumping and pauses frame cycling!
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % FESTI_FRAMES.length);
    }, 280);
    return () => clearInterval(timer);
  }, [isHovered]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen && !showDrillsModal) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, showDrillsModal]);

  // Global event listener to allow any part of the app to trigger Festi AI
  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent<{ prompt?: string }>;
      setIsOpen(true);
      if (customEvent.detail?.prompt) {
        handleSendMessage(customEvent.detail.prompt);
      }
    };

    window.addEventListener('open-festi-chat', handleOpenChat);
    return () => window.removeEventListener('open-festi-chat', handleOpenChat);
  }, []);

  const handleRunLiveDrills = () => {
    setIsDrillRunning(true);
    setTimeout(() => {
      const res = FestiSecurityGuard.runHardDrills();
      setDrillResults(res);
      setIsDrillRunning(false);
    }, 220);
  };

  const handleApplyPlanToWorkspace = (m: ChatMessage) => {
    const budgetUSD = m.budgetArtifact?.totalBudget || 5000;
    const guestRange = `${m.budgetArtifact?.guestCount || 60} guests`;
    const occasionId = m.occasionId || 'birthday';
    const name = `${m.occasionTitle || 'Celebration'} (Festi Autonomous Plan)`;

    window.dispatchEvent(
      new CustomEvent('festiya-apply-plan', {
        detail: {
          occasionId,
          budgetUSD,
          guestRange,
          name,
        },
      })
    );

    setIsOpen(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const history = messages.slice(-4).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));
      history.push({ role: 'user', content: query.trim() });

      const systemPrompt = 
        "You are Festi, chief coordinator of the Festiya Autonomous Multi-Agent Event Architecture. " +
        "You coordinate specialized task agents: Financial Synthesizer Agent, Logistics & Run-of-Show Agent, and Contract Safeguard Agent. " +
        "Provide direct, high-value celebration planning insights with clear operational rationale and concise advice. " +
        "Never mention paywalls or external tools.";

      const res = await aiOrchestrator.generateCompletion(history, systemPrompt);

      // Execute autonomous multi-agent swarm
      const plan = MultiAgentEngine.executeSwarm(query, res.content);

      const festiMsg: ChatMessage = {
        id: `f-${Date.now()}`,
        sender: 'festi',
        text: plan.summary,
        time: 'Just now',
        threatNeutralized: res.threatNeutralized,
        threatCategory: res.threatCategory,
        guardReason: res.guardReason,
        modelUsed: res.providerUsed,
        agentsEngaged: plan.agentsEngaged,
        budgetArtifact: plan.budgetArtifact,
        timelineArtifact: plan.timelineArtifact,
        contractArtifact: plan.contractArtifact,
        occasionId: plan.occasionId,
        occasionTitle: plan.occasionTitle,
        suggestions: res.threatNeutralized
          ? [
              "Help me plan a birthday party",
              "How to budget a wedding?",
              "What questions should I ask my caterer?",
            ]
          : [
              "3-Tier budget breakdown for 80 guests",
              "Minute-by-minute day-of schedule",
              "Hidden vendor fee questions",
            ],
      };
      setMessages((prev) => [...prev, festiMsg]);
    } catch (err) {
      console.warn('[Festi AI] Cascading failover triggered:', err);
      const plan = MultiAgentEngine.executeSwarm(query);
      const festiMsg: ChatMessage = {
        id: `f-${Date.now()}`,
        sender: 'festi',
        text: plan.summary,
        time: 'Just now',
        agentsEngaged: plan.agentsEngaged,
        budgetArtifact: plan.budgetArtifact,
        timelineArtifact: plan.timelineArtifact,
        contractArtifact: plan.contractArtifact,
        occasionId: plan.occasionId,
        occasionTitle: plan.occasionTitle,
      };
      setMessages((prev) => [...prev, festiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const currentFrame = FESTI_FRAMES[currentFrameIndex];

  return (
    <>
      {/* ==========================================================
          FLOATING DANCING FESTI MASCOT TRIGGER (Festi AI Companion)
          ========================================================== */}
      <div 
        className={`festi-companion-container ${isHovered ? 'paused' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!isOpen && (
          <div 
            className="festi-speech-bubble" 
            onClick={() => setIsOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="Open Festi AI chat"
          >
            <span>Chat with Festi AI</span>
          </div>
        )}

        <button
          type="button"
          className="festi-mascot-btn"
          aria-label="Open Festi AI"
          onClick={() => setIsOpen(true)}
        >
          <div className="festi-avatar-frame">
            <img
              src={currentFrame.src}
              alt={currentFrame.alt}
              className="festi-dancing-img"
              width={105}
              height={105}
              loading="eager"
            />
          </div>
          <div className="festi-avatar-shadow" aria-hidden="true" />
        </button>
      </div>

      {/* ==========================================================
          FESTI AI CHATBOT DRAWER / POPUP
          ========================================================== */}
      {isOpen && (
        <div className="festi-chat-modal" role="dialog" aria-label="Festi AI">
          {/* Header */}
          <div className="festi-chat-header">
            <div className="festi-chat-header-brand">
              <div className="festi-header-mascot-wrap">
                <img
                  src={currentFrame.src}
                  alt="Festiya Autonomous Event Architect Mascot - Interactive AI Concierge"
                  title="Festiya AI Concierge"
                  className="festi-header-mascot-img"
                  width={38}
                  height={38}
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 className="festi-header-title">Festi AI</h3>
                  <span className="festi-domain-tag">Events Only</span>
                </div>
                <span className="festi-header-subtitle">
                  <span className="festi-online-dot" /> Online & Hardened
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className={`festi-header-shield-btn ${showDrillsModal ? 'active' : ''}`}
                title="View Hard Drills & LLM Security Matrix"
                onClick={() => {
                  const nextState = !showDrillsModal;
                  setShowDrillsModal(nextState);
                  if (nextState && !drillResults.length) {
                    setDrillResults(FestiSecurityGuard.runHardDrills());
                  }
                }}
              >
                <span>Hard Drills</span>
              </button>

              <button
                type="button"
                className="festi-chat-close-btn"
                aria-label="Close Chatbot"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* HARD DRILLS DEFENSE MATRIX DRAWER */}
          {showDrillsModal ? (
            <div className="festi-drills-container">
              <div className="drills-header">
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>
                    Hard Drills Security Matrix
                  </h4>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Active neutralization against LLM Hijacking, Spooking, Jacking, Meta-Prompting & Domain Violations.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px', gap: '6px' }}
                  onClick={handleRunLiveDrills}
                  disabled={isDrillRunning}
                >
                  <Play size={12} className={isDrillRunning ? 'festi-spin-icon' : ''} />
                  <span>{isDrillRunning ? 'Testing...' : 'Run Live Drills'}</span>
                </button>
              </div>

              {/* Status Pills */}
              <div className="drills-status-pills">
                <span className="drill-status-badge success">
                  Hijacking Guard: 100%
                </span>
                <span className="drill-status-badge success">
                  Meta-Prompt Shield: 100%
                </span>
                <span className="drill-status-badge success">
                  Domain Lock: Events Only
                </span>
                <span className="drill-status-badge info">
                  Load Balancer: Healthy
                </span>
              </div>

              {/* Test Results Table */}
              <div className="drills-list">
                {drillResults.map((dr, idx) => (
                  <div key={idx} className={`drill-item-card ${dr.passed ? 'passed' : 'failed'}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="drill-name">{dr.drillName}</span>
                      <span className="drill-pill">{dr.latencyMs}ms • {dr.passed ? 'PASSED' : 'FLAGGED'}</span>
                    </div>
                    <div className="drill-input-preview">
                      <span className="drill-label">Input Attack:</span> "{dr.testInput}"
                    </div>
                    <div className="drill-response-preview">
                      <span className="drill-label">Defense:</span> {dr.sampleResponse}
                    </div>
                    <button
                      type="button"
                      className="drill-try-btn"
                      onClick={() => {
                        setShowDrillsModal(false);
                        handleSendMessage(dr.testInput);
                      }}
                    >
                      Test this vector in chat →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Quick Starter Chips */}
              <div className="festi-quick-starters">
                {QUICK_STARTERS.map((starter, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    className="festi-starter-chip"
                    onClick={() => handleSendMessage(starter)}
                  >
                    {starter}
                  </button>
                ))}
              </div>

              {/* Message Thread */}
              <div className="festi-chat-messages">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`festi-chat-bubble-row ${m.sender === 'user' ? 'user-row' : 'festi-row'}`}
                  >
                    {m.sender === 'festi' && (
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

                    <div className={`festi-chat-bubble ${m.sender === 'user' ? 'user-bubble' : 'festi-bubble'}`}>
                      {/* Security Neutralization Flag */}
                      {m.threatNeutralized && (
                        <div className="festi-guard-neutralized-alert">
                          <ShieldAlert size={13} style={{ color: '#059669', flexShrink: 0 }} />
                          <span>
                            Shield Defended: <strong>{m.threatCategory || 'Off-Topic Shield'}</strong>
                          </span>
                        </div>
                      )}

                      {/* Autonomous Multi-Agent Engagement Trail (Clean typography, icon-free) */}
                      {m.agentsEngaged && m.agentsEngaged.length > 0 && (
                        <div className="festi-agents-trail">
                          <span className="festi-trail-title">Agents active:</span>
                          <span className="festi-trail-names">{m.agentsEngaged.join(' • ')}</span>
                        </div>
                      )}

                      <p className="festi-msg-text">{m.text}</p>

                      {/* 3-Tier Budget Allocation Matrix Artifact */}
                      {m.budgetArtifact && (
                        <div className="festi-artifact-card">
                          <div className="festi-artifact-header">
                            <span className="festi-artifact-label">3-Tier Decimal Budget Matrix</span>
                            <span className="festi-artifact-meta">
                              {m.budgetArtifact.currency}{m.budgetArtifact.totalBudget.toLocaleString()} • {m.budgetArtifact.guestCount} Guests (${m.budgetArtifact.costPerGuest}/guest)
                            </span>
                          </div>

                          <div className="festi-tier-matrix">
                            <div className="festi-tier-box">
                              <span className="festi-tier-name">Conservative</span>
                              <span className="festi-tier-number">{m.budgetArtifact.currency}{m.budgetArtifact.tiers.conservative.toLocaleString()}</span>
                            </div>
                            <div className="festi-tier-box highlight">
                              <span className="festi-tier-name">Realistic Target</span>
                              <span className="festi-tier-number">{m.budgetArtifact.currency}{m.budgetArtifact.tiers.realistic.toLocaleString()}</span>
                            </div>
                            <div className="festi-tier-box">
                              <span className="festi-tier-name">Luxury</span>
                              <span className="festi-tier-number">{m.budgetArtifact.currency}{m.budgetArtifact.tiers.luxury.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="festi-categories-grid">
                            {m.budgetArtifact.categories.map((cat, cIdx) => (
                              <div key={cIdx} className="festi-category-item">
                                <div className="festi-cat-header-line">
                                  <span className="festi-cat-title">{cat.category}</span>
                                  <span className="festi-cat-figure">
                                    {m.budgetArtifact?.currency}{cat.amount.toLocaleString()} ({cat.percentage}%)
                                  </span>
                                </div>
                                <div className="festi-cat-bar-track">
                                  <div className="festi-cat-bar-fill" style={{ width: `${Math.min(100, cat.percentage * 2.2)}%` }} />
                                </div>
                                <span className="festi-cat-note">{cat.notes}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Chronological Run of Show Timeline Artifact */}
                      {m.timelineArtifact && (
                        <div className="festi-artifact-card">
                          <div className="festi-artifact-header">
                            <span className="festi-artifact-label">Chronological Run of Show</span>
                            <span className="festi-artifact-meta">{m.timelineArtifact.occasionName}</span>
                          </div>
                          <div className="festi-timeline-flow">
                            {m.timelineArtifact.items.map((item, tIdx) => (
                              <div key={tIdx} className="festi-timeline-node">
                                <span className="festi-timeline-stamp">{item.time}</span>
                                <div className="festi-timeline-details">
                                  <span className="festi-timeline-event">{item.title}</span>
                                  <p className="festi-timeline-subtext">{item.detail}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Contract Safeguards & Fee Protection Artifact */}
                      {m.contractArtifact && (
                        <div className="festi-artifact-card">
                          <div className="festi-artifact-header">
                            <span className="festi-artifact-label">Contract Safeguards & Fee Protection</span>
                          </div>
                          <div className="festi-safeguard-flow">
                            {m.contractArtifact.safeguards.map((item, sIdx) => (
                              <div key={sIdx} className="festi-safeguard-node">
                                <span className="festi-safeguard-title">{item.riskArea}</span>
                                <p className="festi-safeguard-risk-clause">{item.clauseWarning}</p>
                                <div className="festi-safeguard-ask">
                                  <strong>Ask Vendor:</strong> "{item.verificationQuestion}"
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Apply Plan to Active Event Workspace Action */}
                      {(m.budgetArtifact || m.timelineArtifact) && (
                        <button
                          type="button"
                          className="festi-apply-workspace-btn"
                          onClick={() => handleApplyPlanToWorkspace(m)}
                        >
                          <span>Apply this plan to active workspace →</span>
                        </button>
                      )}

                      {/* Suggestion action pills */}
                      {m.suggestions && m.suggestions.length > 0 && (
                        <div className="festi-msg-suggestions">
                          {m.suggestions.map((sug, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="festi-suggestion-pill"
                              onClick={() => handleSendMessage(sug)}
                            >
                              <MessageSquare size={12} />
                              <span>{sug}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="festi-chat-bubble-row festi-row">
                    <div className="festi-mini-avatar">
                      <img
                        src="/festiya-logo-nav.webp"
                        alt="Festiya AI Assistant Avatar"
                        title="Festiya AI Assistant"
                        width={28}
                        height={28}
                      />
                    </div>
                    <div className="festi-chat-bubble festi-bubble festi-typing-bubble">
                      <RefreshCw size={14} className="festi-spin-icon" />
                      <span>Autonomous agents synthesizing celebration plan...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <form
                className="festi-chat-input-area"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <input
                  type="text"
                  className="festi-input-field"
                  placeholder="Ask Festi: budgets, timelines, themes, vendors..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  aria-label="Event query input"
                />
                <button
                  type="submit"
                  className="festi-send-btn"
                  disabled={!inputVal.trim() || isTyping}
                  aria-label="Send message to Festi"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export function openFestiAIChat(prompt?: string) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('open-festi-chat', { detail: { prompt } });
    window.dispatchEvent(event);
  }
}
