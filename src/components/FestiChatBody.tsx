import React from 'react';
import { RefreshCw, Send } from 'lucide-react';
import type { ChatMessage } from './FestiMessageBubble';
import { FestiMessageBubble } from './FestiMessageBubble';

interface FestiChatBodyProps {
  messages: ChatMessage[];
  isTyping: boolean;
  activeStarterList: string[];
  onSendMessage: (query: string) => void;
  onApplyPlan: (msg: ChatMessage) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  inputVal: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputSubmit: (e: React.FormEvent) => void;
}

/**
 * FestiChatBody renders the chat conversation thread, starters, and input composer.
 */
export const FestiChatBody: React.FC<FestiChatBodyProps> = ({
  messages,
  isTyping,
  activeStarterList,
  onSendMessage,
  onApplyPlan,
  messagesEndRef,
  inputVal,
  onInputChange,
  onInputSubmit,
}) => {
  return (
    <>
      <div className="festi-chat-body" role="log" aria-live="polite">
        <div className="festi-quick-starters">
          <span className="starters-label">Explore celebration intelligence:</span>
          <div className="starters-scroll">
            {activeStarterList.map((starter, idx) => (
              <button key={idx} aria-label={'Ask Festi: ' + starter}
                type="button"
                className="starter-chip"
                onClick={() => onSendMessage(starter)}
              >
                {starter}
              </button>
            ))}
          </div>
        </div>

        {messages.map((m) => (
          <FestiMessageBubble
            key={m.id}
            message={m}
            onApplyPlan={onApplyPlan}
            onSelectSuggestion={onSendMessage}
          />
        ))}

        {isTyping && (
          <div className="festi-typing-indicator" role="status" aria-label="Festi is planning">
            <div className="festi-typing-bubble">
              <RefreshCw size={14} className="festi-spin-icon" />
              <span>Orchestrating celebration intelligence across agents...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="festi-chat-input-bar" onSubmit={onInputSubmit}>
        <input
          id="festi-chat-input-field"
          aria-label="Chat input"
          type="text"
          placeholder="Ask about budget, timeline, contracts..."
          value={inputVal}
          onChange={onInputChange}
          className="festi-chat-input"
          disabled={isTyping}
        />
        <button aria-label="Send message"
          type="submit"
          className="festi-chat-send-btn"
          disabled={!inputVal.trim() || isTyping}
        >
          <Send size={16} />
        </button>
      </form>
    </>
  );
};
