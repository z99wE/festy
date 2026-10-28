import React from 'react';
import { OCCASIONS } from '../data/planBuilderData';
import type { OccasionArchetype } from '../data/planBuilderData';
import type { CurrencyScale } from '../utils/currency';

export interface PlanControlsCardProps {
  activeOccasion: string;
  onSelectOccasion: (id: string) => void;
  guestCount: number;
  onGuestCountChange: (count: number) => void;
  guestSliderId: string;
  budgetAmount: number;
  onBudgetAmountChange: (amount: number) => void;
  budgetSliderId: string;
  budgetScale: CurrencyScale;
  currency: string;
  onCurrencyChange: (curr: string) => void;
  currencySelectId: string;
}

const guestScaleRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.78rem',
  color: 'var(--text-faint)',
  marginTop: '4px',
};

const budgetHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
};

const budgetDisplayStyle: React.CSSProperties = {
  fontSize: '1.4rem',
  fontWeight: 800,
  color: 'var(--bubblegum-purple-blue, #5b42f3)',
  marginBottom: '8px',
};

const summaryCardStyle: React.CSSProperties = {
  background: 'var(--bg-canvas-subtle)',
  borderRadius: 'var(--radius-md)',
  padding: '16px',
  border: '1.5px solid var(--border-medium)',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  fontWeight: 700,
  textTransform: 'uppercase',
};

const metricPrimaryValStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  fontWeight: 800,
  color: 'var(--text-primary)',
};

const metricSecondaryValStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  fontWeight: 800,
  color: 'var(--bubblegum-purple-blue, #5b42f3)',
};

const OccasionButton: React.FC<{
  occ: OccasionArchetype;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ occ, isSelected, onSelect }) => {
  const btnClass = 'category-choice-btn ' + (isSelected ? 'selected' : '');
  return (
    <button
      type="button"
      aria-label={'Select occasion: ' + occ.label}
      className={btnClass}
      onClick={() => onSelect(occ.id)}
      aria-pressed={isSelected}
    >
      <span>{occ.label}</span>
    </button>
  );
};

/**
 * PlanControlsCard provides sidebar controls for occasion selection, guest sliders, and currency budgeting.
 */
export const PlanControlsCard: React.FC<PlanControlsCardProps> = ({
  activeOccasion,
  onSelectOccasion,
  guestCount,
  onGuestCountChange,
  guestSliderId,
  budgetAmount,
  onBudgetAmountChange,
  budgetSliderId,
  budgetScale,
  currency,
  onCurrencyChange,
  currencySelectId,
}) => {
  const perGuest = Math.round(budgetAmount / Math.max(1, guestCount));
  const contingency = Math.round(budgetAmount * 0.06).toLocaleString();

  return (
    <aside className="builder-controls-card" aria-label="Event Configuration Controls">
      <div className="controls-card-header">
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>Your Event Brief</h3>
      </div>

      <div className="form-group">
        <span className="form-label">Occasion / Celebration Type</span>
        <div className="category-btn-grid" role="group" aria-label="Occasion options">
          {OCCASIONS.map((occ: OccasionArchetype) => (
            <OccasionButton
              key={occ.id}
              occ={occ}
              isSelected={activeOccasion === occ.id}
              onSelect={onSelectOccasion}
            />
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={guestSliderId} className="form-label">
          <span>Guest Count</span>
          <span className="form-label-value">{guestCount} Guests</span>
        </label>
        <input
          id={guestSliderId}
          aria-label="Guest count"
          type="range"
          min="10"
          max="1000"
          step="5"
          value={guestCount}
          onChange={(e) => onGuestCountChange(Number(e.target.value))}
          className="slider-input"
          aria-valuemin={10}
          aria-valuemax={1000}
          aria-valuenow={guestCount}
        />
        <div style={guestScaleRowStyle}>
          <span>10 (Intimate)</span>
          <span>250 (Mid-Size)</span>
          <span>500 (Festival)</span>
          <span>1,000 (Mega Gathering)</span>
        </div>
      </div>

      <div className="form-group">
        <div style={budgetHeaderStyle}>
          <label htmlFor={budgetSliderId} className="form-label" style={{ margin: 0 }}>
            Target Budget
          </label>
          <div className="currency-row">
            <label htmlFor={currencySelectId} className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' }}>
              Currency
            </label>
            <select
              id={currencySelectId}
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="currency-select"
              aria-label="Currency"
            >
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
              <option value="₹">INR (₹)</option>
              <option value="A$">AUD (A$)</option>
              <option value="C$">CAD (C$)</option>
              <option value="¥">JPY (¥)</option>
              <option value="AED ">AED (AED)</option>
              <option value="CHF ">CHF (CHF)</option>
            </select>
          </div>
        </div>

        <div style={budgetDisplayStyle}>
          {currency}{budgetAmount.toLocaleString()}
        </div>

        <input
          id={budgetSliderId}
          aria-label="Target budget"
          type="range"
          min={budgetScale.min}
          max={budgetScale.max}
          step={budgetScale.step}
          value={budgetAmount}
          onChange={(e) => onBudgetAmountChange(Number(e.target.value))}
          className="slider-input"
          aria-valuemin={budgetScale.min}
          aria-valuemax={budgetScale.max}
          aria-valuenow={budgetAmount}
        />
        <div style={guestScaleRowStyle}>
          <span>{budgetScale.ticks[0]}</span>
          <span>{budgetScale.ticks[1]}</span>
          <span>{budgetScale.ticks[2]}</span>
        </div>
      </div>

      <div style={summaryCardStyle}>
        <div>
          <span style={metricLabelStyle}>
            Per Guest
          </span>
          <div style={metricPrimaryValStyle}>
            {currency}{perGuest}
          </div>
        </div>
        <div>
          <span style={metricLabelStyle}>
            Contingency Buffer
          </span>
          <div style={metricSecondaryValStyle}>
            {currency}{contingency}
          </div>
        </div>
      </div>
    </aside>
  );
};
