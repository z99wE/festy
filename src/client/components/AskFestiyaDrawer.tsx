import React, { useState, useEffect, useRef } from "react";
import { X, Sparkles, Send, ArrowRight, Check, RefreshCw, PlusCircle, CheckCircle2 } from "lucide-react";
import { EventPlan, Event, Task } from "../../types/index.ts";

interface SuggestionItem {
  type: "task" | "idea" | "budget";
  title: string;
  detail?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "festi";
  text: string;
  suggestions?: SuggestionItem[];
  proposedPlan?: EventPlan;
  providerUsed?: string;
}

interface AskFestiyaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  initialPrompt?: string;
  onRequestRevision: (instruction: string) => Promise<{ plan: EventPlan; providerUsed: string }>;
  onApplyPlan: (newPlan: EventPlan) => void;
  onAddTask?: (task: Partial<Task>) => void;
  tabContext?: string;
}

export const AskFestiyaDrawer: React.FC<AskFestiyaDrawerProps> = ({
  isOpen,
  onClose,
  event,
  initialPrompt = "",
  onRequestRevision,
  onApplyPlan,
  onAddTask,
  tabContext = "general",
}) => {
  if (!isOpen) return null;

  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [appliedPlans, setAppliedPlans] = useState<Set<string>>(new Set());
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      sender: "festi",
      text: `Hii! I'm Festi, your AI event copilot 🦊✨ Ask me anything about **${event.name}** (${event.guestCount || 50} guests, ${event.currency} ${event.targetBudget?.toLocaleString() || "5,000"}) — from vendor negotiation scripts to weather contingencies, run-of-show flow, or budget reallocation!`,
    },
  ]);

  const lastProcessedPrompt = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    "Suggest key questions to ask prospective venue and catering vendors",
    "Identify weather and vendor delay contingencies for this venue",
    "Recalculate budget assuming +25 unexpected guests",
    "Brainstorm 3 surprising sensory guest ideas for this celebration",
    "Suggest a seamless evening run-of-show schedule for this event",
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-invoke AI when drawer opens with an initialPrompt
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() && initialPrompt !== lastProcessedPrompt.current) {
      lastProcessedPrompt.current = initialPrompt;
      handleSendPrompt(initialPrompt.trim());
    }
  }, [initialPrompt]);

  const handleSendPrompt = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsgId = `usr_${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: "user",
        text,
      },
    ];
    setMessages(newMessages);
    setInputVal("");
    setLoading(true);

    try {
      const res = await fetch(`/api/events/${event.id}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("festiya_token") || ""}`,
        },
        body: JSON.stringify({
          prompt: text,
          tabContext,
        }),
      });

      if (!res.ok) {
        // Fallback to revision endpoint if ask route had an issue
        const rev = await onRequestRevision(text);
        setMessages((prev) => [
          ...prev,
          {
            id: `festi_${Date.now()}`,
            sender: "festi",
            text: `### 🎯 Plan Adjustment Proposed\n\nI have recalculated your event plan according to your instruction: "${text}".\n\n- **Target Budget:** ${rev.plan.budget.currency} ${rev.plan.budget.target?.toLocaleString() || "—"}\n- **Latest Key Assumption:** ${rev.plan.assumptions[0]}`,
            proposedPlan: rev.plan,
            providerUsed: rev.providerUsed,
          },
        ]);
        return;
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `festi_${Date.now()}`,
          sender: "festi",
          text: data.answer,
          suggestions: data.suggestions,
          proposedPlan: data.proposedPlanRevision || undefined,
          providerUsed: data.providerUsed,
        },
      ]);
    } catch (err) {
      console.error("Ask Festiya error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `festi_${Date.now()}`,
          sender: "festi",
          text: "Oops! I ran into a brief hiccup connecting to the reasoning engine. Please try asking again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyProposedPlan = (plan: EventPlan, msgId: string) => {
    onApplyPlan(plan);
    setAppliedPlans((prev) => new Set([...prev, msgId]));
  };

  const handleAddSuggestionAsTask = (s: SuggestionItem) => {
    if (onAddTask) {
      onAddTask({
        title: s.title,
        description: s.detail,
        priority: "medium",
        status: "todo",
      });
      setAddedItems((prev) => new Set([...prev, s.title]));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Close Ask Festiya drawer overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
      className="drawer-backdrop"
    >
      <div className="drawer-panel" role="region" aria-label="Ask Festiya assistant panel">
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--surface-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #FF4757 0%, #A855F7 100%)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(255, 71, 87, 0.3)",
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 className="serif-heading" style={{ fontSize: "18px" }}>
                  Ask Festiya
                </h3>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: "rgba(46, 213, 115, 0.15)",
                    color: "#2ED573",
                    border: "1px solid rgba(46, 213, 115, 0.3)",
                  }}
                >
                  AI ACTIVE
                </span>
              </div>
              <p style={{ fontSize: "11.5px", color: "var(--ink-secondary)" }}>
                Event architect • Instant calculations • Vendor scripts
              </p>
            </div>
          </div>
          <button
            aria-label="Close assistant drawer"
            type="button"
            onClick={onClose}
            style={{ color: "var(--ink-muted)", cursor: "pointer", background: "none", border: "none" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div
          style={{
            padding: "12px 20px",
            background: "var(--surface-alt)",
            borderBottom: "1px solid var(--surface-border)",
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {quickPrompts.slice(0, 3).map((qp, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Ask: ${qp}`}
              onClick={() => handleSendPrompt(qp)}
              disabled={loading}
              style={{
                whiteSpace: "nowrap",
                padding: "6px 12px",
                borderRadius: "14px",
                background: "var(--surface)",
                border: "1px solid var(--surface-border)",
                fontSize: "11.5px",
                fontWeight: 600,
                color: "var(--ink)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <Sparkles size={11} color="#FF4757" />
              <span>{qp.length > 34 ? qp.substring(0, 34) + "..." : qp}</span>
            </button>
          ))}
        </div>

        {/* Chat Message Thread */}
        <div
          style={{
            padding: "20px 24px",
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: m.sender === "user" ? "flex-end" : "flex-start",
                gap: "8px",
              }}
            >
              <div
                style={{
                  maxWidth: "92%",
                  padding: "14px 18px",
                  borderRadius: m.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: m.sender === "user" ? "#FF4757" : "var(--surface-alt)",
                  color: m.sender === "user" ? "#FFFFFF" : "var(--ink)",
                  border: m.sender === "user" ? "none" : "1px solid var(--surface-border)",
                  fontSize: "13.5px",
                  lineHeight: 1.6,
                  boxShadow: "var(--shadow-sm)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>

              {/* Actionable Suggestions Cards */}
              {m.suggestions && m.suggestions.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "92%", marginTop: "4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase" }}>
                    Recommended Actions
                  </span>
                  {m.suggestions.map((s, sIdx) => {
                    const isAdded = addedItems.has(s.title);
                    return (
                      <div
                        key={sIdx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          background: "var(--surface)",
                          border: "1px solid var(--surface-border)",
                          fontSize: "12px",
                        }}
                      >
                        <span style={{ fontWeight: 600, color: "var(--ink)" }}>{s.title}</span>
                        <button
                          type="button"
                          aria-label={`Add suggestion ${s.title}`}
                          onClick={() => handleAddSuggestionAsTask(s)}
                          disabled={isAdded}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            border: "none",
                            background: isAdded ? "rgba(46, 213, 115, 0.15)" : "var(--coral-light)",
                            color: isAdded ? "#2ED573" : "var(--coral)",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: isAdded ? "default" : "pointer",
                          }}
                        >
                          {isAdded ? <CheckCircle2 size={13} /> : <PlusCircle size={13} />}
                          <span>{isAdded ? "Added" : "Add to Tasks"}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Proposed Plan Revision Box */}
              {m.proposedPlan && (
                <div
                  className="card"
                  style={{
                    width: "92%",
                    border: "2px solid #2ED573",
                    background: "rgba(46, 213, 115, 0.08)",
                    padding: "14px",
                    marginTop: "6px",
                    borderRadius: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <Check size={16} color="#2ED573" />
                    <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#2ED573" }}>
                      Plan Revision Ready
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--ink)", lineHeight: 1.5, marginBottom: "10px" }}>
                    <strong>Adjusted Budget:</strong> {m.proposedPlan.budget.currency} {m.proposedPlan.budget.target?.toLocaleString() || "—"}
                  </p>
                  {appliedPlans.has(m.id) ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#2ED573", fontWeight: 700, fontSize: "12px" }}>
                      <Check size={14} />
                      <span>Applied to Active Event Workspace</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      aria-label="Apply proposed revision to workspace"
                      onClick={() => handleApplyProposedPlan(m.proposedPlan!, m.id)}
                      className="btn-skeuo"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        fontSize: "12px",
                        fontWeight: 700,
                        justifyContent: "center",
                      }}
                    >
                      Apply Proposed Revision to Workspace
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* AI Generating Indicator */}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #FF4757 0%, #A855F7 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                }}
              >
                <RefreshCw size={16} className="spin" />
              </div>
              <span style={{ fontSize: "13px", color: "var(--ink-secondary)", fontWeight: 600 }}>
                Festi is reasoning through your event & generating solutions...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--surface-border)", background: "var(--surface)" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(inputVal);
            }}
            style={{ display: "flex", gap: "8px" }}
          >
            <input
              id="ask-festiya-chat-input"
              aria-label="Ask Festiya prompt input"
              className="form-input"
              placeholder="Ask Festi: e.g. How do I budget appetizers for 80 guests?"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={loading}
              style={{ fontSize: "13px" }}
            />
            <button
              aria-label="Send prompt to Festiya AI"
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="btn btn-primary"
              style={{ padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {loading ? <RefreshCw size={16} className="spin" /> : <Send size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
