import { useState, useEffect, lazy, Suspense } from 'react';
import { Sparkles, Cake, Music, Compass, Building, Crown, Wine, Globe } from 'lucide-react';
import { Navbar, type AuthUser, type ActiveAppTab } from './components/Navbar';
import { TaglineReveal } from './components/TaglineReveal';
import { detectUserRegion } from './utils/currency';
import { playCelebrationSound } from './utils/audio';
import { type EventPlanningContext } from './data/globalCelebrations';
import { LazyMount } from './components/LazyMount';

const OrbitableHeroLogo = lazy(() => import('./components/OrbitableHeroLogo').then((m) => ({ default: m.OrbitableHeroLogo })));
const ProblemSolution = lazy(() => import('./components/ProblemSolution').then((m) => ({ default: m.ProblemSolution })));
const AuthModal = lazy(() => import('./components/AuthModal').then((m) => ({ default: m.AuthModal })));
const LiveInteractiveDemo = lazy(() => import('./components/LiveInteractiveDemo').then((m) => ({ default: m.LiveInteractiveDemo })));
const CelebrationWorldMap = lazy(() => import('./components/CelebrationWorldMap').then((m) => ({ default: m.CelebrationWorldMap })));
const CategoryShowcase = lazy(() => import('./components/CategoryShowcase').then((m) => ({ default: m.CategoryShowcase })));
const PlanBuilder = lazy(() => import('./components/PlanBuilder').then((m) => ({ default: m.PlanBuilder })));
const FAQSection = lazy(() => import('./components/FAQSection').then((m) => ({ default: m.FAQSection })));
const GlobalFestivalFooterShowcase = lazy(() => import('./components/GlobalFestivalFooterShowcase').then((m) => ({ default: m.GlobalFestivalFooterShowcase })));
const PeekingMascot = lazy(() => import('./components/PeekingMascot').then((m) => ({ default: m.PeekingMascot })));
const FestiChatbot = lazy(() => import('./components/FestiChatbot').then((m) => ({ default: m.FestiChatbot })));

const OCCASION_SWAP_ITEMS = [
  { id: 'wedding', name: 'Luxury Weddings', icon: Sparkles },
  { id: 'birthday', name: 'Milestone Birthdays', icon: Cake },
  { id: 'festival', name: 'Music Festivals', icon: Music },
  { id: 'product_launch', name: 'Product Launches', icon: Compass },
  { id: 'retreat', name: 'Executive Retreats', icon: Building },
  { id: 'anniversary', name: 'Galas & Anniversaries', icon: Crown },
  { id: 'wine_tasting', name: 'Private Tastings', icon: Wine },
  { id: 'cultural_fest', name: 'Heritage Festivals', icon: Globe },
];

export function App() {
  const [activeOccasion, setActiveOccasion] = useState('birthday');
  const [selectedPlanningContext, setSelectedPlanningContext] = useState<EventPlanningContext | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveAppTab>('home');
  const [soundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 768 : true;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Regional currency state
  const [currentCurrency, setCurrentCurrency] = useState<string>(() => {
    return detectUserRegion().currencyCode || 'USD';
  });

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
    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    playCelebrationSound(soundEnabled);
  };

  const handleQuickOccasionSelect = (id: string) => {
    setActiveOccasion(id);
    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
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
      {/* Fluid Island Detached Header with Navigation Tabs, Currency/Region Selector & Auth */}
      <Navbar
        onStartPlanning={handleStartPlanning}
        soundEnabled={soundEnabled}
        currentUser={currentUser}
        activeTab={activeTab}
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        }}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onSignOut={handleSignOut}
      />

      {/* Main Content Landmark */}
      <main id="main-content">
        {/* ==========================================================
            VIEW 1: HOME EXPERIENCE (HERO + INTERACTIVE 3D VENUE STAGE)
            ========================================================== */}
        {activeTab === 'home' && (
          <>
            {/* HERO SECTION */}
            <section id="hero" className="hero-section" aria-labelledby="hero-title">
              <div className="content-wrapper">
                <div className="hero-masthead-flow">
                  {/* 1. TOP MASTHEAD: 3D Orbitable Hero Logo (Pristine tactile 360 rotation on desktop, instant preloaded WebP on mobile) */}
                  <div className="hero-masthead-centerpiece" aria-label="Festiya Interactive 3D Mascot Logo">
                    {isDesktop ? (
                      <Suspense
                        fallback={
                          <div
                            className="orbitable-hero-wrapper"
                            style={{
                              position: 'relative',
                              width: '100%',
                              maxWidth: '640px',
                              aspectRatio: '639 / 240',
                              margin: '0 auto',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <img
                              src="/festiya-logo.webp"
                              alt="Festiya 3D Plush Mascot Logo"
                              width={639}
                              height={240}
                              fetchPriority="high"
                              className="festiya-masthead-img"
                            />
                          </div>
                        }
                      >
                        <OrbitableHeroLogo reducedMotion={reducedMotion} soundEnabled={soundEnabled} />
                      </Suspense>
                    ) : (
                      <div
                        className="orbitable-hero-wrapper"
                        style={{
                          position: 'relative',
                          width: '100%',
                          maxWidth: '640px',
                          aspectRatio: '639 / 240',
                          margin: '0 auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <img
                          src="/festiya-logo.webp"
                          alt="Festiya Plush Mascot Logo"
                          width={639}
                          height={240}
                          fetchPriority="high"
                          className="festiya-masthead-img"
                        />
                      </div>
                    )}
                  </div>

                  {/* 2. FLOWING EDITORIAL H1 */}
                  <h1 id="hero-title" className="hero-title">
                    <span className="hero-headline-lead">Plan Extraordinary Celebrations</span>
                    <br />
                    <span className="highlight-orange">Without the Stress, Spreadsheets, or Overcharging.</span>
                  </h1>

                  {/* 3. CLASSY H2 SUBTITLE */}
                  <h2 className="hero-subtitle">
                    Audit-ready 3-tier budgets, milestone itineraries, and insider vendor negotiation scripts — generated in under 90 seconds.
                  </h2>

                  {/* 4. FLOWING EDITORIAL BODY COPY */}
                  <p className="hero-description">
                    From intimate terrace dinners to 500-guest heritage weddings and corporate galas, <strong>Festiya</strong> replaces planning anxiety with real-time financial certainty, bespoke cost curves, and contract safeguards tailored to your city.
                  </p>

                  {/* 5. SYMMETRICAL OCCASION SELECTOR GRID (4x2 on Desktop, 2x4 on Mobile) */}
                  <div className="hero-occasion-grid" role="group" aria-label="Select celebration category">
                    {OCCASION_SWAP_ITEMS.map((item) => {
                      const IconComp = item.icon;
                      const isActive = activeOccasion === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`occasion-grid-btn ${isActive ? 'active' : ''}`}
                          onClick={() => handleQuickOccasionSelect(item.id)}
                          aria-pressed={isActive}
                        >
                          <IconComp size={16} className="occasion-grid-icon" aria-hidden="true" />
                          <span className="occasion-grid-label">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 6. CLASSY HERO ACTIONS */}
                  <div className="hero-actions">
                    <button
                      type="button"
                      className="btn btn-primary hero-btn-primary"
                      onClick={handleStartPlanning}
                    >
                      <span>Build your event plan</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary hero-btn-secondary"
                      onClick={() => {
                        setActiveTab('blueprints');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <span>Explore Blueprints</span>
                    </button>
                  </div>

                  {/* 7. TRUST PROOF LINE */}
                  <div className="hero-proof-line">
                    <div className="proof-pill">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>100% Free &amp; Open-Access</span>
                    </div>
                    <span className="proof-dot" aria-hidden="true">•</span>
                    <div className="proof-pill">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B42F3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                      <span>Decimal-Accurate Budgeting</span>
                    </div>
                    <span className="proof-dot" aria-hidden="true">•</span>
                    <div className="proof-pill">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <span>Client-Side Private</span>
                    </div>
                  </div>
                </div>

                {/* CELEBRATION WORLD MAP & 3D GLOBE HUB (Joyful celebratory world, zero confetti) */}
                <div style={{ marginTop: '36px', marginBottom: '40px' }}>
                  <LazyMount placeholderHeight="420px" rootMargin="350px">
                    <Suspense fallback={<div style={{ minHeight: '380px' }} />}>
                      <CelebrationWorldMap
                        reducedMotion={reducedMotion}
                        currentCurrency={currentCurrency}
                        onSelectEventForPlanner={(occasionId, eventName, context) => {
                          setActiveOccasion(occasionId);
                          if (context) {
                            setSelectedPlanningContext(context);
                          } else {
                            setSelectedPlanningContext({
                              id: occasionId,
                              name: eventName,
                              category: occasionId,
                              location: 'Worldwide',
                              dates: 'Upcoming 6 Months',
                            });
                          }
                          setActiveTab('planner');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    </Suspense>
                  </LazyMount>
                </div>

                {/* APP NAVIGATION GATEWAY CARDS (Dividing the app into distinct parts) */}
                <div style={{ marginTop: '10px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '26px', fontWeight: 850, color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>
                      Explore Different Parts of Festiya
                    </h2>
                  </div>

                  <div className="home-gateways-grid">
                    <div
                      className="home-gateway-card"
                      onClick={() => {
                        setActiveTab('blueprints');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      role="button"
                      tabIndex={0}
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
                      onClick={() => {
                        setActiveTab('planner');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      role="button"
                      tabIndex={0}
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
                      onClick={() => {
                        setActiveTab('faq');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div>
                        <h3 className="gateway-card-title">FAQ & Support</h3>
                        <p className="gateway-card-desc">
                          Answers to licensing, vendor pricing guarantees, data security on Cloudflare, and export formats.
                        </p>
                      </div>
                      <div className="gateway-card-link">
                        <span>View FAQ Hub</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* LIVE AUTOMATED INTERACTIVE DEMO */}
            <LazyMount placeholderHeight="320px" rootMargin="300px">
              <Suspense fallback={null}>
                <LiveInteractiveDemo />
              </Suspense>
            </LazyMount>

            {/* Tagline Reveal Section */}
            <TaglineReveal reducedMotion={reducedMotion} />

            {/* Problem vs Solution Section */}
            <LazyMount placeholderHeight="360px" rootMargin="300px">
              <Suspense fallback={null}>
                <ProblemSolution />
              </Suspense>
            </LazyMount>
          </>
        )}

        {/* ==========================================================
            VIEW 2: DEDICATED 12 EVENT BLUEPRINTS
            ========================================================== */}
        {activeTab === 'blueprints' && (
          <div style={{ paddingTop: '80px', minHeight: '80vh' }}>
            <Suspense fallback={null}>
              <CategoryShowcase
                onSelectCategory={(occ) => {
                  setActiveOccasion(occ);
                  setActiveTab('planner');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToPlanner={() => {
                  setActiveTab('planner');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </Suspense>
          </div>
        )}

        {/* ==========================================================
            VIEW 3: DEDICATED PLANNER WORKSPACE
            ========================================================== */}
        {activeTab === 'planner' && (
          <div style={{ paddingTop: '80px', minHeight: '80vh' }}>
            <Suspense fallback={null}>
              <PlanBuilder
                activeOccasion={activeOccasion}
                onOccasionChange={(occ) => {
                  setActiveOccasion(occ);
                  setSelectedPlanningContext(null);
                }}
                soundEnabled={soundEnabled}
                planningContext={selectedPlanningContext}
                onClearPlanningContext={() => setSelectedPlanningContext(null)}
              />
            </Suspense>
          </div>
        )}

        {/* ==========================================================
            VIEW 4: DEDICATED FAQ & SUPPORT HUB
            ========================================================== */}
        {activeTab === 'faq' && (
          <div style={{ paddingTop: '80px', minHeight: '80vh' }}>
            <Suspense fallback={null}>
              <FAQSection soundEnabled={soundEnabled} />
            </Suspense>
          </div>
        )}

        {/* Final CTA Section (on all views for conversion continuity) */}
        <section className="final-cta-section" aria-label="Ready to plan your celebration">
          <div className="content-wrapper">
            <div className="final-cta-card">
              <h2 className="final-cta-title">Launch Your Commercial-Grade Celebration Plan in Under 90 Seconds</h2>
              <p className="final-cta-subtitle">
                Join couples, hosts, and event producers who replaced chaotic spreadsheets with operational calm. Generate your complete 3-tier budget and milestone checklist in under 90 seconds.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '10px 28px', fontSize: '16px' }}
                onClick={handleStartPlanning}
              >
                <span>Build your event plan</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Global Celebrations 3D Parallax & Perspective Footer Showcase */}
      <LazyMount placeholderHeight="420px" rootMargin="300px">
        <Suspense fallback={null}>
          <GlobalFestivalFooterShowcase
            onSelectFestival={(occ) => {
              setActiveOccasion(occ);
              setActiveTab('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </Suspense>
      </LazyMount>

      {/* FOOTER */}
      <footer className="site-footer" role="contentinfo">
        <div className="content-wrapper">
          <div className="footer-grid">
            <div className="footer-brand-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/festiya-logo-nav.webp" alt="Festiya Logo" width={64} height={24} style={{ height: '24px', width: 'auto' }} />
                <span className="island-brand-text" style={{ fontSize: '16px' }}>Festiya</span>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Turn every moment into a festival. Global event planning workspace built on Cloudflare.
              </p>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500 }}>
                Cloudflare-first architecture • WCAG 2.2 compliant • Zero pure black • Rich chocolate roast contrast
              </div>
            </div>

            <div className="footer-col">
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>App Sections</h3>
              <ul className="footer-links">
                <li>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    Home
                  </button>
                </li>
                <li>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => { setActiveTab('blueprints'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    Blueprints
                  </button>
                </li>
                <li>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => { setActiveTab('planner'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    Planner
                  </button>
                </li>
                <li>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => { setActiveTab('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    FAQ & Support
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>Event types</h3>
              <ul className="footer-links">
                <li>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => { setActiveOccasion('wedding'); setActiveTab('planner'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    Weddings and Receptions
                  </button>
                </li>
                <li>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => { setActiveOccasion('birthday'); setActiveTab('planner'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    Milestone Birthdays
                  </button>
                </li>
                <li>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => { setActiveOccasion('festival'); setActiveTab('planner'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    Music Festivals & Carnivals
                  </button>
                </li>
                <li>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => { setActiveOccasion('product_launch'); setActiveTab('planner'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    Tech Product Launches
                  </button>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>Trust & Quality</h3>
              <ul className="footer-links">
                <li>• Decimal-safe accounting</li>
                <li>• Zero dark patterns</li>
                <li>• Cloudflare Edge Tenant</li>
                <li>• Export to CSV & PDF</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
            <span>© 2026 Festiya. All rights reserved.</span>
            <span>Turn every moment into a festival.</span>
          </div>
        </div>
      </footer>

      {/* Playful 3D Alive Peeking Mascot (randomized, max 3 per session, side & upside-down peek) */}
      <Suspense fallback={null}>
        <PeekingMascot />
      </Suspense>

      {/* Floating Animated Festi AI Mascot & Chatbot */}
      <LazyMount placeholderHeight={0} idleDelayMs={3000}>
        <Suspense fallback={null}>
          <FestiChatbot />
        </Suspense>
      </LazyMount>

      {/* Cloudflare Edge Tenant Sign In / Sign Up Modal */}
      <Suspense fallback={null}>
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
          }}
          initialMode={authMode}
        />
      </Suspense>
    </div>
  );
}

export default App;
