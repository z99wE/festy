import React, { useState } from "react";
import { X, Wand2, Calendar, MapPin, Users, DollarSign, Sparkles, AlertCircle } from "lucide-react";
import { EventCategory, LocationMode, DateMode } from "../../types/index.ts";

interface EventBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    occasion: string;
    category: EventCategory;
    dateMode: DateMode;
    startDate?: string;
    endDate?: string;
    locationMode: LocationMode;
    locationAddress?: string;
    guestCount?: number;
    currency: string;
    targetBudget?: number;
    style?: string;
    constraints?: string;
    generateImmediately: boolean;
  }) => void;
  initialValues?: {
    occasion?: string;
    category?: EventCategory;
    dateMode?: DateMode;
    startDate?: string;
    guestCount?: number;
    currency?: string;
    targetBudget?: number;
    style?: string;
  };
}

export const EventBriefModal: React.FC<EventBriefModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(initialValues?.occasion || "");
  const [occasion, setOccasion] = useState(initialValues?.occasion || "");
  const [category, setCategory] = useState<EventCategory>(initialValues?.category || "gathering");
  const [dateMode, setDateMode] = useState<DateMode>(initialValues?.dateMode || "undecided");
  const [startDate, setStartDate] = useState(initialValues?.startDate || "");
  const [endDate, setEndDate] = useState("");
  const [locationMode, setLocationMode] = useState<LocationMode>("in_person");
  const [locationAddress, setLocationAddress] = useState("");
  const [guestCount, setGuestCount] = useState<string>(initialValues?.guestCount ? String(initialValues.guestCount) : "60");
  const [currency, setCurrency] = useState(initialValues?.currency || "USD");
  const [targetBudget, setTargetBudget] = useState<string>(initialValues?.targetBudget ? String(initialValues.targetBudget) : "8000");
  const [style, setStyle] = useState(initialValues?.style || "");
  const [constraints, setConstraints] = useState("");

  const handleSubmit = (generateImmediately: boolean) => {
    onSubmit({
      name: name.trim() || occasion.trim() || `${category.replace("_", " ")} Event`,
      occasion: occasion.trim() || name.trim() || "Celebration",
      category,
      dateMode,
      startDate: dateMode === "decided" && startDate ? startDate : undefined,
      endDate: dateMode === "decided" && endDate ? endDate : undefined,
      locationMode,
      locationAddress: locationAddress.trim() || undefined,
      guestCount: guestCount ? Number(guestCount) : undefined,
      currency,
      targetBudget: targetBudget ? Number(targetBudget) : undefined,
      style: style.trim() || undefined,
      constraints: constraints.trim() || undefined,
      generateImmediately,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="brief-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div className="badge badge-coral" style={{ marginBottom: "8px" }}>
              <Sparkles size={13} />
              <span>Event Brief</span>
            </div>
            <h2 id="brief-title" className="serif-heading" style={{ fontSize: "24px" }}>
              Plan a new celebration
            </h2>
            <p style={{ fontSize: "13px", color: "var(--ink-secondary)" }}>
              Fill in what you know now. Optional fields can be completed or revised at any time.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "var(--radius-sm)",
              color: "var(--ink-muted)",
              cursor: "pointer",
            }}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
            >
              <option value="wedding">Wedding / Reception</option>
              <option value="birthday">Birthday / Milestone Year</option>
              <option value="gathering">Social Gathering / Dinner / Reunion</option>
              <option value="work_event">Work Event / Corporate Summit</option>
              <option value="custom">Custom Occasion / Festival</option>
            </select>
          </div>

          {/* Occasion / Name */}
          <div className="form-group">
            <label className="form-label">Event Name / Occasion *</label>
            <input
              className="form-input"
              placeholder="e.g. Maya & Arjun's Destination Wedding or 40th Birthday"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!occasion) setOccasion(e.target.value);
              }}
              required
            />
          </div>

          {/* Date row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label className="form-label">Date Status</label>
                <button
                  type="button"
                  onClick={() => setDateMode(dateMode === "decided" ? "undecided" : "decided")}
                  style={{ fontSize: "11px", color: "var(--cobalt)", fontWeight: 600 }}
                >
                  {dateMode === "decided" ? "Undecided" : "Decided"}
                </button>
              </div>
              {dateMode === "decided" ? (
                <input
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              ) : (
                <div style={{ fontSize: "12px", color: "var(--ink-muted)", padding: "10px 12px", background: "var(--surface-alt)", borderRadius: "var(--radius-md)" }}>
                  Relative timeline will be used (e.g. T-60 days)
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Location Mode</label>
              <select
                className="form-select"
                value={locationMode}
                onChange={(e) => setLocationMode(e.target.value as LocationMode)}
              >
                <option value="in_person">In-Person</option>
                <option value="hybrid">Hybrid (Streamed & Live)</option>
                <option value="virtual">Virtual / Online Only</option>
              </select>
            </div>
          </div>

          {/* Location Address */}
          <div className="form-group">
            <label className="form-label">Destination / Venue Address (Optional)</label>
            <input
              className="form-input"
              placeholder="e.g. Brooklyn Botanic Garden or Jaipur Heritage Palace"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
            />
          </div>

          {/* Guests & Budget */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">Guest Count Estimate</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 80"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Budget</label>
              <div style={{ display: "flex", gap: "6px" }}>
                <select
                  className="form-select"
                  style={{ width: "90px" }}
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
                </select>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 12000"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Aesthetic Style */}
          <div className="form-group">
            <label className="form-label">Style & Atmosphere (Optional)</label>
            <input
              className="form-input"
              placeholder="e.g. Candlelit bohemian courtyard, modern editorial chic"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            />
          </div>

          {/* Dietary & Accessibility Constraints */}
          <div className="form-group">
            <label className="form-label">Dietary, Accessibility or Timing Constraints (Optional)</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="e.g. Step-free wheelchair access, gluten-free vegan options, strict 10 PM sound curfew"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "12px",
            marginTop: "28px",
            paddingTop: "16px",
            borderTop: "1px solid var(--surface-border)",
          }}
        >
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="btn btn-secondary"
          >
            Save draft only
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="btn btn-primary"
          >
            <Wand2 size={16} />
            <span>Generate structured plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
