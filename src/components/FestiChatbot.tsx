import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Bot, X, ShieldCheck } from 'lucide-react';
import { MultiAgentEngine } from '../services/multiAgentEngine';
import { MultiLLMOrchestrator } from '../services/aiOrchestrator';
import type { LLMMessage } from '../services/aiOrchestrator';
import { FESTI_SYSTEM_PROMPT, MASCOT_FRAMES, FESTI_STARTERS } from '../data/chatbotPrompts';
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
  const [mascotFrame, setMascotFrame] = useState(0);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const defaultOccasion = propOccasionTitle || 'Celebration';
    const initPlan = MultiAgentEngine.executeSwarm('I want to plan a ' + defaultOccasion);
    return [
      {
        id: 'initial-greeting',
        sender: 'festi',
        text: 'Namaste! I am Festi, your multi-agent Celebration Architect. I compose budgets with 0% drift, generate minute-by-minute schedules, and safeguard your event contracts. What are we celebrating?',
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
    const timer = setInterval(() => {
      setMascotFrame((prev) => (prev + 1) % MASCOT_FRAMES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

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

  const currentMascot = MASCOT_FRAMES[mascotFrame];

  return (
    <div className="festi-chatbot-container" role="region" aria-label="Celebration Architect Assistant">
      {!isOpen && (
        <button aria-label="Open Festi Celebration Architect Chat"
          className="festi-chat-fab"
          onClick={() => setIsOpen(true)}
        >
          <div className="festi-fab-mascot">
            <span className="festi-fab-badge">AI</span>
            <Bot size={22} className="festi-fab-icon" />
          </div>
          <span className="festi-fab-label">Chat with Festi</span>
        </button>
      )}

      {isOpen && (
        <div className="festi-chat-panel">
          <div className="festi-chat-header">
            <div className="festi-chat-header-info">
              <div className="festi-avatar-disc" aria-hidden="true">
                <img
                  src={currentMascot.src}
                  alt={currentMascot.alt}
                  width={28}
                  height={28}
                  className="festi-avatar-art"
                />
              </div>
              <div>
                <div className="festi-header-name">
                  <span>Festi</span>
                  <span className="festi-header-pill">Multi-Agent Swarm</span>
                </div>
                <div className="festi-header-status">Celebration Architect • Online</div>
              </div>
            </div>

            <div className="festi-chat-header-actions">
              <button aria-label="Toggle Security Drills"
                type="button"
                className={'festi-header-btn ' + (showDrills ? 'active' : '')}
                onClick={() => setShowDrills(!showDrills)}
                title="Security & Resilience Drills"
              >
                <ShieldCheck size={16} />
                <span>Drills</span>
              </button>
              <button aria-label="Close Festi Chat"
                type="button"
                className="festi-header-btn"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
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
    </div>
  );
};
