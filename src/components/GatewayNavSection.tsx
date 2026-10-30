import React from 'react';
import type { ActiveAppTab } from './Navbar';

interface GatewayNavSectionProps {
  onNavigateTab: (tab: ActiveAppTab) => void;
  onScrollToAbacus: () => void;
}

export const GatewayNavSection: React.FC<GatewayNavSectionProps> = ({
  onNavigateTab,
  onScrollToAbacus,
}) => {
  const handleNav = (tab: ActiveAppTab) => {
    onNavigateTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyDownNav = (e: React.KeyboardEvent, tab: ActiveAppTab) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNav(tab);
    }
  };

  const handleKeyDownAbacus = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onScrollToAbacus();
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 850, color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>
          Explore Different Parts of Festiya
        </h2>
      </div>

      <div className="home-gateways-grid">
        <div
          className="home-gateway-card"
          role="button"
          tabIndex={0}
          aria-label="Browse Blueprints"
          onClick={() => handleNav('blueprints')}
          onKeyDown={(e) => handleKeyDownNav(e, 'blueprints')}
        >
          <div>
            <h3 className="gateway-card-title">Blueprints</h3>
            <p className="gateway-card-desc">
              Curated celebration models covering weddings, milestone birthdays, music festivals, tech launches, and cultural galas.
            </p>
          </div>
          <div className="gateway-card-link">
            <span>Browse Blueprints</span>
          </div>
        </div>

        <div
          className="home-gateway-card"
          role="button"
          tabIndex={0}
          aria-label="Launch Planner"
          onClick={() => handleNav('planner')}
          onKeyDown={(e) => handleKeyDownNav(e, 'planner')}
        >
          <div>
            <h3 className="gateway-card-title">Planner</h3>
            <p className="gateway-card-desc">
              Dedicated 3-tier budget synthesizer (low, likely, high) and day-of chronological checklist engine.
            </p>
          </div>
          <div className="gateway-card-link">
            <span>Launch Planner</span>
          </div>
        </div>

        <div
          className="home-gateway-card"
          role="button"
          tabIndex={0}
          aria-label="Calculate Valuation with Economics Abacus"
          onClick={onScrollToAbacus}
          onKeyDown={handleKeyDownAbacus}
        >
          <div>
            <h3 className="gateway-card-title">Economics Abacus</h3>
            <p className="gateway-card-desc">
              Regional vendor valuation engine with interactive abacus allocation rails and local market dynamics.
            </p>
          </div>
          <div className="gateway-card-link">
            <span>Calculate Valuation</span>
          </div>
        </div>

        <div
          className="home-gateway-card"
          role="button"
          tabIndex={0}
          aria-label="View FAQ Hub"
          onClick={() => handleNav('faq')}
          onKeyDown={(e) => handleKeyDownNav(e, 'faq')}
        >
          <div>
            <h3 className="gateway-card-title">FAQ & Support</h3>
            <p className="gateway-card-desc">
              Answers to licensing, vendor pricing guarantees, data security and privacy, and export formats.
            </p>
          </div>
          <div className="gateway-card-link">
            <span>View FAQ Hub</span>
          </div>
        </div>
      </div>
    </div>
  );
};
