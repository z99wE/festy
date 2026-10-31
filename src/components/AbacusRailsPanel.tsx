import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import type { RegionalMarketProfile } from '../data/marketEconomicsData';

export interface AbacusDisplayCalculations {
  venue: number;
  catering: number;
  photo: number;
  entertainment: number;
  decor: number;
  logistics: number;
  total: number;
  perGuest: number;
}

export interface AbacusRailsPanelProps {
  pillarWeights: Record<string, number>;
  onBeadChange: (pillarId: string, level: number) => void;
  displayCalculations: AbacusDisplayCalculations;
  localCalculations: { totalLocal: number };
  currentMarket: RegionalMarketProfile;
  displayCurrencyConfig: { code: string; symbol: string; name: string };
  formatAmount: (val: number, symbol: string, code: string) => string;
  onApply: () => void;
  showAppliedToast: boolean;
}

interface RailConfig {
  id: string;
  title: string;
  valueKey: keyof Omit<AbacusDisplayCalculations, 'total' | 'perGuest'>;
  legend: [string, string, string];
}

const RAILS: RailConfig[] = [
  {
    id: 'photo',
    title: 'Photography & Cinematography',
    valueKey: 'photo',
    legend: ['Solo Shooter', 'Dual Crew', 'Cinema & Drone'],
  },
  {
    id: 'catering',
    title: 'Catering, Bar & Hospitality',
    valueKey: 'catering',
    legend: ['Buffet / Cocktail', 'Plated 3-Course', 'Live Chef Stations & Top-Shelf'],
  },
  {
    id: 'venue',
    title: 'Venue Hire & Structural Staging',
    valueKey: 'venue',
    legend: ['Hall / Loft', 'Private Estate / Garden', 'Full Historic Buyout'],
  },
  {
    id: 'entertainment',
    title: 'Acoustics, Sound & Entertainment',
    valueKey: 'entertainment',
    legend: ['Curated DJ & PA', 'Live Quartet / Trio', 'Headline Band & Show Lighting'],
  },
  {
    id: 'decor',
    title: 'Floral, Scenography & Custom Decor',
    valueKey: 'decor',
    legend: ['Minimalist Greenery', 'Floral Centerpieces', 'Full Immersive Fabrication'],
  },
  {
    id: 'logistics',
    title: 'Permits, Sound Escrow & Contingency',
    valueKey: 'logistics',
    legend: ['Standard Escrow (5%)', 'Permits & Insurance (10%)', 'Full Safety Buffer (18%)'],
  },
];

const checkIconStyle: React.CSSProperties = { color: '#059669', flexShrink: 0 };
const BEAD_LEVELS = [1, 2, 3, 4, 5];

interface AbacusBeadButtonProps {
  level: number;
  currentWeight: number;
  railTitle: string;
  onClick: () => void;
}

const AbacusBeadButton: React.FC<AbacusBeadButtonProps> = ({
  level,
  currentWeight,
  railTitle,
  onClick,
}) => {
  const isFilled = currentWeight >= level ? 'filled' : '';
  const isActive = currentWeight === level ? 'active-bead' : '';
  const className = `abacus-bead ${isFilled} ${isActive}`.trim();
  const label = 'Set ' + railTitle + ' weight to ' + level;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={currentWeight === level}
      className={className}
      onClick={onClick}
    >
      <span className="abacus-bead-core" />
    </button>
  );
};

interface AbacusRailItemProps {
  rail: RailConfig;
  val: number;
  pct: number;
  currentWeight: number;
  symbol: string;
  code: string;
  formatAmount: (val: number, symbol: string, code: string) => string;
  onBeadChange: (pillarId: string, level: number) => void;
}

const AbacusRailItem: React.FC<AbacusRailItemProps> = ({
  rail,
  val,
  pct,
  currentWeight,
  symbol,
  code,
  formatAmount,
  onBeadChange,
}) => {
  return (
    <div className="abacus-rail-item">
      <div className="abacus-rail-meta">
        <div className="abacus-rail-name-group">
          <span className="abacus-pillar-title">{rail.title}</span>
        </div>
        <div className="abacus-rail-valuation">
          <span className="abacus-rail-figure">
            {formatAmount(val, symbol, code)}
          </span>
          <span className="abacus-rail-pct">{pct}%</span>
        </div>
      </div>
      <div className="abacus-rail-track">
        {BEAD_LEVELS.map((level) => (
          <AbacusBeadButton
            key={level}
            level={level}
            currentWeight={currentWeight}
            railTitle={rail.title}
            onClick={() => onBeadChange(rail.id, level)}
          />
        ))}
      </div>
      <div className="abacus-rail-legend">
        <span>{rail.legend[0]}</span>
        <span>{rail.legend[1]}</span>
        <span>{rail.legend[2]}</span>
      </div>
    </div>
  );
};

/**
 * Interactive Expense Allocation Rails for the Event Economics Abacus.
 * Allows users to adjust weighting across event cost pillars with live calculations.
 */
export const AbacusRailsPanel: React.FC<AbacusRailsPanelProps> = ({
  pillarWeights,
  onBeadChange,
  displayCalculations,
  localCalculations,
  currentMarket,
  displayCurrencyConfig,
  formatAmount,
  onApply,
  showAppliedToast,
}) => {
  const symbol = displayCurrencyConfig.symbol;
  const code = displayCurrencyConfig.code;
  const total = displayCalculations.total;

  return (
    <div className="abacus-rails-panel">
      <div className="abacus-rails-header">
        <div>
          <h3 className="abacus-rails-title">Interactive Expense Allocation Rails</h3>
          <p className="abacus-rails-sub">
            Slide the abacus beads to weight different components of your gathering.
          </p>
        </div>
        <div className="abacus-total-snapshot" aria-live="polite" aria-atomic="true">
          <span className="abacus-snapshot-label">Synthesized Valuation</span>
          <span className="abacus-snapshot-number">
            {formatAmount(total, symbol, code)}
          </span>
          <span className="abacus-snapshot-per-head">
            {formatAmount(displayCalculations.perGuest, symbol, code)} / guest
          </span>
        </div>
      </div>

      <div className="abacus-bead-matrix">
        {RAILS.map((rail) => {
          const val = displayCalculations[rail.valueKey];
          const pct = total > 0 ? Math.round((val / total) * 100) : 0;
          const currentWeight = pillarWeights[rail.id] ?? 3;

          return (
            <AbacusRailItem
              key={rail.id}
              rail={rail}
              val={val}
              pct={pct}
              currentWeight={currentWeight}
              symbol={symbol}
              code={code}
              formatAmount={formatAmount}
              onBeadChange={onBeadChange}
            />
          );
        })}
      </div>

      <div className="abacus-actions-row">
        <div className="abacus-local-reference">
          <span className="abacus-local-ref-label">Local Origin Equivalent:</span>
          <span className="abacus-local-ref-value">
            {formatAmount(localCalculations.totalLocal, currentMarket.baseCurrencySymbol, currentMarket.baseCurrencyCode)}
            {' '}in {currentMarket.country}
          </span>
        </div>

        <button aria-label="Apply valuation to event workspace"
          type="button"
          className="btn btn-primary abacus-apply-btn"
          onClick={onApply}
        >
          <span>Apply Valuation to Event Workspace</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {showAppliedToast && (
        <div className="abacus-toast-alert" role="status">
          <CheckCircle2 size={16} style={checkIconStyle} />
          <span>
            Valuation for <strong>{currentMarket.name}</strong> ({formatAmount(total, symbol, code)}) transferred to active workspace!
          </span>
        </div>
      )}
    </div>
  );
};
