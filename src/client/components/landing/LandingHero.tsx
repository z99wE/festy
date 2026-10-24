import React from "react";
import {
  ArrowRight,
  Heart,
  Cake,
  Users,
  Briefcase,
  Compass,
  Calendar,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import { EventCategory } from "../../../types/index.ts";

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
    { key: "wedding" as const, label: "Wedding", icon: Heart, color: "var(--coral)" },
    { key: "birthday" as const, label: "Birthday", icon: Cake, color: "#E67700" },
    { key: "gathering" as const, label: "Gathering", icon: Users, color: "var(--berry)" },
    { key: "work_event" as const, label: "Work Event", icon: Briefcase, color: "var(--cobalt)" },
    { key: "custom" as const, label: "Custom Occasion", icon: Compass, color: "var(--mint)" },
  ];

  return (
    <section
      style={{
        padding: "70px 0 60px",
        background: "radial-gradient(ellipse at 50% 20%, #FFF2E0 0%, var(--canvas) 70%)",
        borderBottom: "1px solid var(--surface-border)",
      }}
    >
      <div className="container" style={{ textAlign: "center", maxWidth: "960px" }}>
        {/* Trust Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "9999px",
            background: "rgba(255, 98, 87, 0.1)",
            color: "var(--coral)",
            fontSize: "13px",
            fontWeight: 700,
            marginBottom: "20px",
          }}
        >
          <span>The Event Operations Command Center</span>
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
          Run unforgettable events. <br />
          <span style={{ color: "var(--coral)" }}>Without the spreadsheet chaos.</span>
        </h1>

        <p
          style={{
            fontSize: "clamp(17px, 2.2vw, 21px)",
            color: "var(--ink-secondary)",
            maxWidth: "720px",
            margin: "0 auto 36px",
            lineHeight: 1.5,
          }}
        >
          From initial brief to minute-by-minute cue sheets. Build accurate decimal-safe budgets, align vendor contracts, track live run-of-show cues, and share client proposals in seconds.
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
            style={{ cursor: "pointer", padding: "6px 14px", fontSize: "13px", fontWeight: 600 }}
          >
            💍 Maya & Arjun's Destination Wedding (Jaipur)
          </button>
          <button
            aria-label="Explore Apex summit demo"
            onClick={() => onExploreDemoEvent("evt_apex_summit")}
            className="badge badge-cobalt"
            style={{ cursor: "pointer", padding: "6px 14px", fontSize: "13px", fontWeight: 600 }}
          >
            🏢 Apex Global Leadership Dinner (New York)
          </button>
        </div>

        {/* Interactive Brief Form Card */}
        <div
          className="card"
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            textAlign: "left",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--surface-border)",
            background: "var(--surface)",
            padding: "32px",
          }}
        >
          <form onSubmit={onSubmit}>
            {/* Category Selector */}
            <div style={{ marginBottom: "20px" }}>
              <label className="form-label" style={{ marginBottom: "8px", display: "block" }}>
                Select Event Type
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "8px",
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
                        padding: "10px 14px",
                        borderRadius: "var(--radius-md)",
                        border: isSelected ? "2px solid var(--coral)" : "1px solid var(--surface-border)",
                        background: isSelected ? "var(--coral-light)" : "var(--surface)",
                        color: isSelected ? "var(--coral)" : "var(--ink)",
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: "13px",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <Icon size={16} color={cat.color} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Occasion Input */}
            <div style={{ marginBottom: "20px" }}>
              <label className="form-label" htmlFor="occasion-input">
                What are you celebrating?
              </label>
              <input
                id="occasion-input"
                aria-label="What are you celebrating"
                className="form-input"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  padding: "12px 16px",
                  borderRadius: "var(--radius-md)",
                }}
                placeholder="e.g. Silver Jubilee Anniversary or Annual Global Executive Forum"
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
                    🗓️ Date undecided (Relative timeline schedule)
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
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--mint)", fontWeight: 600 }}>
                <CheckCircle2 size={16} />
                <span>Instant master plan, budget ledger, and timeline</span>
              </div>
              <button
                aria-label="Create My Event Plan"
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: "14px 28px",
                  fontSize: "16px",
                  fontWeight: 700,
                  borderRadius: "var(--radius-md)",
                }}
              >
                <span>Create Event Plan</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
