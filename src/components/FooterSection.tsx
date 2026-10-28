import React from 'react';
import type { ActiveAppTab } from './Navbar';

interface FooterSectionProps {
  onNavigateTab: (tab: ActiveAppTab) => void;
  onSelectOccasion: (occ: string) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onNavigateTab,
  onSelectOccasion,
}) => {
  const handleNav = (tab: ActiveAppTab) => {
    onNavigateTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOccasion = (occ: string) => {
    onSelectOccasion(occ);
    onNavigateTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="content-wrapper">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <img
                src="/festiya-logo-nav.webp"
                alt="Celebration Architect & Global Event Workspace Brand Logo"
                title="Turn every moment into a festival"
                width={64}
                height={24}
                style={{ height: '24px', width: 'auto' }}
              />
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Turn every moment into a festival. Global event planning workspace.
            </p>
          </div>

          <div className="footer-col">
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>App Sections</h3>
            <ul className="footer-links">
              <li>
                <button type="button" aria-label="Navigate to Home" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => handleNav('home')}>
                  Home
                </button>
              </li>
              <li>
                <button type="button" aria-label="Navigate to Blueprints" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => handleNav('blueprints')}>
                  Blueprints
                </button>
              </li>
              <li>
                <button type="button" aria-label="Navigate to Planner" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => handleNav('planner')}>
                  Planner
                </button>
              </li>
              <li>
                <button type="button" aria-label="Navigate to FAQ & Support" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => handleNav('faq')}>
                  FAQ & Support
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>Event types</h3>
            <ul className="footer-links">
              <li>
                <button type="button" aria-label="Plan Weddings and Receptions" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => handleOccasion('wedding')}>
                  Weddings and Receptions
                </button>
              </li>
              <li>
                <button type="button" aria-label="Plan Milestone Birthdays" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => handleOccasion('birthday')}>
                  Milestone Birthdays
                </button>
              </li>
              <li>
                <button type="button" aria-label="Plan Music Festivals & Carnivals" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => handleOccasion('festival')}>
                  Music Festivals & Carnivals
                </button>
              </li>
              <li>
                <button type="button" aria-label="Plan Tech Product Launches" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => handleOccasion('product_launch')}>
                  Tech Product Launches
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-legal-notice-band">
          <div className="footer-legal-grid">
            <div className="footer-legal-block">
              <h4 className="footer-legal-heading">Data Privacy & Client Confidentiality</h4>
              <p className="footer-legal-text">
                Festiya operates in full compliance with international data privacy frameworks including the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA/CPRA), and modern digital security standards. All celebration plans, vendor budgets, event timelines, and client guest records created within this workspace are stored securely in isolated tenant environments. Festiya does not sell, monetize, broker, or transmit personal consumer information to third-party commercial brokers or unauthorized marketing networks.
              </p>
            </div>

            <div className="footer-legal-block">
              <h4 className="footer-legal-heading">Planning & Valuation Disclaimer</h4>
              <p className="footer-legal-text">
                All budget projections, vendor rate evaluations, game-theoretic negotiation benchmarks, regional abacus valuations, and multi-agent AI recommendations are provided solely for budgeting reference and event planning guidance. Actual contractor pricing, availability, seasonal surges, minimum spends, municipal permitting requirements, security deposits, and local sales taxes are subject to formal agreements executed directly between event organizers and licensed local vendors. Organizers are advised to verify regional municipal permits, fire codes, liquor licensing, and vendor liability coverage prior to executing binding commitments.
              </p>
            </div>
          </div>

          <div className="footer-legal-compliance-bar">
            <div className="footer-compliance-badges">
              <span className="footer-compliance-pill">GDPR Ready</span>
              <span>•</span>
              <span className="footer-compliance-pill">CCPA Compliant</span>
              <span>•</span>
              <span className="footer-compliance-pill">Decimal-Accurate Accounting</span>
              <span>•</span>
              <span className="footer-compliance-pill">Zero Third-Party Trackers</span>
            </div>

            <div className="footer-legal-links">
              <span className="footer-legal-link-btn">Terms of Service</span>
              <span>•</span>
              <span className="footer-legal-link-btn">Privacy Policy</span>
              <span>•</span>
              <span className="footer-legal-link-btn">Data Processing Addendum</span>
              <span>•</span>
              <span className="footer-legal-link-btn">Cookie Directives</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
          <span>© 2026 Festiya. All rights reserved.</span>
          <span>Turn every moment into a festival.</span>
        </div>
      </div>
    </footer>
  );
};
