import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Calculator,
  BookOpen,
  HelpCircle,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { Navbar, type AuthUser, type ActiveAppTab } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { VenueExperience3D } from './components/VenueExperience3D';
import { HomeVenueStage3D } from './components/HomeVenueStage3D';
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
  { id: 'festival', name: 'Music Festivals', emoji: '🎪' },
  { id: 'product_launch', name: 'Tech Product Launches', emoji: '🚀' },
  { id: 'retreat', name: 'Executive Retreats', emoji: '🏢' },
  { id: 'anniversary', name: 'Joyful Anniversaries', emoji: '🥂' },
  { id: 'wine_tasting', name: 'Wine Tastings', emoji: '🍷' },
  { id: 'cultural_fest', name: 'Heritage Festivals', emoji: '✨' },
];

export function App() {
  const [activeOccasion, setActiveOccasion] = useState('birthday');
  const [activeTab, setActiveTab] = useState<ActiveAppTab>('home');
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

      {/* Fluid Island Detached Header with Navigation Tabs & Sign In / Sign Up */}
      <Navbar
        onStartPlanning={handleStartPlanning}
        soundEnabled={soundEnabled}
        currentUser={currentUser}
        activeTab={activeTab}
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
                        Instant Launch:
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

                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '10px 22px', fontSize: '16px' }}
                        onClick={() => {
                          setActiveTab('blueprints');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <Layers size={16} style={{ marginRight: '6px' }} />
                        <span>Explore 12 Blueprints</span>
                      </button>
                    </div>

                    <div className="hero-proof-line">
                      <span>
                        <strong>1,420+ celebrations</strong> planned with <strong>4.92 / 5</strong> satisfaction rate
                      </span>
                    </div>
                  </div>

                  {/* 3D Plush Festiya Visual Stage Centerpiece */}
                  <div className="hero-visual-card">
                    <div className="hero-plush-stage">
                      <div className="hero-plush-glow" aria-hidden="true" />
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

                {/* 3D CELEBRATION STAGE & VENUE EXPERIENCE */}
                <div style={{ marginTop: '20px' }}>
                  <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 20px' }}>
                    <div className="hero-badge" style={{ margin: '0 auto 12px', display: 'inline-flex' }}>
                      <Sparkles size={14} style={{ marginRight: '6px' }} />
                      <span>WebGL 3D Spatial Venue Experience</span>
                    </div>
                    <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      Interactive 3D Celebration Pavilion & Zone Architect
                    </h2>
                    <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)' }}>
                      Drag to rotate the 3D pavilion 360°. Inspect key celebration zones, acoustical coverage, and pre-calibrated budget allocations.
                    </p>
                  </div>

                  <HomeVenueStage3D
                    reducedMotion={reducedMotion}
                    onLaunchZonePlan={(_zoneId) => {
                      setActiveTab('planner');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>

                {/* APP NAVIGATION GATEWAY CARDS (Dividing the app into distinct parts) */}
                <div style={{ marginTop: '10px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#BD3700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Commercial Event Architecture Hub
                    </span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                      Explore Different Parts of Festiya
                    </h3>
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
                        <div className="gateway-icon-wrap">
                          <Layers size={22} />
                        </div>
                        <h4 className="gateway-card-title">12 Event Blueprints</h4>
                        <p className="gateway-card-desc">
                          WebGL 3D carousel covering weddings, milestone birthdays, music festivals, tech launches, and cultural galas.
                        </p>
                      </div>
                      <div className="gateway-card-link">
                        <span>Browse 12 Blueprints</span>
                        <ArrowRight size={15} />
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
                        <div className="gateway-icon-wrap" style={{ background: '#FFE4D0', color: '#E64909' }}>
                          <Calculator size={22} />
                        </div>
                        <h4 className="gateway-card-title">Live Event Planner</h4>
                        <p className="gateway-card-desc">
                          Dedicated 3-tier budget synthesizer (low, likely, high) and day-of chronological checklist engine.
                        </p>
                      </div>
                      <div className="gateway-card-link">
                        <span>Launch Live Planner</span>
                        <ArrowRight size={15} />
                      </div>
                    </div>

                    <div
                      className="home-gateway-card"
                      onClick={() => {
                        setActiveTab('insights');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div>
                        <div className="gateway-icon-wrap" style={{ background: '#D8FBF0', color: '#059669' }}>
                          <BookOpen size={22} />
                        </div>
                        <h4 className="gateway-card-title">Event Insights & AEO</h4>
                        <p className="gateway-card-desc">
                          Vendor contract negotiation playbooks, regional budget benchmarks, and answer-engine-optimized strategies.
                        </p>
                      </div>
                      <div className="gateway-card-link">
                        <span>Read Vendor Playbooks</span>
                        <ArrowRight size={15} />
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
                        <div className="gateway-icon-wrap" style={{ background: '#FFE3E8', color: '#FF4D6D' }}>
                          <HelpCircle size={22} />
                        </div>
                        <h4 className="gateway-card-title">FAQ & Support</h4>
                        <p className="gateway-card-desc">
                          Answers to licensing, vendor pricing guarantees, data security on Cloudflare, and export formats.
                        </p>
                      </div>
                      <div className="gateway-card-link">
                        <span>View FAQ Hub</span>
                        <ArrowRight size={15} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* LIVE AUTOMATED INTERACTIVE DEMO */}
            <LiveInteractiveDemo />

            {/* Tagline Reveal Section */}
            <TaglineReveal reducedMotion={reducedMotion} />

            {/* Problem vs Solution Section */}
            <ProblemSolution />

            {/* The 3-Step Journey */}
            <ScrollJourney />

            {/* Social Proof */}
            <SocialProof />
          </>
        )}

        {/* ==========================================================
            VIEW 2: DEDICATED 12 EVENT BLUEPRINTS (WEBGL 3D CAROUSEL)
            ========================================================== */}
        {activeTab === 'blueprints' && (
          <div style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <div className="content-wrapper">
              <div className="section-switch-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="#FF5E1E" />
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Viewing Section: <strong>12 Celebration Blueprints & 3D WebGL Showcase</strong>
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '13px' }}
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <Home size={14} style={{ marginRight: '4px' }} />
                  <span>Return to Home</span>
                </button>
              </div>
            </div>

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
          </div>
        )}

        {/* ==========================================================
            VIEW 3: DEDICATED LIVE EVENT PLANNER WORKSPACE
            ========================================================== */}
        {activeTab === 'planner' && (
          <div style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <div className="content-wrapper">
              <div className="section-switch-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calculator size={18} color="#FF5E1E" />
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Viewing Section: <strong>Live Event Planner & 3-Tier Budget Synthesizer</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '13px' }}
                    onClick={() => {
                      setActiveTab('blueprints');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <Layers size={14} style={{ marginRight: '4px' }} />
                    <span>Change Blueprint</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '13px' }}
                    onClick={() => {
                      setActiveTab('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <Home size={14} style={{ marginRight: '4px' }} />
                    <span>Home</span>
                  </button>
                </div>
              </div>
            </div>

            <PlanBuilder
              activeOccasion={activeOccasion}
              onOccasionChange={(occ) => setActiveOccasion(occ)}
              soundEnabled={soundEnabled}
            />
          </div>
        )}

        {/* ==========================================================
            VIEW 4: DEDICATED EVENT INSIGHTS & AEO KNOWLEDGE HUB
            ========================================================== */}
        {activeTab === 'insights' && (
          <div style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <div className="content-wrapper">
              <div className="section-switch-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={18} color="#059669" />
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Viewing Section: <strong>Event Intelligence & Vendor Negotiation Knowledge Hub</strong>
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '13px' }}
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <Home size={14} style={{ marginRight: '4px' }} />
                  <span>Return to Home</span>
                </button>
              </div>
            </div>

            <EventInsights
              onStartPlanning={handleStartPlanning}
              onExploreDemo={() => {
                setActiveTab('home');
                setTimeout(() => {
                  const el = document.getElementById('interactive-demo');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            />
          </div>
        )}

        {/* ==========================================================
            VIEW 5: DEDICATED FAQ & SUPPORT HUB
            ========================================================== */}
        {activeTab === 'faq' && (
          <div style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <div className="content-wrapper">
              <div className="section-switch-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={18} color="#FF4D6D" />
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Viewing Section: <strong>Frequently Asked Questions & Support</strong>
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '13px' }}
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <Home size={14} style={{ marginRight: '4px' }} />
                  <span>Return to Home</span>
                </button>
              </div>
            </div>

            <FAQSection soundEnabled={soundEnabled} />
          </div>
        )}

        {/* Final CTA Section (on all views for conversion continuity) */}
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
                style={{ padding: '10px 28px', fontSize: '16px' }}
                onClick={handleStartPlanning}
              >
                <span>Build your event plan free</span>
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
                Cloudflare-first architecture • WCAG 2.2 compliant • Zero pure black • Rich chocolate roast contrast
              </div>
            </div>

            <div className="footer-col">
              <h5>App Sections</h5>
              <ul className="footer-links">
                <li>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    Home 3D Experience
                  </button>
                </li>
                <li>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => { setActiveTab('blueprints'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    12 Event Blueprints (WebGL 3D)
                  </button>
                </li>
                <li>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => { setActiveTab('planner'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    Live Event Planner
                  </button>
                </li>
                <li>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit' }} onClick={() => { setActiveTab('insights'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    Event Insights & AEO Hub
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
              <h5>Event types</h5>
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
              <h5>Trust & Quality</h5>
              <ul className="footer-links">
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={13} color="#059669" /> Decimal-safe accounting</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={13} color="#059669" /> Zero dark patterns</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={13} color="#059669" /> Cloudflare Edge Tenant</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={13} color="#059669" /> Export to CSV & PDF</li>
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
