import React from "react";
import { Sparkles, Calendar, Plus, Building2, UserCircle2, Lock, LogIn, LogOut } from "lucide-react";
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
        borderBottom: "2px solid var(--surface-border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 4px 0px #000000",
      }}
    >
      {/* 1. Chromium Browser Window Top Frame — NeoPOP Dark Edition */}
      <div className="chromium-tab-bar">
        {/* Window controls (traffic light squares) */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginRight: "12px" }}>
          <span className="chromium-dot chromium-dot-red" />
          <span className="chromium-dot chromium-dot-yellow" />
          <span className="chromium-dot chromium-dot-green" />
        </div>

        {/* Chromium Tabs */}
        <button
          aria-label="Festiya Scenes Tab"
          type="button"
          onClick={() => setCurrentView("landing")}
          className={`chromium-tab ${currentView === "landing" ? "active" : ""}`}
        >
          <span>🎪</span>
          <span>EXPLORE PRODUCTIONS</span>
        </button>

        <button
          aria-label="Workspace Command Center Tab"
          type="button"
          onClick={() => setCurrentView("workspace")}
          className={`chromium-tab ${currentView === "workspace" ? "active" : ""}`}
        >
          <span>📋</span>
          <span>EVENT STUDIO {activeEvent ? `(${activeEvent.name.slice(0, 14)}...)` : ""}</span>
        </button>

        <button
          aria-label="Pricing and Plans Tab"
          type="button"
          onClick={() => setCurrentView("pricing")}
          className={`chromium-tab ${currentView === "pricing" ? "active" : ""}`}
        >
          <span>⚡</span>
          <span>TIERS & LIMITS</span>
        </button>

        {/* Chromium Omnibar URL Capsule */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
          <div className="chromium-omnibar">
            <Lock size={12} color="var(--neopop-mint)" />
            <span>festiya.app/{currentView}</span>
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
            type="button"
            onClick={() => setCurrentView("landing")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textAlign: "left",
            }}
          >
            <img
              src="/mascot-mint.png"
              alt="Festiya Mascot Logo"
              style={{
                width: "38px",
                height: "38px",
                objectFit: "contain",
                filter: "drop-shadow(0 2px 8px rgba(0, 229, 153, 0.5))",
              }}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  className="neopop-title"
                  style={{ fontSize: "22px", color: "#FFFFFF", letterSpacing: "-0.03em" }}
                >
                  FESTIYA
                </span>
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
                  PRO
                </span>
              </div>
            </div>
          </button>

          {/* Navigation Links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              aria-label="Explore"
              type="button"
              onClick={() => setCurrentView("landing")}
              className={`btn btn-sm ${currentView === "landing" ? "btn-secondary" : ""}`}
              style={{
                color: currentView === "landing" ? "var(--neopop-mint)" : "var(--ink-secondary)",
                borderColor: currentView === "landing" ? "var(--neopop-mint)" : "transparent",
              }}
            >
              EXPLORE
            </button>

            {events.length > 0 && (
              <button
                aria-label="Workspace"
                type="button"
                onClick={() => setCurrentView("workspace")}
                className={`btn btn-sm ${currentView === "workspace" ? "btn-secondary" : ""}`}
                style={{
                  color: currentView === "workspace" ? "var(--neopop-mint)" : "var(--ink-secondary)",
                  borderColor: currentView === "workspace" ? "var(--neopop-mint)" : "transparent",
                }}
              >
                <Calendar size={14} />
                WORKSPACE
              </button>
            )}

            <button
              aria-label="Pricing"
              type="button"
              onClick={() => setCurrentView("pricing")}
              className={`btn btn-sm ${currentView === "pricing" ? "btn-secondary" : ""}`}
              style={{
                color: currentView === "pricing" ? "var(--neopop-mint)" : "var(--ink-secondary)",
                borderColor: currentView === "pricing" ? "var(--neopop-mint)" : "transparent",
              }}
            >
              PRICING
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
                  borderRadius: "var(--radius-sm)",
                  border: "1.5px solid var(--surface-border)",
                  fontSize: "12px",
                  fontWeight: 700,
                  boxShadow: "2px 2px 0px #000000",
                }}
              >
                {activeWorkspace.type === "professional" ? (
                  <Building2 size={14} color="var(--neopop-blue)" />
                ) : (
                  <UserCircle2 size={14} color="var(--neopop-mint)" />
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
                    fontWeight: 700,
                    cursor: "pointer",
                    outline: "none",
                    color: "#FFFFFF",
                  }}
                  aria-label="Select active workspace"
                >
                  {workspaces.map((w) => (
                    <option key={w.id} value={w.id} style={{ background: "#12151D", color: "#FFF" }}>
                      {w.name} ({w.type})
                    </option>
                  ))}
                </select>

                <button
                  aria-label="Open billing modal"
                  type="button"
                  onClick={onOpenBillingModal}
                  className="badge badge-mint"
                  title="Manage subscription and usage limits"
                  style={{ cursor: "pointer", padding: "2px 6px" }}
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
                    borderRadius: "var(--radius-sm)",
                    border: "1.5px solid var(--surface-border)",
                    fontSize: "12px",
                    boxShadow: "2px 2px 0px #000000",
                  }}
                >
                  <Calendar size={13} color="var(--ink-secondary)" />
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
                      fontWeight: 700,
                      cursor: "pointer",
                      maxWidth: "160px",
                      textOverflow: "ellipsis",
                      outline: "none",
                      color: "#FFFFFF",
                    }}
                    aria-label="Select active event"
                  >
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id} style={{ background: "#12151D", color: "#FFF" }}>
                        {ev.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* New Event CTA — NeoPOP Primary Button */}
          <button
            aria-label="Plan a new event"
            type="button"
            onClick={onOpenNewEventModal}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            <span>PLAN EVENT</span>
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
                  borderRadius: "var(--radius-sm)",
                  border: "1.5px solid var(--surface-border)",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                <UserCircle2 size={14} color="var(--neopop-mint)" />
                <span>{user.name.split(" ")[0]}</span>
              </div>
              <button
                aria-label="Sign out"
                type="button"
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
              type="button"
              onClick={onOpenAuthModal}
              className="btn btn-sm btn-secondary"
            >
              <LogIn size={14} />
              <span>SIGN IN</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
