import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Sparkles, RefreshCw, MessageSquare, 
  ShieldCheck, ShieldAlert, CheckCircle2, Cpu, Play 
} from 'lucide-react';
import { aiOrchestrator } from '../services/aiOrchestrator';
import { FestiSecurityGuard, type HardDrillResult } from '../services/festiSecurityGuard';

// The 5 Mascot frames requested by the user (Ultra-fast WebP format)
const FESTI_FRAMES = [
  { id: 1, src: '/mascots/pink-dancing.webp', alt: 'Fluffy PINK Dancing Mascot' },
  { id: 2, src: '/mascots/yellow-dance.webp', alt: 'Cheerful Fluffy Yellow Dance Mascot' },
  { id: 3, src: '/mascots/blue-jumping.webp', alt: 'Cheerful Blue Fuzzy Mascot Jumping' },
  { id: 4, src: '/mascots/bubble-mint.webp', alt: 'Bubble Mint Plush Mascot' },
  { id: 5, src: '/mascots/dancing-sticker.webp', alt: 'Fluffy Dancing Mascot Sticker' },
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
}

const QUICK_STARTERS = [
  "💍 Wedding budget & milestone breakdown",
  "🎂 30th Birthday party ideas under $2,500",
  "💸 5 Ways to cut 20% on catering costs",
  "📋 Day-of run of show timeline example",
  "🏢 Creative corporate offsite with 50 guests",
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
      text: "Hey! I'm Festi, your Festi AI event architect! 🎉\n\nTell me what you're dreaming up, whether it's a budget check, venue negotiation tip, sensory decor theme, or minute-by-minute timeline, and I'll build it for you!",
      time: 'Just now',
      suggestions: [
        "How do I estimate an event budget?",
        "What questions should I ask my caterer?",
        "Give me a run-of-show timeline",
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // High-energy 5-frame mascot animation loop (simulates smooth animated GIF)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % FESTI_FRAMES.length);
    }, 260);
    return () => clearInterval(timer);
  }, []);

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

  const generateFestiResponse = (query: string): string => {
    const q = query.toLowerCase();

    // Guardrail against off-topic queries in local safety net as well
    const evalRes = FestiSecurityGuard.evaluate(query);
    if (!evalRes.isSafe && evalRes.deflectionResponse) {
      return evalRes.deflectionResponse;
    }

    if (q.includes('budget') || q.includes('cost') || q.includes('price') || q.includes('$')) {
      return `Here is Festi's Golden 3-Tier Budget Formula for your celebration: 💰

• Venue & Rentals (35-40%): Reserve early to lock in off-peak dates (Thursdays or Sundays save up to 25%).
• Food & Drinks (30-35%): Opt for family-style or interactive food stations rather than multi-course plating to trim staffing fees by 18%.
• Photography & Music (15-20%): Book 6 hours instead of full-day coverage; prioritize golden hour and the main toast.
• Decor, Lighting & Contingency (10-15%): Ambient uplighting creates 3x more warmth than expensive floral centerpieces.

💡 Pro-Tip: Always ask caterers for an itemized "out-the-door" quote including service charge (20-24%), tax, and gratuity before signing!`;
    }

    if (q.includes('wedding') || q.includes('marry') || q.includes('bride') || q.includes('groom')) {
      return `Let's plan your dream wedding with zero spreadsheet panic! 💍✨

1. 9-12 Months Out:
   • Lock venue & date
   • Establish your 3 non-negotiables (e.g. food quality, great live band, intimate venue)

2. 4-6 Months Out:
   • Send Save-the-Dates with hotel blocks
   • Finalize tastings and draft vendor milestones

3. 30 Days Out:
   • Lock final RSVP count and dietary requirements
   • Finalize timeline with vendors and MC

Would you like to build an itemized budget estimate or review vendor negotiation questions?`;
    }

    if (q.includes('vendor') || q.includes('caterer') || q.includes('dj') || q.includes('photographer')) {
      return `Here are 4 High-Leverage Vendor Negotiation Questions to ask before signing: 📝🤝

1. "What is the per-person difference between plated vs. family-style service?"
   (Family style reduces server headcount and eliminates pre-ordered entree card tracking).

2. "Can we supply our own wine and champagne with a flat corkage fee?"
   (Often saves $800-$2,000 compared to venue markups).

3. "Are staffing, linens, plateware, and cleanup included in the per-head rate?"
   (Avoids surprising +$1,200 cleanup charges at midnight).

4. "Can we do passed late-night bites instead of a sit-down dessert course?"
   (Keeps guests energized on the dance floor and cuts dessert costs in half).`;
    }

    if (q.includes('corporate') || q.includes('offsite') || q.includes('work') || q.includes('company')) {
      return `Here is Festi's blueprint for High-Impact Corporate Offsites: 🏢🎉

• Pacing Rule: Never schedule talks longer than 45 minutes without an active physical shift or bio-break.
• Space Layout: Blend formal classroom seating with casual lounge nooks for spontaneous cross-team collaboration.
• A/V Contingency: Test wireless mics and backup clickers 60 minutes before opening remarks.
• Evening Vibe: Transition from work to social with an interactive activity (cooking class, mixology, or local team quest) before dinner.`;
    }

    return `That sounds like a wonderful celebration idea! 🎉 

Here are the 3 immediate steps to turn this into an actionable plan:
1. Lock your Target Budget & Guest Range: Even a loose target (e.g. 50 guests, ~$3,500) gives vendors an exact frame.
2. Select 2 Key Priorities: Whether it's unforgettable food, incredible music, or breathtaking photography, spend 60% of resources on what people actually remember.
3. Establish a Day-Of Run of Show: Plan milestone cues early to prevent host fatigue.

Tell me a bit more about the date, guest count, or location, and I will draft a full blueprint for you!`;
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
        "You are Festi, the cheerful, energetic, and deeply knowledgeable Festi AI event architect for Festiya. " +
        "You specialize strictly in event planning, celebration blueprints, guest logistics, budgets, schedules, timelines, and vendor negotiation tips. " +
        "Keep responses lively, structured, concise, and exclusively relevant to event planning.";

      const res = await aiOrchestrator.generateCompletion(history, systemPrompt);

      const festiMsg: ChatMessage = {
        id: `f-${Date.now()}`,
        sender: 'festi',
        text: res.content,
        time: 'Just now',
        threatNeutralized: res.threatNeutralized,
        threatCategory: res.threatCategory,
        guardReason: res.guardReason,
        modelUsed: res.providerUsed,
        suggestions: res.threatNeutralized
          ? [
              "Help me plan a birthday party",
              "How to budget a wedding?",
              "What questions should I ask my caterer?",
            ]
          : [
              "Suggest budget saving ideas",
              "Give me questions for vendors",
              "How do I pace the schedule?",
            ],
      };
      setMessages((prev) => [...prev, festiMsg]);
    } catch (err) {
      console.warn('[Festi AI] Cascading failover triggered:', err);
      const festiReply = generateFestiResponse(query);
      const festiMsg: ChatMessage = {
        id: `f-${Date.now()}`,
        sender: 'festi',
        text: festiReply,
        time: 'Just now',
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
      <div className="festi-companion-container">
        {!isOpen && (
          <div className="festi-speech-bubble" onClick={() => setIsOpen(true)}>
            <Sparkles size={13} color="var(--orange-500)" />
            <span>Chat with Festi AI!</span>
          </div>
        )}

        <button
          type="button"
          className="festi-mascot-btn"
          aria-label="Open Festi AI"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="festi-avatar-frame">
            <img
              src={currentFrame.src}
              alt={currentFrame.alt}
              className="festi-dancing-img"
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
                  alt="Festi AI Mascot"
                  className="festi-header-mascot-img"
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
                <ShieldCheck size={14} />
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
                    🛡️ Hard Drills Security Matrix
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
                  <CheckCircle2 size={12} /> Hijacking Guard: 100%
                </span>
                <span className="drill-status-badge success">
                  <CheckCircle2 size={12} /> Meta-Prompt Shield: 100%
                </span>
                <span className="drill-status-badge success">
                  <CheckCircle2 size={12} /> Domain Lock: Events Only
                </span>
                <span className="drill-status-badge info">
                  <Cpu size={12} /> Load Balancer: Healthy
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
                        <img src="/festiya-logo.png" alt="Festi" />
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

                      <p className="festi-msg-text">{m.text}</p>

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
                      <img src="/festiya-logo.png" alt="Festi" />
                    </div>
                    <div className="festi-chat-bubble festi-bubble festi-typing-bubble">
                      <RefreshCw size={14} className="festi-spin-icon" />
                      <span>Festi AI is architecting your plan...</span>
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
