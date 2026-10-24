import React from "react";
import { Sparkles, Calendar, Plus, Building2, UserCircle2, ArrowRight, Lock, Search, LogIn, LogOut } from "lucide-react";
import { Workspace, Event, User } from "../../types/index.ts";

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
  user: User | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
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
  user,
  onOpenAuthModal,
  onLogout,
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
      {/* 1. Chromium Browser Window Top Frame */}
      <div className="chromium-tab-bar">
        {/* Window controls (traffic light dots) */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginRight: "12px" }}>
          <span className="chromium-dot chromium-dot-red" />
          <span className="chromium-dot chromium-dot-yellow" />
          <span className="chromium-dot chromium-dot-green" />
        </div>

        {/* Chromium Tabs */}
        <button
          aria-label="Festiya Scenes Tab"
          onClick={() => setCurrentView("landing")}
          className={`chromium-tab ${currentView === "landing" ? "active" : ""}`}
        >
          <span>🎪</span>
          <span>Festiya District</span>
        </button>

        <button
          aria-label="Workspace Command Center Tab"
          onClick={() => setCurrentView("workspace")}
          className={`chromium-tab ${currentView === "workspace" ? "active" : ""}`}
        >
          <span>📋</span>
          <span>Event Studio {activeEvent ? `(${activeEvent.name.slice(0, 14)}...)` : ""}</span>
        </button>

        <button
          aria-label="Pricing & Plans Tab"
          onClick={() => setCurrentView("pricing")}
          className={`chromium-tab ${currentView === "pricing" ? "active" : ""}`}
        >
          <span>💎</span>
          <span>VIP Access</span>
        </button>

        {/* Chromium Omnibar URL Capsule */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
          <div className="chromium-omnibar">
            <Lock size={12} color="#2ED573" />
            <span style={{ opacity: 0.9 }}>festiya.district/{currentView}</span>
            <span style={{ fontSize: "10px", color: "#64748B", marginLeft: "6px" }}>⌘K</span>
          </div>
        </div>
      </div>
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
                  Studio
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

          {/* User Account / Auth CTA */}
          {user && user.id !== "usr_souvik" ? (
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
                <UserCircle2 size={16} color="var(--mint)" />
                <span>{user.name.split(" ")[0]}</span>
              </div>
              <button
                aria-label="Sign out"
                onClick={onLogout}
                title="Sign out"
                className="btn btn-sm btn-secondary"
                style={{ padding: "6px 10px" }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              aria-label="Sign In or Sign Up"
              onClick={onOpenAuthModal}
              className="btn btn-sm btn-secondary"
              style={{ fontWeight: 700, gap: "6px" }}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
