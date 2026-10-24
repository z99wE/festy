import React from "react";
import {
  ArrowRight,
  Heart,
  Cake,
  Users,
  Briefcase,
  Compass,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { EventCategory } from "../../../types/index.ts";
import { DancingMascotHero } from "../festive/DancingMascotHero.tsx";

interface LandingHeroProps {
  occasion: string;
  setOccasion: (val: string) => void;
  category: EventCategory;
  setCategory: (val: EventCategory) => void;
  dateMode: "decided" | "undecided";
  setDateMode: (val: "decided" | "undecided") => void;
  startDate: string;
  setStartDate: (val: string) => void;
  guestCount: number | undefined;
  setGuestCount: (val: number | undefined) => void;
  currency: string;
  setCurrency: (val: string) => void;
  targetBudget: number | undefined;
  setTargetBudget: (val: number | undefined) => void;
  onSubmit: (e: React.FormEvent) => void;
  onExploreDemoEvent: (eventId: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  occasion,
  setOccasion,
  category,
  setCategory,
  dateMode,
  setDateMode,
  startDate,
  setStartDate,
  guestCount,
  setGuestCount,
  currency,
  setCurrency,
  targetBudget,
  setTargetBudget,
  onSubmit,
  onExploreDemoEvent,
}) => {
  const categories = [
    { key: "wedding" as const, label: "Wedding", icon: Heart },
    { key: "birthday" as const, label: "Birthday", icon: Cake },
    { key: "gathering" as const, label: "Gathering", icon: Users },
    { key: "work_event" as const, label: "Corporate", icon: Briefcase },
    { key: "custom" as const, label: "Custom", icon: Compass },
  ];

  return (
    <section
      className="yellow-dot-bg"
      style={{
        padding: "60px 0 80px",
        borderBottom: "2px solid #000000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container" style={{ maxWidth: "1200px" }}>
        {/* Two-Column Neo-Brutalist Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "48px",
            alignItems: "center",
          }}
        >
          {/* Left Column: Badge, Heading, Subtitle, CTAs, Quick Setup */}
          <div style={{ textAlign: "left" }}>
            {/* Pill Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: "#ffffff",
                border: "2px solid #000000",
                borderRadius: "9999px",
                boxShadow: "4px 4px 0px 0px #000000",
                fontSize: "13px",
                fontWeight: 700,
                color: "#000000",
                marginBottom: "20px",
              }}
            >
              <span style={{ fontSize: "14px" }}>⚡</span>
              <span>NEW: AI Event Assistant 2.0</span>
            </div>

            {/* Heading in Cabinet Grotesk with one stroke keyword */}
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(38px, 5.2vw, 64px)",
                lineHeight: 1.05,
                color: "#000000",
                letterSpacing: "-0.04em",
                fontWeight: 800,
                marginBottom: "20px",
              }}
            >
              Production Event Infrastructure &{" "}
              <span className="text-stroke-keyword">Operations</span>
            </h1>

            {/* Subtitle in Satoshi */}
            <h2
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(17px, 2vw, 20px)",
                color: "#171e19",
                fontWeight: 600,
                lineHeight: 1.5,
                marginBottom: "28px",
                letterSpacing: "-0.01em",
              }}
            >
              The modern AI workspace to plan budgets, negotiate vendor agreements, and execute run-of-shows with deterministic accuracy and private workspace confidence.
            </h2>

            {/* CTA Group: Primary Black (8px shadow) + Secondary White (4px shadow) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
                marginBottom: "36px",
              }}
            >
              <button
                aria-label="Start Free Trial"
                type="button"
                onClick={() => {
                  const formEl = document.getElementById("hero-planning-card");
                  if (formEl) formEl.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn btn-primary"
              >
                <span>START FREE TRIAL</span>
                <ArrowRight size={18} />
              </button>

              <button
                aria-label="Explore Live Demo"
                type="button"
                onClick={() => onExploreDemoEvent("evt_wedding_jaipur")}
                className="btn btn-secondary"
              >
                <span>EXPLORE LIVE DEMO</span>
              </button>
            </div>

            {/* Quick Demo Shortcuts */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                fontSize: "12px",
                color: "#171e19",
                fontWeight: 700,
              }}
            >
              <span style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Presets:</span>
              <button
                aria-label="Explore Jaipur Heritage Wedding Demo"
                type="button"
                onClick={() => onExploreDemoEvent("evt_wedding_jaipur")}
                style={{
                  padding: "4px 10px",
                  background: "#ffffff",
                  border: "2px solid #000000",
                  borderRadius: "6px",
                  boxShadow: "2px 2px 0px 0px #000000",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                💍 Jaipur Heritage (₹45L)
              </button>
              <button
                aria-label="Explore Apex Leadership Summit Demo"
                type="button"
                onClick={() => onExploreDemoEvent("evt_apex_summit")}
                style={{
                  padding: "4px 10px",
                  background: "#b7c6c2",
                  border: "2px solid #000000",
                  borderRadius: "6px",
                  boxShadow: "2px 2px 0px 0px #000000",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                🏢 Apex Summit ($125K)
              </button>
            </div>
          </div>

          {/* Right Column: Stylized Browser Mockup Dashboard with Dancing Mascot & Under Logo */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="browser-mockup">
              {/* Browser Header Bar */}
              <div className="browser-mockup-header">
                <span className="mockup-dot mockup-dot-red" />
                <span className="mockup-dot mockup-dot-yellow" />
                <span className="mockup-dot mockup-dot-green" />
                <span
                  style={{
                    marginLeft: "auto",
                    color: "#b7c6c2",
                    fontSize: "11px",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                  }}
                >
                  festiya.com/studio
                </span>
              </div>

              {/* Mockup Dashboard Content Area */}
              <div className="browser-mockup-content">
                {/* Sage and Charcoal Accent Panels */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      background: "#b7c6c2",
                      border: "2px solid #000000",
                      borderRadius: "8px",
                      padding: "12px",
                      boxShadow: "4px 4px 0px 0px #000000",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#171e19" }}>
                      Ledger Safety
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 900, color: "#000000", marginTop: "2px" }}>
                      100% Decimal
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#171e19",
                      border: "2px solid #000000",
                      borderRadius: "8px",
                      padding: "12px",
                      boxShadow: "4px 4px 0px 0px #000000",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#b7c6c2" }}>
                      Synthesis Time
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 900, color: "#ffe17c", marginTop: "2px" }}>
                      45 Seconds
                    </div>
                  </div>
                </div>

                {/* Looping Dancing Mascot Animation & Favicon Logo directly under it */}
                <DancingMascotHero />

                {/* Live Operations Status */}
                <div
                  style={{
                    marginTop: "20px",
                    padding: "12px 14px",
                    background: "#f4f4f5",
                    border: "2px solid #000000",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#000000",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
                    Live Event Engine
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", color: "#171e19" }}>Production Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Event Brief Synthesis Card */}
        <div
          id="hero-planning-card"
          style={{
            maxWidth: "920px",
            margin: "56px auto 0",
            background: "#ffffff",
            border: "2px solid #000000",
            borderRadius: "12px",
            boxShadow: "8px 8px 0px 0px #000000",
            padding: "36px",
            color: "#000000",
          }}
        >
          <form onSubmit={onSubmit}>
            {/* Category Select */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "var(--font-heading)",
                  fontSize: "16px",
                  fontWeight: 800,
                  marginBottom: "12px",
                  color: "#000000",
                }}
              >
                1. Select Production Type
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "10px",
                }}
              >
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.key;
                  return (
                    <button
                      key={cat.key}
                      aria-label={`Select ${cat.label} category`}
                      type="button"
                      onClick={() => setCategory(cat.key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: "2px solid #000000",
                        background: isSelected ? "#ffe17c" : "#ffffff",
                        color: "#000000",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer",
                        boxShadow: isSelected ? "4px 4px 0px 0px #000000" : "2px 2px 0px 0px #000000",
                        transform: isSelected ? "translate(-1px, -1px)" : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <Icon size={16} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Occasion / Event Name */}
            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="occasion-input"
                style={{
                  display: "block",
                  fontFamily: "var(--font-heading)",
                  fontSize: "16px",
                  fontWeight: 800,
                  marginBottom: "8px",
                  color: "#000000",
                }}
              >
                2. Event Scope or Name
              </label>
              <input
                id="occasion-input"
                aria-label="What are you celebrating"
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  border: "2px solid #000000",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  outline: "none",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  boxShadow: "2px 2px 0px 0px #000000",
                }}
                placeholder="e.g. Maya & Arjun 3-Day Heritage Celebration or Annual Tech Summit"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                required
              />
            </div>

            {/* Date, Scale, Budget Inputs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
                marginBottom: "28px",
              }}
            >
              {/* Date */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label htmlFor="landing-event-date" style={{ fontWeight: 700, fontSize: "14px", color: "#000000" }}>
                    Schedule Date
                  </label>
                  <button
                    aria-label="Toggle event schedule date mode"
                    type="button"
                    onClick={() => setDateMode(dateMode === "decided" ? "undecided" : "decided")}
                    style={{ fontSize: "11px", fontWeight: 700, color: "#171e19", textDecoration: "underline", cursor: "pointer" }}
                  >
                    {dateMode === "decided" ? "Undecided?" : "Specify Date"}
                  </button>
                </div>
                {dateMode === "decided" ? (
                  <input
                    id="landing-event-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #000000",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      fontWeight: 600,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      padding: "12px",
                      background: "#f4f4f5",
                      border: "2px dashed #000000",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      fontFamily: "var(--font-mono)",
                      color: "#171e19",
                    }}
                  >
                    RELATIVE DAY-OFFSET TIMELINE
                  </div>
                )}
              </div>

              {/* Guest Count */}
              <div>
                <label htmlFor="landing-guest-count" style={{ display: "block", fontWeight: 700, fontSize: "14px", marginBottom: "6px", color: "#000000" }}>
                  Attendees / Scale
                </label>
                <input
                  id="landing-guest-count"
                  type="number"
                  min="2"
                  max="10000"
                  value={guestCount ?? ""}
                  onChange={(e) => setGuestCount(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 150"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #000000",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    fontWeight: 600,
                  }}
                />
              </div>

              {/* Target Budget & Currency */}
              <div>
                <label htmlFor="landing-target-budget" style={{ display: "block", fontWeight: 700, fontSize: "14px", marginBottom: "6px", color: "#000000" }}>
                  Target Budget
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <select
                    id="landing-currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    style={{
                      padding: "12px",
                      border: "2px solid #000000",
                      borderRadius: "8px",
                      fontWeight: 700,
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                  <input
                    id="landing-target-budget"
                    type="number"
                    value={targetBudget ?? ""}
                    onChange={(e) => setTargetBudget(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 500000"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #000000",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
                paddingTop: "20px",
                borderTop: "2px solid #000000",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, color: "#171e19" }}>
                <CheckCircle2 size={18} color="#000000" />
                <span>Zero login barrier • Instant live workspace generation</span>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                aria-label="Launch Event Studio"
                style={{ padding: "14px 28px" }}
              >
                <span>LAUNCH EVENT STUDIO</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
