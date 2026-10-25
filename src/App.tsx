import { useState, useEffect } from 'react';
import {
  ArrowRight,
} from 'lucide-react';
import { Navbar, type AuthUser } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { VenueExperience3D } from './components/VenueExperience3D';
import { LiveInteractiveDemo } from './components/LiveInteractiveDemo';
import { TaglineReveal } from './components/TaglineReveal';
import { ProblemSolution } from './components/ProblemSolution';
import { ScrollJourney } from './components/ScrollJourney';
import { PlanBuilder } from './components/PlanBuilder';
import { CategoryShowcase } from './components/CategoryShowcase';
import { SocialProof } from './components/SocialProof';
import { FAQSection } from './components/FAQSection';
import { EventInsights } from './components/EventInsights';
import { FestiChatbot } from './components/FestiChatbot';
import { playCelebrationSound } from './utils/audio';

const OCCASION_SWAP_ITEMS = [
  { id: 'wedding', name: 'Dream Weddings', emoji: '💍' },
  { id: 'birthday', name: 'Milestone Birthdays', emoji: '🎂' },
  { id: 'work', name: 'Corporate Galas & Offsites', emoji: '🏢' },
  { id: 'community', name: 'Community Carnivals', emoji: '🎪' },
  { id: 'anniversary', name: 'Joyful Anniversaries', emoji: '🥂' },
  { id: 'shower', name: 'Baby & Bridal Showers', emoji: '🍼' },
];

export function App() {
  const [activeOccasion, setActiveOccasion] = useState('birthday');
  const [soundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // User authentication state (Cloudflare Edge tenant session)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  // Load user session from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('festiya_auth_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not load user session', e);
    }
  }, []);

  // Initialize prefers-reduced-motion from OS settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const handleStartPlanning = () => {
    const el = document.getElementById('interactive-planner');
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      playCelebrationSound(soundEnabled);
    }
  };

  const handleQuickOccasionSelect = (id: string) => {
    setActiveOccasion(id);
    playCelebrationSound(soundEnabled);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('festiya_auth_user');
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="app-container">
      {/* 3D Immersive Venue Atmosphere (Three.js Spatial Lighting & Floating Orbs) */}
      <VenueExperience3D reducedMotion={reducedMotion} />

      {/* Fluid Island Detached Header with Sign In / Sign Up */}
      <Navbar
        onStartPlanning={handleStartPlanning}
        soundEnabled={soundEnabled}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onSignOut={handleSignOut}
      />

      {/* Main Content Landmark */}
      <main id="main-content">
        {/* HERO SECTION */}
        <section id="hero" className="hero-section" aria-labelledby="hero-title">
          <div className="content-wrapper">
            <div className="hero-grid">
              <div className="hero-content">
                {/* HIGH-ROI H1 TITLE - FOCUSED ON FINANCIAL & TIME SAVINGS */}
                <h1 id="hero-title" className="hero-title">
                  The Autonomous Event Architect That
                  <br />
                  <span className="highlight-orange">Cuts Planning Time by 90% & Saves Thousands on Vendors.</span>
                </h1>

                {/* HIGH-CONVERTING VALUE SUBTITLE */}
                <p className="hero-description">
                  <strong>Festiya</strong> eliminates spreadsheet anxiety by generating an audit-ready 3-tier budget (low, likely, high), prioritized milestone schedule, and insider vendor negotiation scripts in under 90 seconds.
                </p>

                {/* Fast-Selector Occasion Chips */}
                <div className="hero-occasion-chips" role="group" aria-label="Select celebration category">
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Quick Plan:
                  </span>
                  {OCCASION_SWAP_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`occasion-chip-btn ${activeOccasion === item.id ? 'active' : ''}`}
                      onClick={() => handleQuickOccasionSelect(item.id)}
                    >
                      <span aria-hidden="true">{item.emoji}</span>
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>

                <div className="hero-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '10px 28px', fontSize: '16px' }}
                    onClick={handleStartPlanning}
                  >
                    <span>Build your event plan free</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>

                  <a
                    href="#how-it-works"
                    className="btn btn-secondary"
                    style={{ padding: '10px 22px', fontSize: '16px' }}
                  >
                    <span>How it works</span>
                  </a>
                </div>

                <div className="hero-proof-line">
                  <span>
                    <strong>1,420+ celebrations</strong> planned with <strong>4.92 / 5</strong> satisfaction rate
                  </span>
                </div>
              </div>

              {/* 3D Plush Festiya Visual Stage Centerpiece (Next-Gen AVIF & WebP) */}
              <div className="hero-visual-card">
                <div className="hero-plush-stage">
                  <div className="hero-plush-glow" aria-hidden="true" />

                  {/* 3D Plush Festiya Logo Centerpiece with modern AVIF/WebP */}
                  <picture>
                    <source srcSet="/festiya-hero.avif" type="image/avif" />
                    <source srcSet="/festiya-hero.webp" type="image/webp" />
                    <img
                      src="/festiya-hero.webp"
                      alt="Festiya plush 3D celebratory wordmark"
                      className="hero-plush-logo-img"
                      width={1024}
                      height={384}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      onClick={() => playCelebrationSound(soundEnabled)}
                      title="Festiya: Turn every moment into a festival"
                    />
                  </picture>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE AUTOMATED INTERACTIVE DEMO (Show Don't Tell - Senior Architect Feature) */}
        <LiveInteractiveDemo />

        {/* Tagline Reveal Section */}
        <TaglineReveal reducedMotion={reducedMotion} />

        {/* Problem vs Solution Section */}
        <ProblemSolution />

        {/* The 3-Step Journey */}
        <ScrollJourney />

        {/* Live Interactive Plan Builder */}
        <PlanBuilder
          activeOccasion={activeOccasion}
          onOccasionChange={(occ) => setActiveOccasion(occ)}
          soundEnabled={soundEnabled}
        />

        {/* Category Blueprint Showcase */}
        <CategoryShowcase
          onSelectCategory={(occ) => setActiveOccasion(occ)}
        />

        {/* Social Proof */}
        <SocialProof />

        {/* FAQ Section */}
        <FAQSection soundEnabled={soundEnabled} />

        {/* Event Intelligence & AEO Knowledge Hub (Replacing Payment/Pricing with Search & Answer Engine Optimized Content) */}
        <EventInsights
          onStartPlanning={handleStartPlanning}
          onExploreDemo={() => {
            const el = document.getElementById('interactive-demo');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Final CTA Section */}
        <section className="final-cta-section" aria-label="Ready to plan your celebration">
          <div className="content-wrapper">
            <div className="final-cta-card">
              <h2 className="final-cta-title">Launch Your Commercial-Grade Celebration Plan in Under 90 Seconds</h2>
              <p className="final-cta-subtitle">
                Join over 1,420 couples, hosts, and event producers who replaced chaotic spreadsheets with operational calm. Generate your complete 3-tier budget and milestone checklist free.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '8px 24px', fontSize: '16px' }}
                onClick={handleStartPlanning}
              >
                <span>Build your event plan</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer" role="contentinfo">
        <div className="content-wrapper">
          <div className="footer-grid">
            <div className="footer-brand-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/festiya-logo-nav.webp" alt="Festiya Logo" width={64} height={24} style={{ height: '24px', width: 'auto' }} />
                <span className="island-brand-text" style={{ fontSize: '16px' }}>Festiya</span>
              </div>
              <p>
                Turn every moment into a festival. Global event planning workspace built on Cloudflare.
              </p>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Cloudflare-first architecture • WCAG 2.2 compliant • Decimal-safe arithmetic
              </div>
            </div>

            <div className="footer-col">
              <h5>Product</h5>
              <ul className="footer-links">
                <li><a href="#how-it-works">The Journey</a></li>
                <li><a href="#interactive-planner">Live Planner</a></li>
                <li><a href="#categories">Event blueprints</a></li>
                <li><a href="#insights">Event Intelligence & AEO Guide</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Event types</h5>
              <ul className="footer-links">
                <li><a href="#categories">Milestone birthdays</a></li>
                <li><a href="#categories">Weddings and receptions</a></li>
                <li><a href="#categories">Community carnivals</a></li>
                <li><a href="#insights">3-Tier Budget Benchmarks</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Trust and privacy</h5>
              <ul className="footer-links">
                <li><a href="#main-content">Privacy policy</a></li>
                <li><a href="#main-content">Terms of service</a></li>
                <li><a href="#main-content">Accessibility statement</a></li>
                <li><a href="#main-content">Data export guarantee</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Festiya. All rights reserved.</span>
            <span>Turn every moment into a festival.</span>
          </div>
        </div>
      </footer>

      {/* Floating Animated Festi AI Copilot Assistant & Chatbot */}
      <FestiChatbot />

      {/* Cloudflare Edge Tenant Sign In / Sign Up Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
        }}
        initialMode={authMode}
      />
    </div>
  );
}

export default App;
