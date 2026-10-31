import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, ShieldCheck, Maximize2, Minimize2 } from 'lucide-react';
import { MultiAgentEngine } from '../services/multiAgentEngine';
import { MultiLLMOrchestrator } from '../services/aiOrchestrator';
import type { LLMMessage } from '../services/aiOrchestrator';
import { FESTI_SYSTEM_PROMPT, FESTI_STARTERS } from '../data/chatbotPrompts';
import type { ChatMessage } from './FestiMessageBubble';
import { FestiDrillsView } from './FestiDrillsView';
import { FestiChatBody } from './FestiChatBody';

function toLlmMessage(m: ChatMessage): LLMMessage {
  const role = m.sender === 'user' ? 'user' : 'assistant';
  return { role, content: m.text };
}

export interface FestiChatbotProps {
  onApplyPlan?: (plan: {
    budgetArtifact?: ChatMessage['budgetArtifact'];
    timelineArtifact?: ChatMessage['timelineArtifact'];
    contractArtifact?: ChatMessage['contractArtifact'];
    gameTheoryArtifact?: ChatMessage['gameTheoryArtifact'];
  }) => void;
  occasionId?: string;
  occasionTitle?: string;
}

const aiOrchestrator = new MultiLLMOrchestrator();

function createFestiMessage(plan: any, res?: any): ChatMessage {
  const suggestions = res && res.threatNeutralized
    ? ['Help me plan a birthday party', 'How to budget a wedding?', 'What questions should I ask my caterer?']
    : ['3-Tier budget breakdown for 80 guests', 'Minute-by-minute day-of schedule', 'Game-theoretic vendor bargaining strategy'];

  return {
    id: 'f-' + Date.now(),
    sender: 'festi',
    text: plan.summary,
    time: 'Just now',
    threatNeutralized: res ? res.threatNeutralized : undefined,
    threatCategory: res ? res.threatCategory : undefined,
    guardReason: res ? res.guardReason : undefined,
    modelUsed: res ? res.providerUsed : undefined,
    agentsEngaged: plan.agentsEngaged,
    budgetArtifact: plan.budgetArtifact,
    timelineArtifact: plan.timelineArtifact,
    contractArtifact: plan.contractArtifact,
    gameTheoryArtifact: plan.gameTheoryArtifact,
    occasionId: plan.occasionId,
    occasionTitle: plan.occasionTitle,
    suggestions,
  };
}

/**
 * FestiChatbot acts as the interactive Celebration Architect orchestrating multi-agent
 * intelligence, adversarial defense drills, and structured celebration plans.
 */
export const FestiChatbot: React.FC<FestiChatbotProps> = ({
  onApplyPlan,
  occasionId: propOccasionId,
  occasionTitle: propOccasionTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDrills, setShowDrills] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const defaultOccasion = propOccasionTitle || 'Celebration';
    const initPlan = MultiAgentEngine.executeSwarm('I want to plan a ' + defaultOccasion);
    return [
      {
        id: 'initial-greeting',
        sender: 'festi',
        text: 'Hola! I am Festi, your Celebration Architect. I compose itemized budgets, generate minute-by-minute schedules, and safeguard your event contracts. What are we celebrating?',
        time: 'Just now',
        agentsEngaged: ['BudgetArchitectAgent', 'LogisticsOrchestratorAgent'],
        budgetArtifact: initPlan.budgetArtifact,
        timelineArtifact: initPlan.timelineArtifact,
        occasionId: propOccasionId,
        occasionTitle: defaultOccasion,
        suggestions: FESTI_STARTERS,
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handleSendRef = useRef<(queryText?: string) => Promise<void>>(() => Promise.resolve());

  useEffect(() => {
    if (isOpen) return undefined;
    let blinkTimer: ReturnType<typeof setTimeout>;
    let resetTimer: ReturnType<typeof setTimeout>;

    const triggerBlink = () => {
      setIsBlinking(true);
      resetTimer = setTimeout(() => {
        setIsBlinking(false);
        scheduleNext();
      }, 180);
    };

    const scheduleNext = () => {
      blinkTimer = setTimeout(triggerBlink, 4500 + Math.random() * 2000);
    };

    scheduleNext();

    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(resetTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent<{ prompt?: string }>;
      setIsOpen(true);
      const prompt = customEvent.detail ? customEvent.detail.prompt : undefined;
      if (prompt) {
        handleSendRef.current(prompt);
      }
    };

    window.addEventListener('open-festi-chat', handleOpenChat);
    return () => window.removeEventListener('open-festi-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const activeStarterList = useMemo(() => {
    if (propOccasionTitle) {
      return [
        '3-Tier budget for ' + propOccasionTitle,
        'Day-of schedule for ' + propOccasionTitle,
        'Vendor negotiation strategy',
      ];
    }
    return FESTI_STARTERS;
  }, [propOccasionTitle]);

  const handleSend = async (queryText?: string) => {
    const query = queryText || inputVal;
    if (!query.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: query.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const history = messages.slice(-4).map(toLlmMessage);
      history.push({ role: 'user', content: query.trim() });

      const res = await aiOrchestrator.generateCompletion(history, FESTI_SYSTEM_PROMPT);
      const plan = MultiAgentEngine.executeSwarm(query, res.content);
      const festiMsg = createFestiMessage(plan, res);
      setMessages((prev) => [...prev, festiMsg]);
    } catch {
      const plan = MultiAgentEngine.executeSwarm(query);
      const fallbackMsg = createFestiMessage(plan);
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    handleSendRef.current = handleSend;
  });

  const handleApplyPlanToWorkspace = (msg: ChatMessage) => {
    if (!onApplyPlan) return;
    onApplyPlan({
      budgetArtifact: msg.budgetArtifact,
      timelineArtifact: msg.timelineArtifact,
      contractArtifact: msg.contractArtifact,
      gameTheoryArtifact: msg.gameTheoryArtifact,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const currentMascot = {
    src: isBlinking ? '/mascots/pink-dancing-blink.webp' : '/mascots/pink-dancing.webp',
    alt: 'Festiya AI Event Architect - Pink Plush Mascot Dancing',
  };

  return (
    <>
      {!isOpen && (
        <div
          className="festi-companion-container"
          role="region"
          aria-label="Celebration Architect Assistant"
        >
          <div
            className="festi-speech-bubble"
            onClick={() => setIsOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOpen(true);
              }
            }}
            aria-label="Ask Festi AI Celebration Architect"
          >
            <span>Ask Festi AI</span>
          </div>
          <button
            type="button"
            aria-label="Open Festi AI Event Architect Chat"
            className="festi-mascot-btn"
            onClick={() => setIsOpen(true)}
          >
            <div className="festi-avatar-frame">
              <img
                src={currentMascot.src}
                alt={currentMascot.alt}
                width={105}
                height={105}
                className="festi-dancing-img"
              />
            </div>
            <div className="festi-avatar-shadow" aria-hidden="true" />
          </button>
        </div>
      )}

      {isOpen && (
        <div className={'festi-chat-modal ' + (isMaximized ? 'maximized' : '')} role="dialog" aria-modal="true" aria-label="Festi AI Event Architect">
          <div className="festi-chat-header">
            <div className="festi-chat-header-brand">
              <div className="festi-header-mascot-wrap" aria-hidden="true">
                <img
                  src={currentMascot.src}
                  alt={currentMascot.alt}
                  width={32}
                  height={32}
                  className="festi-header-mascot-img"
                />
              </div>
              <div>
                <div className="festi-header-title">
                  <span>Festi</span>
                </div>
                <div className="festi-header-subtitle">
                  <span className="festi-online-dot" aria-hidden="true"></span>
                  <span>Celebration Architect • Online</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                aria-label="Toggle Security Drills"
                type="button"
                className={'festi-header-shield-btn ' + (showDrills ? 'active' : '')}
                onClick={() => setShowDrills(!showDrills)}
                title="Security & Resilience Drills"
              >
                <ShieldCheck size={16} />
                <span>Drills</span>
              </button>
              <button
                aria-label={isMaximized ? "Restore Chat Window size" : "Maximize Chat Window"}
                type="button"
                className={'festi-chat-maximize-btn ' + (isMaximized ? 'active' : '')}
                onClick={() => setIsMaximized(!isMaximized)}
                title={isMaximized ? "Restore size" : "Maximize size"}
              >
                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                aria-label="Close Festi Chat"
                type="button"
                className="festi-chat-close-btn"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {showDrills ? (
            <FestiDrillsView />
          ) : (
            <FestiChatBody
              messages={messages}
              isTyping={isTyping}
              activeStarterList={activeStarterList}
              onSendMessage={handleSend}
              onApplyPlan={handleApplyPlanToWorkspace}
              messagesEndRef={messagesEndRef}
              inputVal={inputVal}
              onInputChange={handleInputChange}
              onInputSubmit={handleInputSubmit}
            />
          )}
        </div>
      )}
    </>
  );
};
