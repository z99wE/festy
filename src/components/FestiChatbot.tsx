import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';
import { aiOrchestrator } from '../services/aiOrchestrator';

// The 5 Mascot frames requested by the user (Ultra-fast WebP format)
const FESTI_FRAMES = [
  { id: 1, src: '/mascots/pink-dancing.webp', alt: 'Fluffy PINK Dancing Mascot' },
  { id: 2, src: '/mascots/yellow-dance.webp', alt: 'Cheerful Fluffy Yellow Dance Mascot' },
  { id: 3, src: '/mascots/blue-jumping.webp', alt: 'Cheerful Blue Fuzzy Mascot Jumping' },
  { id: 4, src: '/mascots/bubble-mint.webp', alt: 'Bubble Mint Plush Mascot' },
  { id: 5, src: '/mascots/dancing-sticker.webp', alt: 'Fluffy Dancing Mascot Sticker' },
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'festi';
  text: string;
  time: string;
  suggestions?: string[];
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
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'festi',
      text: "Hey! I'm Festi, your AI celebration copilot! 🎉\n\nTell me what you're dreaming up, whether it's a budget check, venue negotiation tip, sensory decor theme, or minute-by-minute timeline, and I'll build it for you!",
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
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const generateFestiResponse = (query: string): string => {
    const q = query.toLowerCase();

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
   • Finalize caterer tasting & photographer
   • Send paperless or dynamic RSVP invitations

3. 1 Month Out:
   • Confirm guest headcount and dietary notes
   • Finalize minute-by-minute run-of-show cues

4. Day-Of Pacing:
   • 4:00 PM Ceremony → 4:45 PM Cocktails & Golden Hour Photos → 6:15 PM Grand Entrance & Dinner → 8:00 PM Dance Floor Opens!

Want me to customize this for your specific guest count or venue style?`;
    }

    if (q.includes('birthday') || q.includes('party') || q.includes('anniversary')) {
      return `Milestone celebrations should feel like pure joy, not stress! 🎂🥳

Here is how to make it unforgettable:

1. Dynamic Energy Curve:
   • First 45 mins: Warm ambient music + welcome signature drink
   • Mid-event: 15-minute high-energy activity (trivia, roast/toast, or surprise video montage)
   • Final 2 hours: Open dance floor and late-night comfort snack bite (sliders or churros)

2. Decor High-Impact Trick:
   • Focus 80% of decor budget on a single photo centerpiece backdrop rather than spreading thin across 10 tables.

3. Headcount Planning:
   • Expect an 80-85% attendance rate for local guests; plan drink quantities at 1.5 drinks per person per hour for the first two hours.`;
    }

    if (q.includes('timeline') || q.includes('schedule') || q.includes('run of show') || q.includes('time')) {
      return `Here is a bulletproof Day-Of Run-Of-Show framework: 📋⏱️

• T-3 Hours: Vendor load-in (sound check, floral drop, staging)
• T-45 Mins: Host arrival & final walkthrough
• 00:00: Doors open, welcome drinks & background playlist
• +00:45: Welcome remarks & formal kick-off
• +01:15: Meal service / food activation opens
• +02:15: Highlight moment (toast, keynote, cake cutting, or award)
• +02:45: Music shift & social floor open
• +04:00: Last call announced & sparkler/confetti send-off

Need a customized version for an evening dinner or daytime carnival? Tell me your start time!`;
    }

    if (q.includes('cater') || q.includes('food') || q.includes('drink') || q.includes('bar')) {
      return `Here are 4 Insider Vendor Questions to save 15-25% on Catering: 🍽️✨

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

      const systemPrompt = "You are Festi, the cheerful, energetic, and deeply knowledgeable AI celebration copilot for Festiya. Provide structured, actionable, and fun advice on event budgets, schedules, timelines, and vendor tips. Keep responses lively and concise.";

      const res = await aiOrchestrator.generateCompletion(history, systemPrompt);

      const festiMsg: ChatMessage = {
        id: `f-${Date.now()}`,
        sender: 'festi',
        text: res.content,
        time: 'Just now',
        suggestions: [
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
          FLOATING DANCING FESTI MASCOT TRIGGER (Corner Assistant)
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
          aria-label="Open Festi AI Event Assistant Chatbot"
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
        <div className="festi-chat-modal" role="dialog" aria-label="Festi AI Assistant">
          {/* Header */}
          <div className="festi-chat-header">
            <div className="festi-chat-header-brand">
              <div className="festi-header-mascot-wrap">
                <img
                  src={currentFrame.src}
                  alt="Festi Dancing Copilot"
                  className="festi-header-mascot-img"
                />
              </div>
              <div>
                <h3 className="festi-header-title">Festi AI Copilot</h3>
                <span className="festi-header-subtitle">
                  <span className="festi-online-dot" /> Online & Planning
                </span>
              </div>
            </div>

            <button
              type="button"
              className="festi-chat-close-btn"
              aria-label="Close Chatbot"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

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
                  <span>Festi is crafting your plan...</span>
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
        </div>
      )}
    </>
  );
};
