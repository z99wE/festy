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
        backgroundColor: "#ffe17c",
        borderBottom: "2px solid #000000",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 4px 0px 0px #000000",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "80px",
          gap: "16px",
        }}
      >
        {/* Brand: Logo with black square icon containing yellow bolt */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
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
            <div
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "#000000",
                border: "2px solid #000000",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "3px 3px 0px 0px #000000",
              }}
            >
              <span style={{ color: "#ffe17c", fontSize: "20px", fontWeight: 900 }}>⚡</span>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "#000000",
                    letterSpacing: "-0.03em",
                  }}
                >
                  FESTIYA
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: "#000000",
                    color: "#ffe17c",
                    border: "2px solid #000000",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  2.0
                </span>
              </div>
            </div>
          </button>

          {/* Navigation Links in Bold Satoshi */}
          <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              aria-label="Explore Productions"
              type="button"
              onClick={() => setCurrentView("landing")}
              className={`btn btn-sm ${currentView === "landing" ? "btn-primary" : "btn-secondary"}`}
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
              }}
            >
              EXPLORE
            </button>

            {events.length > 0 && (
              <button
                aria-label="Workspace Command Center"
                type="button"
                onClick={() => setCurrentView("workspace")}
                className={`btn btn-sm ${currentView === "workspace" ? "btn-primary" : "btn-secondary"}`}
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                }}
              >
                <Calendar size={14} />
                STUDIO
              </button>
            )}

            <button
              aria-label="Pricing and Tiers"
              type="button"
              onClick={() => setCurrentView("pricing")}
              className={`btn btn-sm ${currentView === "pricing" ? "btn-primary" : "btn-secondary"}`}
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
              }}
            >
              TIERS & PRICING
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

          {/* Start Free Trial CTA — Neo-Brutalist Primary Button */}
          <button
            aria-label="Start Free Trial"
            type="button"
            onClick={onOpenNewEventModal}
            className="btn btn-primary btn-sm"
          >
            <span>START FREE TRIAL</span>
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
