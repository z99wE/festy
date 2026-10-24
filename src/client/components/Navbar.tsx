import React from "react";
import { Sparkles, Calendar, Plus, Building2, UserCircle2, ArrowRight } from "lucide-react";
import { Workspace, Event } from "../../types/index.ts";

interface NavbarProps {
  currentView: "landing" | "workspace" | "pricing" | "shared";
  setCurrentView: (view: "landing" | "workspace" | "pricing" | "shared") => void;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  onSelectWorkspace: (ws: Workspace) => void;
  events: Event[];
  activeEvent: Event | null;
  onSelectEvent: (event: Event) => void;
  onOpenNewEventModal: () => void;
  onOpenBillingModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  workspaces,
  activeWorkspace,
  onSelectWorkspace,
  events,
  activeEvent,
  onSelectEvent,
  onOpenNewEventModal,
  onOpenBillingModal,
}) => {
  return (
    <header
      style={{
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--surface-border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
          gap: "16px",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <button
            aria-label="Festiya Home"
            onClick={() => setCurrentView("landing")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, var(--coral) 0%, #FF8D54 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 4px 10px rgba(255, 98, 87, 0.3)",
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", color: "var(--ink)" }}>
                  Festiya
                </span>
                <span className="badge badge-sunshine" style={{ fontSize: "10px", padding: "2px 6px" }}>
                  AI
                </span>
              </div>
              <p style={{ fontSize: "11px", color: "var(--ink-muted)", fontWeight: 500 }}>
                Make a moment of it.
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              aria-label="Explore"
              onClick={() => setCurrentView("landing")}
              className={`btn btn-sm ${currentView === "landing" ? "btn-secondary" : ""}`}
              style={{ color: currentView === "landing" ? "var(--ink)" : "var(--ink-secondary)" }}
            >
              Explore
            </button>

            {events.length > 0 && (
              <button
                aria-label="Workspace"
                onClick={() => setCurrentView("workspace")}
                className={`btn btn-sm ${currentView === "workspace" ? "btn-secondary" : ""}`}
                style={{ color: currentView === "workspace" ? "var(--ink)" : "var(--ink-secondary)" }}
              >
                <Calendar size={14} />
                Workspace
              </button>
            )}

            <button
              aria-label="Pricing"
              onClick={() => setCurrentView("pricing")}
              className={`btn btn-sm ${currentView === "pricing" ? "btn-secondary" : ""}`}
              style={{ color: currentView === "pricing" ? "var(--ink)" : "var(--ink-secondary)" }}
            >
              Pricing
            </button>
          </nav>
        </div>

        {/* Right side controls: Workspace switch, Event switch, Quick Plan CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Workspace selector dropdown */}
          {activeWorkspace && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  background: "var(--surface-alt)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--surface-border)",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {activeWorkspace.type === "professional" ? (
                  <Building2 size={16} color="var(--cobalt)" />
                ) : (
                  <UserCircle2 size={16} color="var(--coral)" />
                )}
                <select
                  value={activeWorkspace.id}
                  onChange={(e) => {
                    const ws = workspaces.find((w) => w.id === e.target.value);
                    if (ws) onSelectWorkspace(ws);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    outline: "none",
                  }}
                  aria-label="Select active workspace"
                >
                  {workspaces.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.type})
                    </option>
                  ))}
                </select>

                <button
                  onClick={onOpenBillingModal}
                  className="badge badge-mint"
                  title="Manage subscription and usage limits"
                  style={{ cursor: "pointer", textTransform: "uppercase" }}
                >
                  {activeWorkspace.subscriptionTier}
                </button>
              </div>

              {/* Event switcher if workspace has events */}
              {events.length > 0 && activeEvent && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    background: "var(--surface-alt)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--surface-border)",
                    fontSize: "13px",
                  }}
                >
                  <Calendar size={15} color="var(--ink-secondary)" />
                  <select
                    value={activeEvent.id}
                    onChange={(e) => {
                      const evt = events.find((ev) => ev.id === e.target.value);
                      if (evt) {
                        onSelectEvent(evt);
                        setCurrentView("workspace");
                      }
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      fontWeight: 600,
                      cursor: "pointer",
                      maxWidth: "180px",
                      textOverflow: "ellipsis",
                      outline: "none",
                    }}
                    aria-label="Select active event"
                  >
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* New Event CTA */}
          <button
            aria-label="Plan an event"
            onClick={onOpenNewEventModal}
            className="btn btn-primary"
            style={{ fontWeight: 700 }}
          >
            <Plus size={16} />
            <span>Plan an event</span>
          </button>
        </div>
      </div>
    </header>
  );
};
