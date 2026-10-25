import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { playPopSound } from '../utils/audio';

interface NavbarProps {
  onStartPlanning: () => void;
  soundEnabled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartPlanning, soundEnabled }) => {
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

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    playPopSound(soundEnabled);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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
              handleNavClick('hero');
            }}
          >
            <div className="island-brand-icon" style={{ overflow: 'visible', background: 'transparent', width: 'auto', height: 'auto' }}>
              <img src="/festiya-logo.png" alt="Festiya 3D Brand Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(255, 94, 30, 0.35))' }} />
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="island-links">
            <button
              type="button"
              className="island-nav-link"
              onClick={() => handleNavClick('how-it-works')}
            >
              The Journey
            </button>
            <button
              type="button"
              className="island-nav-link"
              onClick={() => handleNavClick('interactive-planner')}
            >
              Live Planner
            </button>
            <button
              type="button"
              className="island-nav-link"
              onClick={() => handleNavClick('categories')}
            >
              Categories
            </button>
            <button
              type="button"
              className="island-nav-link"
              onClick={() => handleNavClick('pricing')}
            >
              Pricing
            </button>
            <button
              type="button"
              className="island-nav-link"
              onClick={() => handleNavClick('faq')}
            >
              FAQ
            </button>
          </div>

          {/* Action Button */}
          <div className="island-action-group">
            <button
              type="button"
              className="btn btn-primary island-cta-btn"
              onClick={onStartPlanning}
              aria-label="Build your event plan"
            >
              <span>Build your plan</span>
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
                className="mobile-nav-item item-delay-1"
                onClick={() => handleNavClick('how-it-works')}
              >
                The Journey
              </button>
              <button
                type="button"
                className="mobile-nav-item item-delay-2"
                onClick={() => handleNavClick('interactive-planner')}
              >
                Live Planner
              </button>
              <button
                type="button"
                className="mobile-nav-item item-delay-3"
                onClick={() => handleNavClick('categories')}
              >
                Event Categories
              </button>
              <button
                type="button"
                className="mobile-nav-item item-delay-5"
                onClick={() => handleNavClick('pricing')}
              >
                Pricing & Plans
              </button>
              <button
                type="button"
                className="mobile-nav-item item-delay-6"
                onClick={() => handleNavClick('faq')}
              >
                FAQ
              </button>
            </div>

            <div style={{ marginTop: '32px', width: '100%', maxWidth: '320px' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px 24px', fontSize: '1rem' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartPlanning();
                }}
              >
                <Sparkles size={16} />
                Build your event plan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
