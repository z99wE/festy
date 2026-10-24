import React, { useState, useEffect, useRef } from "react";
import { X, Sparkles, Send, RefreshCw, PlusCircle, CheckCircle2 } from "lucide-react";
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
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: "msg_welcome",
        sender: "festi",
        text: `### Festi Operational Intelligence Active\nReady to analyze **${event.name}** (${event.guestCount || 80} attendees, ${event.currency} ${event.targetBudget?.toLocaleString() || "unlocked"}).\n\nAsk for immediate cost re-allocations, vendor negotiation scripts, weather contingencies, or run-of-show cues.`,
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Auto-invoke when drawer opens with initialPrompt
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const quickPrompts = [
    `Reduce overall budget by 15% and reallocate to decor`,
    `What are our weather contingencies for outdoor segments?`,
    `Generate 3 high-impact sensory activations for guests`,
    `Draft vendor questions for catering and bar agreements`,
  ];

  const handleSendPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || loading) return;

    const userMsgId = `usr_${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: "user",
        text: trimmed,
      },
    ];
    setMessages(newMessages);
    setInputVal("");
    setLoading(true);

    try {
      const token = localStorage.getItem("festiya_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/events/${event.id}/ask`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          prompt: trimmed,
          tabContext,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `festi_${Date.now()}`,
            sender: "festi",
            text: data.answer,
            suggestions: data.suggestions,
            proposedPlan: data.proposedPlanRevision,
            providerUsed: data.providerUsed,
          },
        ]);
      } else {
        const revision = await onRequestRevision(trimmed);
        setMessages((prev) => [
          ...prev,
          {
            id: `festi_${Date.now()}`,
            sender: "festi",
            text: `### Plan Revision Synthesized\nUpdated operational allocations based on: "${trimmed}". Check the preview below to apply.`,
            proposedPlan: revision.plan,
            providerUsed: revision.providerUsed,
          },
        ]);
      }
    } catch (err: unknown) {
      console.warn("Ask assistant fallback triggered:", err);
      try {
        const revision = await onRequestRevision(trimmed);
        setMessages((prev) => [
          ...prev,
          {
            id: `festi_${Date.now()}`,
            sender: "festi",
            text: `### Plan Revision Generated\nProcessed: "${trimmed}". Review the updated financial parameters and run-of-show adjustments below.`,
            proposedPlan: revision.plan,
            providerUsed: revision.providerUsed,
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `festi_err_${Date.now()}`,
            sender: "festi",
            text: "Encountered a momentary connection issue. Please retry your prompt or click a quick suggestion above.",
          },
        ]);
      }
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
      aria-label="Close assistant overlay"
      className="drawer-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        role="region"
        aria-label="Ask Festi AI Copilot"
        tabIndex={-1}
        className="drawer-panel"
        style={{
          background: "var(--surface)",
          borderLeft: "2px solid var(--surface-border-strong)",
          boxShadow: "-8px 0px 0px #000000",
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "2px solid var(--surface-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-sm)",
                background: "var(--neopop-mint)",
                color: "#000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1.5px solid #000000",
                boxShadow: "2px 2px 0px #000000",
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 className="neopop-title" style={{ fontSize: "16px", color: "#FFFFFF" }}>
                  FESTI COPILOT
                </h3>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: "2px",
                    background: "#000000",
                    color: "var(--neopop-mint)",
                    border: "1px solid var(--neopop-mint)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  ONLINE
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--ink-secondary)" }}>
                {event.name} • Decimal-Safe Ledger
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
            borderBottom: "1.5px solid var(--surface-border)",
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {quickPrompts.slice(0, 3).map((qp, idx) => (
            <button
              key={idx}
              aria-label={`Ask: ${qp}`}
              type="button"
              onClick={() => handleSendPrompt(qp)}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{
                whiteSpace: "nowrap",
                fontSize: "11px",
                padding: "6px 12px",
                minHeight: "32px",
              }}
            >
              <span>{qp.length > 32 ? qp.substring(0, 32) + "..." : qp}</span>
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
            gap: "18px",
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
                  padding: "16px 20px",
                  borderRadius: "var(--radius-md)",
                  background: m.sender === "user" ? "var(--neopop-mint)" : "var(--surface-alt)",
                  color: m.sender === "user" ? "#000000" : "#FFFFFF",
                  border: m.sender === "user" ? "1.5px solid #000000" : "1.5px solid var(--surface-border)",
                  fontSize: "13.5px",
                  lineHeight: 1.6,
                  boxShadow: "3px 3px 0px #000000",
                  whiteSpace: "pre-wrap",
                  fontWeight: m.sender === "user" ? 700 : 500,
                }}
              >
                {m.text}
              </div>

              {/* Actionable Suggestions Cards */}
              {m.suggestions && m.suggestions.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "92%", marginTop: "4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
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
                          padding: "10px 14px",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--surface)",
                          border: "1.5px solid var(--surface-border)",
                          boxShadow: "2px 2px 0px #000000",
                          fontSize: "12px",
                        }}
                      >
                        <span style={{ fontWeight: 600, color: "#FFFFFF" }}>{s.title}</span>
                        <button
                          aria-label={`Add suggestion ${s.title}`}
                          type="button"
                          onClick={() => handleAddSuggestionAsTask(s)}
                          disabled={isAdded}
                          className={isAdded ? "badge badge-mint" : "btn btn-secondary btn-sm"}
                          style={{
                            padding: "4px 10px",
                            fontSize: "11px",
                            minHeight: "28px",
                          }}
                        >
                          {isAdded ? <CheckCircle2 size={12} /> : <PlusCircle size={12} />}
                          <span>{isAdded ? "Added" : "+ Add to Tasks"}</span>
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
                    border: "2px solid var(--neopop-mint)",
                    background: "var(--surface-alt)",
                    padding: "18px",
                    marginTop: "8px",
                    boxShadow: "4px 4px 0px #000000",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--neopop-mint)", textTransform: "uppercase" }}>
                      Plan Revision Ready
                    </span>
                  </div>
                  <p style={{ fontSize: "12.5px", color: "#FFFFFF", lineHeight: 1.5, marginBottom: "12px" }}>
                    <strong>Target Budget:</strong> {m.proposedPlan.budget.currency} {m.proposedPlan.budget.target?.toLocaleString() || "—"}
                  </p>
                  {appliedPlans.has(m.id) ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--neopop-mint)", fontWeight: 700, fontSize: "12px" }}>
                      <CheckCircle2 size={14} />
                      <span>Applied to Active Event Workspace</span>
                    </div>
                  ) : (
                    <button
                      aria-label="Apply proposed revision to workspace"
                      type="button"
                      onClick={() => handleApplyProposedPlan(m.proposedPlan!, m.id)}
                      className="btn btn-primary btn-sm"
                      style={{
                        width: "100%",
                        padding: "10px",
                        fontSize: "12px",
                      }}
                    >
                      Apply Revision to Workspace
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
                  width: "28px",
                  height: "28px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--neopop-mint)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000000",
                  border: "1px solid #000000",
                  boxShadow: "2px 2px 0px #000000",
                }}
              >
                <RefreshCw size={14} className="spin" />
              </div>
              <span style={{ fontSize: "13px", color: "var(--ink-secondary)", fontWeight: 700 }}>
                Festi Copilot is analyzing operational parameters...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{ padding: "16px 24px", borderTop: "2px solid var(--surface-border)", background: "var(--surface)" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(inputVal);
            }}
            style={{ display: "flex", gap: "10px" }}
          >
            <input
              id="ask-festiya-chat-input"
              aria-label="Ask Festiya prompt input"
              className="form-input"
              placeholder="e.g. Trim 15% from catering and reallocate to sound reinforcement"
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
              style={{ padding: "0 18px" }}
            >
              {loading ? <RefreshCw size={16} className="spin" /> : <Send size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
