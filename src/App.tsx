import { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar, type AuthUser, type ActiveAppTab } from './components/Navbar';
import { VenueExperience3D } from './components/VenueExperience3D';
import { TaglineReveal } from './components/TaglineReveal';
import { detectUserRegion } from './utils/currency';
import { playCelebrationSound } from './utils/audio';
import { type EventPlanningContext } from './data/globalCelebrations';

const OrbitableHeroLogo = lazy(() => import('./components/OrbitableHeroLogo').then((m) => ({ default: m.OrbitableHeroLogo })));
const ProblemSolution = lazy(() => import('./components/ProblemSolution').then((m) => ({ default: m.ProblemSolution })));
const AuthModal = lazy(() => import('./components/AuthModal').then((m) => ({ default: m.AuthModal })));
const LiveInteractiveDemo = lazy(() => import('./components/LiveInteractiveDemo').then((m) => ({ default: m.LiveInteractiveDemo })));
const DiscoBallCelebrationHub = lazy(() => import('./components/DiscoBallCelebrationHub').then((m) => ({ default: m.DiscoBallCelebrationHub })));
const CategoryShowcase = lazy(() => import('./components/CategoryShowcase').then((m) => ({ default: m.CategoryShowcase })));
const PlanBuilder = lazy(() => import('./components/PlanBuilder').then((m) => ({ default: m.PlanBuilder })));
const FAQSection = lazy(() => import('./components/FAQSection').then((m) => ({ default: m.FAQSection })));
const GlobalFestivalFooterShowcase = lazy(() => import('./components/GlobalFestivalFooterShowcase').then((m) => ({ default: m.GlobalFestivalFooterShowcase })));
const PeekingMascot = lazy(() => import('./components/PeekingMascot').then((m) => ({ default: m.PeekingMascot })));
const FestiChatbot = lazy(() => import('./components/FestiChatbot').then((m) => ({ default: m.FestiChatbot })));

const OCCASION_SWAP_ITEMS = [
  { id: 'wedding', name: 'Luxury Weddings' },
  { id: 'birthday', name: 'Milestone Birthdays' },
  { id: 'festival', name: 'Music Festivals' },
  { id: 'product_launch', name: 'Product Launches' },
  { id: 'retreat', name: 'Executive Retreats' },
  { id: 'anniversary', name: 'Galas & Anniversaries' },
  { id: 'wine_tasting', name: 'Private Tastings' },
  { id: 'cultural_fest', name: 'Heritage Festivals' },
];

export function App() {
  const [activeOccasion, setActiveOccasion] = useState('birthday');
  const [selectedPlanningContext, setSelectedPlanningContext] = useState<EventPlanningContext | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveAppTab>('home');
  const [soundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

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
      {/* 3D Immersive Venue Atmosphere (Particle-free per user request) */}
      <VenueExperience3D reducedMotion={reducedMotion} />

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
                <div className="hero-grid">
                  <div className="hero-content">
                    {/* HIGH-ROI H1 TITLE */}
                    <h1 id="hero-title" className="hero-title">
                      <span className="hero-headline-lead">The Autonomous Event Architect That</span>
                      <br />
                      <span className="highlight-orange">Cuts Planning Time by 90% & Saves Thousands on Vendors.</span>
                    </h1>

                    {/* HIGH-CONVERTING VALUE SUBTITLE */}
                    <p className="hero-description">
                      <strong>Festiya</strong> eliminates spreadsheet anxiety by generating an audit-ready 3-tier budget (low, likely, high), prioritized milestone schedule, and insider vendor negotiation scripts in under 90 seconds.
                    </p>

                    {/* Fast-Selector Occasion Chips */}
                    <div className="hero-occasion-chips" role="group" aria-label="Select celebration category">
                      {OCCASION_SWAP_ITEMS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`occasion-chip-btn ${activeOccasion === item.id ? 'active' : ''}`}
                          onClick={() => handleQuickOccasionSelect(item.id)}
                        >
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
                        <span>Build your event plan</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '10px 22px', fontSize: '16px' }}
                        onClick={() => {
                          setActiveTab('blueprints');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <span>Explore Blueprints</span>
                      </button>
                    </div>
                  </div>

                  {/* 3D Orbitable Hero Logo (Pristine, 360 degree drag rotation, zero layout shift) */}
                  <div className="hero-tactile-centerpiece">
                    <Suspense
                      fallback={
                        <div
                          className="orbitable-hero-wrapper"
                          style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '850px',
                            height: '520px',
                            aspectRatio: '850 / 520',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            contain: 'layout size',
                          }}
                        >
                          <img
                            src="/festiya-logo.webp"
                            alt="Festiya 3D Plush Mascot Logo"
                            width={850}
                            height={520}
                            fetchPriority="high"
                            style={{
                              width: '100%',
                              height: '100%',
                              maxHeight: '520px',
                              objectFit: 'contain',
                              display: 'block',
                            }}
                          />
                        </div>
                      }
                    >
                      <OrbitableHeroLogo reducedMotion={reducedMotion} soundEnabled={soundEnabled} />
                    </Suspense>
                  </div>
                </div>

                {/* 3D DISCO BALL: UPCOMING WORLD CELEBRATIONS & LONG WEEKENDS */}
                <div style={{ marginTop: '36px', marginBottom: '40px' }}>
                  <Suspense fallback={<div style={{ minHeight: '380px' }} />}>
                    <DiscoBallCelebrationHub
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
            <Suspense fallback={null}>
              <LiveInteractiveDemo />
            </Suspense>

            {/* Tagline Reveal Section */}
            <TaglineReveal reducedMotion={reducedMotion} />

            {/* Problem vs Solution Section */}
            <Suspense fallback={null}>
              <ProblemSolution />
            </Suspense>
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
      <Suspense fallback={null}>
        <GlobalFestivalFooterShowcase
          onSelectFestival={(occ) => {
            setActiveOccasion(occ);
            setActiveTab('planner');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </Suspense>

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
      <Suspense fallback={null}>
        <FestiChatbot />
      </Suspense>

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
