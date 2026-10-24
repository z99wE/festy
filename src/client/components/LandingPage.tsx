import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Heart,
  Cake,
  Users,
  Briefcase,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Calendar,
  Compass,
  FileSpreadsheet,
  CheckSquare,
  Layers,
  Wand2,
} from "lucide-react";
import { EventCategory, Event } from "../../types/index.ts";

interface LandingPageProps {
  onStartPlan: (brief: {
    occasion: string;
    category: EventCategory;
    dateMode: "decided" | "undecided";
    startDate?: string;
    guestCount?: number;
    currency: string;
    targetBudget?: number;
    style?: string;
  }) => void;
  onExploreDemoEvent: (eventId: string) => void;
  onGoToPricing: () => void;
  availableEvents: Event[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlan,
  onExploreDemoEvent,
  onGoToPricing,
  availableEvents,
}) => {
  const [occasion, setOccasion] = useState("");
  const [category, setCategory] = useState<EventCategory>("wedding");
  const [dateMode, setDateMode] = useState<"decided" | "undecided">("undecided");
  const [startDate, setStartDate] = useState("");
  const [guestCount, setGuestCount] = useState<number | undefined>(80);
  const [currency, setCurrency] = useState("USD");
  const [targetBudget, setTargetBudget] = useState<number | undefined>(15000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartPlan({
      occasion: occasion.trim() || `${category.replace("_", " ")} Celebration`,
      category,
      dateMode,
      startDate: dateMode === "decided" ? startDate : undefined,
      guestCount,
      currency,
      targetBudget,
      style: "Joyful, elegant, and memorable",
    });
  };

  const categories = [
    { key: "wedding" as const, label: "Wedding", icon: Heart, color: "var(--coral)" },
    { key: "birthday" as const, label: "Birthday", icon: Cake, color: "#E67700" },
    { key: "gathering" as const, label: "Gathering", icon: Users, color: "var(--berry)" },
    { key: "work_event" as const, label: "Work Event", icon: Briefcase, color: "var(--cobalt)" },
    { key: "custom" as const, label: "Custom Occasion", icon: Compass, color: "var(--mint)" },
  ];

  return (
    <div>
      {/* 1. Hero Section with Warm Carnival Glow */}
      <section
        style={{
          padding: "70px 0 60px",
          background: "radial-gradient(ellipse at 50% 20%, #FFF2E0 0%, var(--canvas) 70%)",
          borderBottom: "1px solid var(--surface-border)",
        }}
      >
        <div className="container" style={{ textAlign: "center", maxWidth: "960px" }}>
          <div
            className="badge badge-coral"
            style={{ marginBottom: "20px", padding: "6px 14px", fontSize: "13px" }}
          >
            <Sparkles size={14} />
            <span>AI-Powered Event Planning & Operations Workspace</span>
          </div>

          <h1
            className="serif-heading"
            style={{
              fontSize: "clamp(36px, 5.5vw, 62px)",
              lineHeight: 1.12,
              letterSpacing: "-1px",
              color: "var(--ink)",
              marginBottom: "20px",
            }}
          >
            Your next great event <br />
            <span style={{ color: "var(--coral)" }}>starts here.</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(17px, 2.2vw, 21px)",
              color: "var(--ink-secondary)",
              maxWidth: "700px",
              margin: "0 auto 40px",
              lineHeight: 1.5,
            }}
          >
            Tell us what you’re celebrating. We’ll turn it into an editable plan, a realistic
            budget, and a clear next step.
          </p>

          {/* Quick Demo Shortcuts */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "36px",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink-muted)" }}>
              Explore Live Demos:
            </span>
            <button
              aria-label="Explore Jaipur wedding demo"
              onClick={() => onExploreDemoEvent("evt_wedding_jaipur")}
              className="badge badge-sunshine"
              style={{ cursor: "pointer", padding: "6px 12px", fontSize: "13px" }}
            >
              💍 Maya & Arjun's Destination Wedding (Jaipur)
            </button>
            <button
              aria-label="Explore Apex summit demo"
              onClick={() => onExploreDemoEvent("evt_apex_summit")}
              className="badge badge-cobalt"
              style={{ cursor: "pointer", padding: "6px 12px", fontSize: "13px" }}
            >
              🏢 Apex Global Leadership Dinner (New York)
            </button>
          </div>

          {/* 2. Interactive Event Prompt Card */}
          <div
            className="card"
            style={{
              maxWidth: "840px",
              margin: "0 auto",
              textAlign: "left",
              padding: "32px",
              border: "2px solid var(--surface-border)",
              boxShadow: "0 14px 40px rgba(36, 33, 43, 0.09)",
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Category selector pills */}
              <div style={{ marginBottom: "20px" }}>
                <label className="form-label" style={{ marginBottom: "10px", display: "block" }}>
                  Select Event Category
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {categories.map((c) => {
                    const Icon = c.icon;
                    const isSelected = category === c.key;
                    return (
                      <button
                        type="button"
                        key={c.key}
                        aria-label={`Select ${c.label} category`}
                        onClick={() => setCategory(c.key)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 16px",
                          borderRadius: "var(--radius-full)",
                          border: isSelected ? "2px solid var(--ink)" : "1px solid var(--surface-border)",
                          background: isSelected ? "var(--ink)" : "var(--surface)",
                          color: isSelected ? "#FFFFFF" : "var(--ink)",
                          fontWeight: 600,
                          fontSize: "13px",
                          transition: "all 0.15s ease",
                          cursor: "pointer",
                        }}
                      >
                        <Icon size={15} color={isSelected ? "#FFF" : c.color} />
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Occasion Prompt */}
              <div style={{ marginBottom: "20px" }}>
                <label className="form-label" htmlFor="occasion-input">
                  What are you celebrating?
                </label>
                <input
                  id="occasion-input"
                  className="form-input"
                  style={{
                    fontSize: "17px",
                    fontWeight: 600,
                    padding: "14px 18px",
                    borderRadius: "var(--radius-md)",
                  }}
                  placeholder="e.g. Silver Jubilee Wedding Anniversary with Family & Friends"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  required
                />
              </div>

              {/* Date, Guests, Budget Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                {/* Date */}
                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label htmlFor="landing-event-date" className="form-label">Event Date</label>
                    <button
                      aria-label="Toggle event date between decided and undecided"
                      type="button"
                      onClick={() => setDateMode(dateMode === "decided" ? "undecided" : "decided")}
                      style={{ fontSize: "11px", color: "var(--cobalt)", fontWeight: 600 }}
                    >
                      {dateMode === "decided" ? "Not decided yet?" : "Set specific date"}
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
                        padding: "10px 14px",
                        background: "var(--surface-alt)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "13px",
                        color: "var(--ink-secondary)",
                        border: "1px dashed var(--surface-border)",
                      }}
                    >
                      🗓️ Date undecided (Festiya uses relative milestone offsets)
                    </div>
                  )}
                </div>

                {/* Guest Count */}
                <div className="form-group">
                  <label htmlFor="landing-guest-count" className="form-label">Approximate Guests</label>
                  <input
                    id="landing-guest-count"
                    aria-label="Approximate guest count"
                    type="number"
                    className="form-input"
                    min="2"
                    max="10000"
                    value={guestCount ?? ""}
                    onChange={(e) => setGuestCount(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 75"
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
                      style={{ width: "95px", fontWeight: 700 }}
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="AUD">AUD (A$)</option>
                      <option value="CAD">CAD (C$)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="SGD">SGD (S$)</option>
                    </select>
                    <input
                      id="landing-target-budget"
                      aria-label="Target budget"
                      type="number"
                      className="form-input"
                      value={targetBudget ?? ""}
                      onChange={(e) => setTargetBudget(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="e.g. 10000"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                <p style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                  ⚡ Generates low/likely/high estimates, vendor criteria, tasks & timeline.
                </p>
                <button
                  aria-label="Build my event plan"
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: "14px 28px",
                    fontSize: "16px",
                    fontWeight: 700,
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <Wand2 size={18} />
                  <span>Build my plan</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 3. The Festiya Difference: Fragmented vs Festiya */}
      <section style={{ padding: "80px 0", background: "var(--surface)" }}>
        <div className="container" style={{ maxWidth: "1080px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 className="serif-heading" style={{ fontSize: "36px", marginBottom: "14px" }}>
              From planning chaos to an executable plan
            </h2>
            <p style={{ color: "var(--ink-secondary)", fontSize: "17px", maxWidth: "600px", margin: "0 auto" }}>
              The goal is not to generate more text. It is to make the next useful action obvious.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            <div
              className="card"
              style={{
                background: "var(--surface-alt)",
                border: "1px dashed var(--surface-border)",
              }}
            >
              <div className="badge badge-neutral" style={{ marginBottom: "14px" }}>
                The Fragmented Way
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
                <li style={{ display: "flex", gap: "10px", fontSize: "14px", color: "var(--ink-secondary)" }}>
                  <span style={{ color: "#E03131" }}>✕</span>
                  Start from a blank, intimidating document
                </li>
                <li style={{ display: "flex", gap: "10px", fontSize: "14px", color: "var(--ink-secondary)" }}>
                  <span style={{ color: "#E03131" }}>✕</span>
                  Guess what happens next and miss critical deadlines
                </li>
                <li style={{ display: "flex", gap: "10px", fontSize: "14px", color: "var(--ink-secondary)" }}>
                  <span style={{ color: "#E03131" }}>✕</span>
                  Track costs across 4 different notes and spreadsheets
                </li>
                <li style={{ display: "flex", gap: "10px", fontSize: "14px", color: "var(--ink-secondary)" }}>
                  <span style={{ color: "#E03131" }}>✕</span>
                  Lose key decisions and vendor quotes in group chats
                </li>
                <li style={{ display: "flex", gap: "10px", fontSize: "14px", color: "var(--ink-secondary)" }}>
                  <span style={{ color: "#E03131" }}>✕</span>
                  Trust unverified AI advice without sanity checks
                </li>
              </ul>
            </div>

            <div
              className="card"
              style={{
                border: "2px solid var(--coral)",
                boxShadow: "0 10px 30px rgba(255, 98, 87, 0.08)",
              }}
            >
              <div className="badge badge-coral" style={{ marginBottom: "14px" }}>
                The Festiya Way
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "14px" }}>
                <li style={{ display: "flex", gap: "10px", fontSize: "14px", fontWeight: 600 }}>
                  <CheckCircle2 size={18} color="var(--mint)" />
                  Structured brief converts directly to structured work
                </li>
                <li style={{ display: "flex", gap: "10px", fontSize: "14px", fontWeight: 600 }}>
                  <CheckCircle2 size={18} color="var(--mint)" />
                  Automated checklist with dependency-linked timeline
                </li>
                <li style={{ display: "flex", gap: "10px", fontSize: "14px", fontWeight: 600 }}>
                  <CheckCircle2 size={18} color="var(--mint)" />
                  Decimal-safe budget: estimates, quotes, committed & actuals
                </li>
                <li style={{ display: "flex", gap: "10px", fontSize: "14px", fontWeight: 600 }}>
                  <CheckCircle2 size={18} color="var(--mint)" />
                  Centralized partner CRM with notes and quote tracking
                </li>
                <li style={{ display: "flex", gap: "10px", fontSize: "14px", fontWeight: 600 }}>
                  <CheckCircle2 size={18} color="var(--mint)" />
                  Humans stay in control: AI proposes, you review and accept
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Three Steps Flow */}
      <section style={{ padding: "80px 0", background: "var(--canvas)" }}>
        <div className="container" style={{ maxWidth: "1080px" }}>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 className="serif-heading" style={{ fontSize: "36px", marginBottom: "14px" }}>
              Three steps to calm execution
            </h2>
            <p style={{ color: "var(--ink-secondary)", fontSize: "17px" }}>
              A disciplined workflow designed to reduce decision fatigue.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            <div className="card" style={{ background: "var(--surface)" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "var(--coral-light)",
                  color: "var(--coral)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "18px",
                  marginBottom: "16px",
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: "19px", marginBottom: "8px" }}>Tell us what matters</h3>
              <p style={{ fontSize: "14px", color: "var(--ink-secondary)", lineHeight: 1.6 }}>
                Describe your occasion, location preference, guest count, and any dietary or cultural constraints.
              </p>
            </div>

            <div className="card" style={{ background: "var(--surface)" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "var(--sunshine-light)",
                  color: "#B38600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "18px",
                  marginBottom: "16px",
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: "19px", marginBottom: "8px" }}>Shape the plan</h3>
              <p style={{ fontSize: "14px", color: "var(--ink-secondary)", lineHeight: 1.6 }}>
                Review low/likely/high budget allocations, adjust tasks, compare vendor quotes, and accept curated ideas.
              </p>
            </div>

            <div className="card" style={{ background: "var(--surface)" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "var(--mint-bg)",
                  color: "var(--mint)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "18px",
                  marginBottom: "16px",
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: "19px", marginBottom: "8px" }}>Make it happen</h3>
              <p style={{ fontSize: "14px", color: "var(--ink-secondary)", lineHeight: 1.6 }}>
                Share scoped client views, track day-of run-of-show cues, and monitor your budget health in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Inspiration Collections */}
      <section style={{ padding: "80px 0", background: "var(--surface)" }}>
        <div className="container" style={{ maxWidth: "1080px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 className="serif-heading" style={{ fontSize: "36px", marginBottom: "12px" }}>
              Inspiration Collections
            </h2>
            <p style={{ color: "var(--ink-secondary)", fontSize: "17px" }}>
              Curated concepts tested across realistic budgets and guest scales.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            <div className="card" style={{ borderTop: "4px solid var(--coral)" }}>
              <span className="badge badge-coral" style={{ marginBottom: "12px" }}>Collection</span>
              <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>Small details, big memories</h3>
              <p style={{ fontSize: "14px", color: "var(--ink-secondary)", marginBottom: "16px" }}>
                Focusing investments into sensory touches: custom fragrance bars, live watercolor portraitists, and handwritten guest welcomes.
              </p>
              <button
                aria-label="View Jaipur Wedding Example"
                onClick={() => onExploreDemoEvent("evt_wedding_jaipur")}
                className="btn btn-secondary btn-sm"
              >
                <span>View Jaipur Wedding Example</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="card" style={{ borderTop: "4px solid var(--sunshine)" }}>
              <span className="badge badge-sunshine" style={{ marginBottom: "12px" }}>Collection</span>
              <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>Celebration on a budget</h3>
              <p style={{ fontSize: "14px", color: "var(--ink-secondary)", marginBottom: "16px" }}>
                Clever budget allocations: food truck gallerias, Spotify acoustic transition sets, and twilight micro-lighting over public venues.
              </p>
              <button
                aria-label="Try Budget Template"
                onClick={() => {
                  setOccasion("Rooftop Sunset Gathering with Friends");
                  setCategory("gathering");
                  setTargetBudget(3500);
                  window.scrollTo({ top: 150, behavior: "smooth" });
                }}
                className="btn btn-secondary btn-sm"
              >
                <span>Try Budget Template</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="card" style={{ borderTop: "4px solid var(--cobalt)" }}>
              <span className="badge badge-cobalt" style={{ marginBottom: "12px" }}>Collection</span>
              <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>Bring everyone together</h3>
              <p style={{ fontSize: "14px", color: "var(--ink-secondary)", marginBottom: "16px" }}>
                Large scale gatherings and professional executive summits with hybrid audio/video, designated speaker runs, and VIP dinners.
              </p>
              <button
                aria-label="View Executive Summit Example"
                onClick={() => onExploreDemoEvent("evt_apex_summit")}
                className="btn btn-secondary btn-sm"
              >
                <span>View Executive Summit Example</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing Teaser CTA */}
      <section
        style={{
          padding: "70px 0",
          background: "var(--canvas)",
          borderTop: "1px solid var(--surface-border)",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: "700px" }}>
          <h2 className="serif-heading" style={{ fontSize: "32px", marginBottom: "14px" }}>
            Ready to plan your next milestone?
          </h2>
          <p style={{ color: "var(--ink-secondary)", fontSize: "16px", marginBottom: "24px" }}>
            Start on the free tier with 2 active events, or unlock unlimited client workspaces on Planner Pro.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              aria-label="Start Planning Now"
              onClick={() => window.scrollTo({ top: 120, behavior: "smooth" })}
              className="btn btn-primary"
            >
              <span>Start Planning Now</span>
              <ArrowRight size={16} />
            </button>
            <button
              aria-label="View Pricing and Entitlements"
              onClick={onGoToPricing}
              className="btn btn-secondary"
            >
              View Pricing & Entitlements
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
