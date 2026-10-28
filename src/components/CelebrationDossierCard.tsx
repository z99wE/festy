import React from 'react';
import {
  Calendar,
  ArrowRight,
  MessageSquare,
  Users,
  MapPin,
} from 'lucide-react';
import { openFestiAIChat } from './FestiChatbot';
import {
  type WorldCelebrationPin,
  formatLocalRegionalBudget,
} from '../data/worldCelebrationData';

interface CelebrationDossierCardProps {
  activePin: WorldCelebrationPin;
  onPlanEvent: (pin: WorldCelebrationPin) => void;
}

export const CelebrationDossierCard: React.FC<CelebrationDossierCardProps> = ({
  activePin,
  onPlanEvent,
}) => {
  const budgetDisplay = formatLocalRegionalBudget(activePin);

  return (
    <div className="celebration-dossier-card">
      <div className="dossier-header-row">
        <span className="dossier-category-pill">{activePin.categoryLabel}</span>
        <span className="dossier-countdown-pill">
          <Calendar size={13} aria-hidden="true" />
          <span>In {activePin.daysUntil} days</span>
        </span>
      </div>

      <div className="dossier-title-block">
        <div className="dossier-flag-location">
          <span className="dossier-flag">{activePin.flag}</span>
          <span className="dossier-location">
            {activePin.location}, {activePin.country}
          </span>
        </div>
        <h3 className="dossier-title">{activePin.name}</h3>
        <p className="dossier-tagline">{activePin.tagline}</p>
      </div>

      <div className="dossier-specs-grid">
        <div className="dossier-spec-item">
          <span className="spec-label">Calendar Dates</span>
          <span className="spec-val">
            <Calendar size={14} className="spec-icon" aria-hidden="true" />
            {activePin.dates}
          </span>
        </div>

        {/* Specific Regional Native Valuation (NO forced Rupees!) */}
        <div className="dossier-spec-item regional-valuation-highlight">
          <span className="spec-label">Local Market Valuation</span>
          <div className="regional-currency-block">
            <span className="spec-val highlight-gold">
              {budgetDisplay.localFormatted}
            </span>
            <span className="currency-code-pill">{activePin.localCurrencyCode}</span>
          </div>
          <span className="spec-usd-benchmark">{budgetDisplay.usdBenchmark}</span>
        </div>

        <div className="dossier-spec-item">
          <span className="spec-label">Expected Attendance</span>
          <span className="spec-val">
            <Users size={14} className="spec-icon" aria-hidden="true" />
            {activePin.guestRange}
          </span>
        </div>

        <div className="dossier-spec-item">
          <span className="spec-label">Regional Destination</span>
          <span className="spec-val">{activePin.region}</span>
        </div>
      </div>

      <div className="dossier-logistics-box">
        <div className="logistics-title-row">
          <MapPin size={14} className="logistics-icon" aria-hidden="true" />
          <span>Key Logistics Safeguard</span>
        </div>
        <p className="logistics-text">{activePin.logisticsHighlight}</p>
      </div>

      <div className="dossier-actions-row">
        <button
          type="button"
          aria-label="Plan this celebration"
          className="btn btn-primary dossier-btn-primary"
          onClick={() => onPlanEvent(activePin)}
        >
          <span>Plan this celebration</span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="Ask Festi AI about this event"
          title="Ask Festi AI about this event"
          className="btn btn-secondary dossier-btn-ai"
          onClick={() => openFestiAIChat(activePin.aiPrompt)}
        >
          <MessageSquare size={15} aria-hidden="true" />
          <span>Ask Festi AI</span>
        </button>
      </div>
    </div>
  );
};
