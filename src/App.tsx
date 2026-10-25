import { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Navbar, type AuthUser } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { TaglineReveal } from './components/TaglineReveal';
import { ProblemSolution } from './components/ProblemSolution';
import { ScrollJourney } from './components/ScrollJourney';
import { PlanBuilder } from './components/PlanBuilder';
import { CategoryShowcase } from './components/CategoryShowcase';
import { SocialProof } from './components/SocialProof';
import { FAQSection } from './components/FAQSection';
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
                {/* HERO TITLE - STABLE ALIGNMENT WITHOUT JITTER OR BOTTOM CROPPING */}
                <h1 id="hero-title" className="hero-title">
                  The AI Event Planner That Turns
                  <br />
                  <span className="highlight-orange">Every Moment Into a Festival.</span>
                </h1>

                {/* CLEAN SUBTITLE WITHOUT EYEBROW OR PULL TAG BORDERS */}
                <p className="hero-description">
                  <strong>Festiya</strong> is the intelligent celebration workspace that transforms any event vision into an editable multi-tier budget (low, likely, high), prioritized milestone schedule, and vendor negotiation checklist in under 90 seconds.
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

              {/* 3D Plush Festiya Visual Stage Centerpiece (Featuring favicon.png) */}
              <div className="hero-visual-card">
                <div className="hero-plush-stage">
                  <div className="hero-plush-glow" aria-hidden="true" />

                  {/* 3D Plush Festiya Logo Centerpiece */}
                  <img
                    src="/festiya-logo.png"
                    alt="Festiya plush 3D celebratory wordmark"
                    className="hero-plush-logo-img"
                    onClick={() => playCelebrationSound(soundEnabled)}
                    title="Festiya: Turn every moment into a festival"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

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

        {/* Pricing Section */}
        <section id="pricing" className="plan-builder-section" style={{ background: 'var(--bg-canvas-subtle)', borderTop: '1.5px solid var(--border-subtle)' }} aria-labelledby="pricing-heading">
          <div className="content-wrapper">
            <div className="section-header">
              <h2 id="pricing-heading" className="section-title">
                Honest pricing for personal and agency celebrations
              </h2>
              <p className="section-subtitle">
                We gate scale and client collaboration workspaces, never access to your own saved event history.
                No recurring billing traps.
              </p>
            </div>

            <div className="pricing-grid">
              {/* Free Tier */}
              <div className="pricing-card">
                <span className="pricing-tier-pill">Free forever</span>
                <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', marginTop: '8px' }}>Individual host</h3>
                <div className="price-tag tabular-data">$0</div>
                <p style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
                  For individuals and families organizing birthdays, reunions, and intimate gatherings.
                </p>
                <ul className="price-features-list">
                  <li><CheckCircle2 size={16} color="var(--orange-500)" /> 3 active event plans</li>
                  <li><CheckCircle2 size={16} color="var(--orange-500)" /> Decimal safe budget tracking</li>
                  <li><CheckCircle2 size={16} color="var(--orange-500)" /> Scoped guest share links</li>
                </ul>
                <button type="button" className="btn btn-secondary" style={{ width: '100%' }} onClick={handleStartPlanning}>
                  Get started free
                </button>
              </div>

              {/* Plus Tier */}
              <div className="pricing-card featured">
                <span className="pricing-tier-pill sunshine">Most popular</span>
                <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', marginTop: '8px' }}>Festiya Plus</h3>
                <div className="price-tag tabular-data">$19<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/mo</span></div>
                <p style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
                  For frequent hosts, wedding organizers, and community leaders who need deep revisions.
                </p>
                <ul className="price-features-list">
                  <li><CheckCircle2 size={16} color="var(--orange-500)" /> Unlimited active events</li>
                  <li><CheckCircle2 size={16} color="var(--orange-500)" /> Timeline revisions on date change</li>
                  <li><CheckCircle2 size={16} color="var(--orange-500)" /> Clean PDF and Markdown export</li>
                </ul>
                <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={handleStartPlanning}>
                  Start 14 day trial
                </button>
              </div>

              {/* Planner Pro Tier */}
              <div className="pricing-card">
                <span className="pricing-tier-pill mint">For agencies</span>
                <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', marginTop: '8px' }}>Planner Pro</h3>
                <div className="price-tag tabular-data">$49<span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/mo</span></div>
                <p style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--text-secondary)' }}>
                  For independent planners managing client workspaces with custom branded proposals.
                </p>
                <ul className="price-features-list">
                  <li><CheckCircle2 size={16} color="var(--orange-500)" /> Branded client share views</li>
                  <li><CheckCircle2 size={16} color="var(--orange-500)" /> Reusable proposal templates</li>
                  <li><CheckCircle2 size={16} color="var(--orange-500)" /> Multi event activity ledger</li>
                </ul>
                <button type="button" className="btn btn-secondary" style={{ width: '100%' }} onClick={handleStartPlanning}>
                  Explore Planner Pro
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="final-cta-section" aria-label="Ready to plan your celebration">
          <div className="content-wrapper">
            <div className="final-cta-card">
              <h2 className="final-cta-title">Turn your celebration into an executable plan</h2>
              <p className="final-cta-subtitle">
                Join over 1,420 hosts who traded stressful spreadsheets for operational calm.
                Generate your first plan in under 90 seconds.
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
                <img src="/festiya-logo.png" alt="Festiya Logo" style={{ height: '24px', width: 'auto' }} />
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
                <li><a href="#pricing">Pricing and plans</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Event types</h5>
              <ul className="footer-links">
                <li><a href="#categories">Milestone birthdays</a></li>
                <li><a href="#categories">Weddings and receptions</a></li>
                <li><a href="#categories">Community carnivals</a></li>
                <li><a href="#pricing">Agency client proposals</a></li>
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
            <span>© {new Date().getFullYear()} Festiya. All rights reserved.</span>
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
