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
import { ReactBitsDust } from "../festive/ReactBitsDust.tsx";

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
    { key: "custom" as const, label: "Custom Production", icon: Compass },
  ];

  return (
    <section
      className="festive-ambient-canvas"
      style={{
        padding: "80px 0 75px",
        background: "linear-gradient(180deg, #111420 0%, var(--canvas) 100%)",
        borderBottom: "2px solid var(--surface-border)",
        position: "relative",
      }}
    >
      {/* ReactBits Radiant Gradient Dust & Stardust Particles */}
      <ReactBitsDust />

      <div className="container" style={{ textAlign: "center", maxWidth: "980px", position: "relative", zIndex: 1 }}>
        {/* Animated Plush Mascots Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          {/* Fluffy Pink Waving Mascot with Speech Bubble */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div className="mascot-speech-bubble">
              HEY! LET'S PLAN AN EPIC EVENT! ✨
            </div>
            <img
              src="/mascot-pink.png"
              alt="Festiya Fluffy Pink Mascot Waving"
              className="mascot-waving-plush"
            />
          </div>

          {/* Bubble Mint Plush Mascot */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div
              className="mascot-speech-bubble"
              style={{
                borderColor: "var(--neopop-mint)",
                background: "#00E599",
                color: "#000000",
              }}
            >
              POWERED BY AI COPILOT 🚀
            </div>
            <img
              src="/mascot-mint.png"
              alt="Festiya Bubble Mint Plush Mascot"
              className="mascot-mint-plush"
            />
          </div>
        </div>

        {/* Direct NeoPOP Headline — Vibrant Festive Gradient Text */}
        <h1
          className="neopop-title"
          style={{
            fontSize: "clamp(38px, 6vw, 72px)",
            lineHeight: 1.05,
            color: "#FFFFFF",
            marginBottom: "20px",
            letterSpacing: "-0.03em",
          }}
        >
          PRODUCTION EVENT <br />
          <span className="festive-gradient-text">INFRASTRUCTURE & CELEBRATION</span>
        </h1>

        <p
          style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            color: "var(--ink-secondary)",
            maxWidth: "760px",
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          High-precision planning for producers, planners, and party hosts. Synthesize decimal-safe budgets, vendor agreements, cue-by-cue run of shows, and instant contingency reasoning.
        </p>

        {/* Global Access / 1-Click Live Demos — Anyone Worldwide Can Use Instantly */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "40px",
          }}
        >
          <button
            aria-label="Explore Jaipur destination wedding demo"
            type="button"
            onClick={() => onExploreDemoEvent("evt_wedding_jaipur")}
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: "var(--neopop-gold)",
              color: "var(--neopop-gold)",
            }}
          >
            <span>💍 JAIPUR WEDDING DEMO (₹45,00,000)</span>
          </button>

          <button
            aria-label="Explore Apex summit leadership dinner demo"
            type="button"
            onClick={() => onExploreDemoEvent("evt_apex_summit")}
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: "var(--neopop-blue)",
              color: "#8CB0FF",
            }}
          >
            <span>🏢 APEX SUMMIT DEMO ($125,000)</span>
          </button>
        </div>

        {/* NeoPOP 3D Plinth Brief Container — NO SQUISHED BOXES */}
        <div
          className="card"
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            textAlign: "left",
            padding: "36px",
            background: "var(--surface)",
            border: "2px solid var(--surface-border-strong)",
            boxShadow: "7px 7px 0px #000000",
          }}
        >
          <form onSubmit={onSubmit}>
            {/* Category 3D Grid */}
            <div style={{ marginBottom: "26px" }}>
              <label className="form-label" style={{ marginBottom: "10px", display: "block" }}>
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
                        borderRadius: "var(--radius-md)",
                        border: isSelected ? "2px solid var(--neopop-mint)" : "1.5px solid var(--surface-border)",
                        background: isSelected ? "var(--surface-alt)" : "#0C0E14",
                        color: isSelected ? "var(--neopop-mint)" : "var(--ink-secondary)",
                        fontWeight: 700,
                        fontSize: "12.5px",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        boxShadow: isSelected ? "3px 3px 0px #000000" : "none",
                        transition: "all 0.12s ease",
                      }}
                    >
                      <Icon size={16} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Occasion Input */}
            <div style={{ marginBottom: "26px" }}>
              <label className="form-label" htmlFor="occasion-input" style={{ marginBottom: "8px", display: "block" }}>
                2. Event Scope or Name
              </label>
              <input
                id="occasion-input"
                aria-label="What are you celebrating"
                className="form-input"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  padding: "14px 18px",
                }}
                placeholder="e.g. Maya & Arjun 3-Day Heritage Celebration or Annual Tech Summit"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                required
              />
            </div>

            {/* Date, Guests, Budget Grid — Ample Breathing Room */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "20px",
                marginBottom: "32px",
              }}
            >
              {/* Date */}
              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label htmlFor="landing-event-date" className="form-label">Schedule Date</label>
                  <button
                    aria-label="Toggle event date between decided and undecided"
                    type="button"
                    onClick={() => setDateMode(dateMode === "decided" ? "undecided" : "decided")}
                    style={{ fontSize: "11px", color: "var(--neopop-mint)", fontWeight: 700, textTransform: "uppercase" }}
                  >
                    {dateMode === "decided" ? "Undecided?" : "Specify Date"}
                  </button>
                </div>
                {dateMode === "decided" ? (
                  <input
                    id="landing-event-date"
                    aria-label="Event date"
                    type="date"
                    className="form-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                ) : (
                  <div
                    style={{
                      padding: "12px 14px",
                      background: "#0C0E14",
                      borderRadius: "var(--radius-md)",
                      fontSize: "12px",
                      color: "var(--ink-secondary)",
                      border: "1.5px dashed var(--surface-border)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    RELATIVE DAY-OFFSET TIMELINE
                  </div>
                )}
              </div>

              {/* Guest Count */}
              <div className="form-group">
                <label htmlFor="landing-guest-count" className="form-label">Attendees / Scale</label>
                <input
                  id="landing-guest-count"
                  aria-label="Approximate guest count"
                  type="number"
                  className="form-input"
                  min="2"
                  max="10000"
                  value={guestCount ?? ""}
                  onChange={(e) => setGuestCount(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="e.g. 150"
                />
              </div>

              {/* Target Budget & Currency */}
              <div className="form-group">
                <label htmlFor="landing-target-budget" className="form-label">Target Budget</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <select
                    id="landing-currency"
                    aria-label="Currency"
                    className="form-select"
                    style={{ width: "105px", fontWeight: 700 }}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AUD">AUD (A$)</option>
                    <option value="SGD">SGD (S$)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                  <input
                    id="landing-target-budget"
                    aria-label="Target budget"
                    type="number"
                    className="form-input"
                    value={targetBudget ?? ""}
                    onChange={(e) => setTargetBudget(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 500000"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "18px",
                paddingTop: "16px",
                borderTop: "1.5px solid var(--surface-border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--neopop-mint)", fontWeight: 700 }}>
                <CheckCircle2 size={16} />
                <span>Zero login barrier • Instant live workspace generation</span>
              </div>
              <button
                aria-label="Launch Event Workspace"
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: "14px 32px",
                  fontSize: "14px",
                }}
              >
                <span>LAUNCH EVENT WORKSPACE</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
