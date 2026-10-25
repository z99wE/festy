import { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Zap,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { LoadingScreen } from './components/LoadingScreen';
import { TaglineReveal } from './components/TaglineReveal';
import { ProblemSolution } from './components/ProblemSolution';
import { ScrollJourney } from './components/ScrollJourney';
import { PlanBuilder } from './components/PlanBuilder';
import { CategoryShowcase } from './components/CategoryShowcase';
import { SocialProof } from './components/SocialProof';
import { FAQSection } from './components/FAQSection';
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
  const [isLoading, setIsLoading] = useState(true);
  const [occasionIndex, setOccasionIndex] = useState(0);
  const [swapAnim, setSwapAnim] = useState(true);
  const [soundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Automatic Swapping Copy Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSwapAnim(false);
      setTimeout(() => {
        setOccasionIndex((prev) => (prev + 1) % OCCASION_SWAP_ITEMS.length);
        setSwapAnim(true);
      }, 250);
    }, 2800);
    return () => clearInterval(timer);
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

  const handleQuickOccasionSelect = (id: string, idx: number) => {
    setActiveOccasion(id);
    setOccasionIndex(idx);
    playCelebrationSound(soundEnabled);
  };

  return (
    <div className="app-container">
      {/* Dancing Mascot Loading Screen on initial visit */}
      {isLoading && (
        <LoadingScreen
          onComplete={() => setIsLoading(false)}
          reducedMotion={reducedMotion}
        />
      )}

      {/* Fluid Island Detached Header */}
      <Navbar onStartPlanning={handleStartPlanning} soundEnabled={soundEnabled} />

      {/* Main Content Landmark */}
      <main id="main-content">
        {/* HERO SECTION */}
        <section id="hero" className="hero-section" aria-labelledby="hero-title">
          <div className="content-wrapper">
            <div className="hero-grid">
              <div className="hero-content">
                {/* HIGH SEO / GEO / AEO OPTIMIZED H1 WITH SWAPPING OCCASION COPY */}
                <h1 id="hero-title" className="hero-title">
                  The AI Event Planner for{' '}
                  <span className="hero-swapping-wrapper">
                    <span className={`hero-swapping-word highlight-orange ${swapAnim ? 'swap-in' : 'swap-out'}`}>
                      {OCCASION_SWAP_ITEMS[occasionIndex].name}
                    </span>
                  </span>
                  <br />
                  Turn Every Moment Into a Festival.
                </h1>

                {/* HIGH AEO & GEO OPTIMIZED H2 */}
                <h2 className="hero-aeo-text">
                  <strong>Festiya</strong> is the intelligent celebration workspace that transforms any event vision into an editable multi-tier budget (low, likely, high), prioritized milestone schedule, and vendor negotiation checklist in under 90 seconds.
                </h2>

                {/* Fast-Selector Occasion Chips */}
                <div className="hero-occasion-chips" role="group" aria-label="Select celebration category">
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Quick Plan:
                  </span>
                  {OCCASION_SWAP_ITEMS.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`occasion-chip-btn ${activeOccasion === item.id ? 'active' : ''}`}
                      onClick={() => handleQuickOccasionSelect(item.id, idx)}
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
                  <CheckCircle2 size={16} color="var(--accent-mint-dark)" />
                  <span>
                    <strong>1,420+ celebrations</strong> planned with <strong>4.92 / 5</strong> satisfaction rate
                  </span>
                </div>
              </div>

              {/* 3D Plush Festiya Visual Stage Centerpiece (Featuring favicon.png) */}
              <div className="hero-visual-card">
                <div className="hero-plush-stage">
                  <div className="hero-plush-glow" aria-hidden="true" />

                  {/* Floating Stat Chip Top Left */}
                  <div className="floating-stat-badge badge-top-left">
                    <div className="stat-icon-wrap">
                      <Zap size={16} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '14px', display: 'block', color: 'var(--text-primary)' }}>
                        Under 90 seconds
                      </strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>To first usable plan</span>
                    </div>
                  </div>

                  {/* 3D Plush Festiya Logo Centerpiece */}
                  <img
                    src="/festiya-logo.png"
                    alt="Festiya plush 3D celebratory wordmark"
                    className="hero-plush-logo-img"
                    onClick={() => playCelebrationSound(soundEnabled)}
                    title="Festiya: Turn every moment into a festival"
                  />

                  {/* Floating Stat Chip Bottom Right */}
                  <div className="floating-stat-badge badge-bottom-right">
                    <div className="stat-icon-wrap" style={{ background: 'var(--accent-mint-light)', color: 'var(--accent-mint-dark)' }}>
                      <Heart size={16} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '14px', display: 'block', color: 'var(--text-primary)' }}>
                        Zero spreadsheet dread
                      </strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>100% Host in Control</span>
                    </div>
                  </div>
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
    </div>
  );
}

export default App;
