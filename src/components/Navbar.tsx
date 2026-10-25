import React, { useState, useEffect } from 'react';
import { ArrowRight, LogIn, LogOut, UserPlus } from 'lucide-react';
import { playPopSound } from '../utils/audio';

import { SUPPORTED_CURRENCIES } from '../utils/currency';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  workspaceName: string;
}

export type ActiveAppTab = 'home' | 'blueprints' | 'planner' | 'insights' | 'faq';

interface NavbarProps {
  onStartPlanning: () => void;
  soundEnabled: boolean;
  currentUser?: AuthUser | null;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onSignOut?: () => void;
  activeTab?: ActiveAppTab;
  onSelectTab?: (tab: ActiveAppTab) => void;
  currentCurrency?: string;
  onCurrencyChange?: (currencyCode: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartPlanning,
  soundEnabled,
  currentUser = null,
  onOpenAuth,
  onSignOut,
  activeTab = 'home',
  onSelectTab,
  currentCurrency = 'USD',
  onCurrencyChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    playPopSound(soundEnabled);
  };

  const handleTabClick = (tab: ActiveAppTab) => {
    setMobileMenuOpen(false);
    playPopSound(soundEnabled);
    if (onSelectTab) {
      onSelectTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Fluid Island Navbar (Detached glass pill floating at top) */}
      <header className="fluid-island-header">
        <nav className="fluid-island-pill" aria-label="Main Navigation">
          {/* Brand */}
          <a
            href="#hero"
            className="island-brand"
            aria-label="Festiya Homepage"
            onClick={(e) => {
              e.preventDefault();
              handleTabClick('home');
            }}
          >
            <div className="island-brand-icon" style={{ overflow: 'visible', background: 'transparent', width: 'auto', height: 'auto' }}>
              <img
                src="/festiya-logo-nav.webp"
                alt="Festiya 3D Brand Logo"
                width={96}
                height={36}
                style={{
                  height: '36px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 6px rgba(255, 94, 30, 0.35))',
                }}
              />
            </div>
          </a>

          {/* Desktop Nav Links / Tab Switcher */}
          <div className="island-links">
            <button
              type="button"
              className={`island-nav-link ${activeTab === 'home' ? 'active-tab' : ''}`}
              onClick={() => handleTabClick('home')}
            >
              Home
            </button>
            <button
              type="button"
              className={`island-nav-link ${activeTab === 'blueprints' ? 'active-tab' : ''}`}
              onClick={() => handleTabClick('blueprints')}
            >
              12 Blueprints
            </button>
            <button
              type="button"
              className={`island-nav-link ${activeTab === 'planner' ? 'active-tab' : ''}`}
              onClick={() => handleTabClick('planner')}
            >
              Live Planner
            </button>
            <button
              type="button"
              className={`island-nav-link ${activeTab === 'insights' ? 'active-tab' : ''}`}
              onClick={() => handleTabClick('insights')}
            >
              Event Insights
            </button>
            <button
              type="button"
              className={`island-nav-link ${activeTab === 'faq' ? 'active-tab' : ''}`}
              onClick={() => handleTabClick('faq')}
            >
              FAQ
            </button>
          </div>

          {/* Action Button & Auth */}
          <div className="island-action-group">
            {/* Currency & Region Selector */}
            <div className="navbar-currency-select-wrapper" title="Select currency & regional pricing">
              <select
                className="navbar-currency-select"
                value={currentCurrency}
                onChange={(e) => {
                  onCurrencyChange?.(e.target.value);
                  playPopSound(soundEnabled);
                }}
                aria-label="Select currency and region"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            {currentUser ? (
              <div className="navbar-user-chip" title={`${currentUser.name} (${currentUser.workspaceName})`}>
                <div className="navbar-user-avatar">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="navbar-user-name">{currentUser.name}</span>
                {onSignOut && (
                  <button
                    type="button"
                    className="navbar-logout-btn"
                    onClick={onSignOut}
                    aria-label="Sign out"
                    title="Sign Out"
                  >
                    <LogOut size={13} />
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  className="navbar-auth-btn"
                  onClick={() => onOpenAuth?.('login')}
                  aria-label="Sign in to your account"
                >
                  <LogIn size={13} />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  className="navbar-auth-btn signup"
                  onClick={() => onOpenAuth?.('signup')}
                  aria-label="Sign up for free account"
                >
                  <UserPlus size={13} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            <button
              type="button"
              className="btn btn-primary island-cta-btn"
              onClick={() => {
                handleTabClick('planner');
                onStartPlanning();
              }}
              aria-label="Build your event plan"
            >
              <span>Build plan</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>

            {/* Mobile Hamburger Morph Button */}
            <button
              type="button"
              className={`hamburger-morph-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span className="burger-line line-1" />
              <span className="burger-line line-2" />
            </button>
          </div>
        </nav>
      </header>

      {/* Screen-filling Overlay Mobile Menu with Staggered Link Reveals */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
          <div className="mobile-menu-inner">
            <div className="mobile-links-list">
              <button
                type="button"
                className={`mobile-nav-item item-delay-1 ${activeTab === 'home' ? 'active-tab' : ''}`}
                onClick={() => handleTabClick('home')}
              >
                Home 3D Experience
              </button>
              <button
                type="button"
                className={`mobile-nav-item item-delay-2 ${activeTab === 'blueprints' ? 'active-tab' : ''}`}
                onClick={() => handleTabClick('blueprints')}
              >
                12 Event Blueprints
              </button>
              <button
                type="button"
                className={`mobile-nav-item item-delay-3 ${activeTab === 'planner' ? 'active-tab' : ''}`}
                onClick={() => handleTabClick('planner')}
              >
                Live Event Planner
              </button>
              <button
                type="button"
                className={`mobile-nav-item item-delay-4 ${activeTab === 'insights' ? 'active-tab' : ''}`}
                onClick={() => handleTabClick('insights')}
              >
                Event Insights & AEO Hub
              </button>
              <button
                type="button"
                className={`mobile-nav-item item-delay-5 ${activeTab === 'faq' ? 'active-tab' : ''}`}
                onClick={() => handleTabClick('faq')}
              >
                FAQ & Support
              </button>
            </div>

            <div style={{ marginTop: '24px', width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Mobile Currency Picker */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255, 245, 230, 0.8)', borderRadius: '10px', border: '1.5px solid var(--border-medium)' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#3D1E06' }}>Currency & Region:</span>
                <select
                  value={currentCurrency}
                  onChange={(e) => {
                    onCurrencyChange?.(e.target.value);
                    playPopSound(soundEnabled);
                  }}
                  className="navbar-currency-select"
                  aria-label="Select currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
              {currentUser ? (
                <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #3D1E06', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="navbar-user-avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{currentUser.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{currentUser.workspaceName}</div>
                    </div>
                  </div>
                  {onSignOut && (
                    <button
                      type="button"
                      className="navbar-logout-btn"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onSignOut();
                      }}
                      title="Sign Out"
                    >
                      <LogOut size={14} />
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    className="navbar-auth-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth?.('login');
                    }}
                    style={{ justifyContent: 'center' }}
                  >
                    <LogIn size={14} />
                    <span>Sign In</span>
                  </button>
                  <button
                    type="button"
                    className="navbar-auth-btn signup"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth?.('signup');
                    }}
                    style={{ justifyContent: 'center' }}
                  >
                    <UserPlus size={14} />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
