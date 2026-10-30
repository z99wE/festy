import React, { useState, useEffect } from 'react';

import { playPopSound } from '../utils/audio';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  workspaceName: string;
}

export type ActiveAppTab = 'home' | 'blueprints' | 'planner' | 'faq';

interface NavbarProps {
  onStartPlanning: () => void;
  soundEnabled: boolean;
  currentUser?: AuthUser | null;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onSignOut?: () => void;
  activeTab?: ActiveAppTab;
  onSelectTab?: (tab: ActiveAppTab) => void;
}

interface MobileAuthSectionProps {
  currentUser?: AuthUser | null;
  onSignOut?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onCloseMenu: () => void;
}

const MobileAuthSection: React.FC<MobileAuthSectionProps> = ({
  currentUser,
  onSignOut,
  onOpenAuth,
  onCloseMenu,
}) => {
  const handleSignOut = () => {
    onCloseMenu();
    if (onSignOut) onSignOut();
  };

  const handleLogin = () => {
    onCloseMenu();
    if (onOpenAuth) onOpenAuth('login');
  };

  const handleSignup = () => {
    onCloseMenu();
    if (onOpenAuth) onOpenAuth('signup');
  };

  if (currentUser) {
    return (
      <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            aria-label="Sign Out"
            title="Sign Out"
            className="navbar-logout-btn"
            onClick={handleSignOut}
          >
            <span>Sign Out</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      <button
        type="button"
        aria-label="Sign In"
        className="navbar-auth-btn"
        onClick={handleLogin}
        style={{ justifyContent: 'center' }}
      >
        <span>Sign In</span>
      </button>
      <button
        type="button"
        aria-label="Sign Up"
        className="navbar-auth-btn signup"
        onClick={handleSignup}
        style={{ justifyContent: 'center' }}
      >
        <span>Sign Up</span>
      </button>
    </div>
  );
};

export const Navbar: React.FC<NavbarProps> = ({
  onStartPlanning,
  soundEnabled,
  currentUser = null,
  onOpenAuth,
  onSignOut,
  activeTab = 'home',
  onSelectTab,
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
                alt="Festiya - Autonomous Celebration Architect & Event Planning Platform Logo"
                title="Festiya - Autonomous Celebration Architect"
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
              aria-label="Navigate to Home"
              className={`island-nav-link ${activeTab === 'home' ? 'active-tab' : ''}`}
              onClick={() => handleTabClick('home')}
            >
              Home
            </button>
            <button
              type="button"
              aria-label="Navigate to Blueprints"
              className={`island-nav-link ${activeTab === 'blueprints' ? 'active-tab' : ''}`}
              onClick={() => handleTabClick('blueprints')}
            >
              Blueprints
            </button>
            <button
              type="button"
              aria-label="Navigate to Planner"
              className={`island-nav-link ${activeTab === 'planner' ? 'active-tab' : ''}`}
              onClick={() => handleTabClick('planner')}
            >
              Planner
            </button>
            <button
              type="button"
              aria-label="Navigate to FAQ"
              className={`island-nav-link ${activeTab === 'faq' ? 'active-tab' : ''}`}
              onClick={() => handleTabClick('faq')}
            >
              FAQ
            </button>
          </div>

          {/* Action Button & Auth */}
          <div className="island-action-group">
            {currentUser ? (
              <div className="navbar-user-chip" title={`${currentUser.name} (${currentUser.workspaceName})`}>
                <div className="navbar-user-avatar">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="navbar-user-name">{currentUser.name}</span>
                {onSignOut && (
                  <button
                    type="button"
                    aria-label="Sign out"
                    title="Sign Out"
                    className="navbar-logout-btn"
                    onClick={onSignOut}
                  >
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  aria-label="Sign in to your account"
                  className="navbar-auth-btn"
                  onClick={() => onOpenAuth?.('login')}
                >
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  aria-label="Create your account"
                  className="navbar-auth-btn signup"
                  onClick={() => onOpenAuth?.('signup')}
                >
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            <button
              type="button"
              aria-label="Build your event plan"
              className="btn btn-primary island-cta-btn"
              onClick={() => {
                handleTabClick('planner');
                onStartPlanning();
              }}
            >
              <span>Build plan</span>
            </button>

            {/* Mobile Hamburger Morph Button */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className={`hamburger-morph-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={toggleMobileMenu}
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
                aria-label="Navigate to Home 3D Experience"
                className={`mobile-nav-item item-delay-1 ${activeTab === 'home' ? 'active-tab' : ''}`}
                onClick={() => handleTabClick('home')}
              >
                Home 3D Experience
              </button>
              <button
                type="button"
                aria-label="Navigate to Blueprints"
                className={`mobile-nav-item item-delay-2 ${activeTab === 'blueprints' ? 'active-tab' : ''}`}
                onClick={() => handleTabClick('blueprints')}
              >
                Blueprints
              </button>
              <button
                type="button"
                aria-label="Navigate to Planner"
                className={`mobile-nav-item item-delay-3 ${activeTab === 'planner' ? 'active-tab' : ''}`}
                onClick={() => handleTabClick('planner')}
              >
                Planner
              </button>
              <button
                type="button"
                aria-label="Navigate to FAQ & Support"
                className={`mobile-nav-item item-delay-4 ${activeTab === 'faq' ? 'active-tab' : ''}`}
                onClick={() => handleTabClick('faq')}
              >
                FAQ & Support
              </button>
            </div>

            <div style={{ marginTop: '24px', width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <MobileAuthSection
                currentUser={currentUser}
                onSignOut={onSignOut}
                onOpenAuth={onOpenAuth}
                onCloseMenu={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
