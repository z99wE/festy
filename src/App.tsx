import { useState, useEffect, lazy, Suspense } from 'react';
import { Navbar, type AuthUser, type ActiveAppTab } from './components/Navbar';
import { detectUserRegion } from './utils/currency';
import { playCelebrationSound } from './utils/audio';
import { type EventPlanningContext } from './data/globalCelebrations';
import { LazyMount } from './components/LazyMount';
import { FooterSection } from './components/FooterSection';
import { HomeTabView } from './components/HomeTabView';

const OrbitableHeroLogo = lazy(() => import('./components/OrbitableHeroLogo').then((m) => ({ default: m.OrbitableHeroLogo })));
const AuthModal = lazy(() => import('./components/AuthModal').then((m) => ({ default: m.AuthModal })));
const CategoryShowcase = lazy(() => import('./components/CategoryShowcase').then((m) => ({ default: m.CategoryShowcase })));
const PlanBuilder = lazy(() => import('./components/PlanBuilder').then((m) => ({ default: m.PlanBuilder })));
const FAQSection = lazy(() => import('./components/FAQSection').then((m) => ({ default: m.FAQSection })));
const GlobalFestivalFooterShowcase = lazy(() => import('./components/GlobalFestivalFooterShowcase').then((m) => ({ default: m.GlobalFestivalFooterShowcase })));
const PeekingMascot = lazy(() => import('./components/PeekingMascot').then((m) => ({ default: m.PeekingMascot })));
const FestiChatbot = lazy(() => import('./components/FestiChatbot').then((m) => ({ default: m.FestiChatbot })));
const NewsletterMascotWidget = lazy(() => import('./components/NewsletterMascotWidget').then((m) => ({ default: m.NewsletterMascotWidget })));

export function App() {
  const [activeOccasion, setActiveOccasion] = useState('birthday');
  const [selectedPlanningContext, setSelectedPlanningContext] = useState<EventPlanningContext | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveAppTab>('home');
  const [soundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Regional currency state
  const [currentCurrency] = useState<string>(() => {
    return detectUserRegion().currencyCode || 'USD';
  });

  // User authentication state (Edge tenant session)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('festiya_cf_session_v1') || localStorage.getItem('festiya_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn('Could not load user session', e);
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('signup');

  // Listen to prefers-reduced-motion media query changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Listen for autonomous multi-agent plan applications from Festi AI
  useEffect(() => {
    const handleApplyPlan = (e: Event) => {
      const customEvent = e as CustomEvent<{
        occasionId: string;
        budgetUSD?: number;
        guestRange?: string;
        name?: string;
        location?: string;
        dates?: string;
        aiPrompt?: string;
      }>;
      const detail = customEvent.detail;
      if (!detail) return;

      if (detail.occasionId) {
        setActiveOccasion(detail.occasionId);
      }

      setSelectedPlanningContext({
        id: detail.occasionId || 'birthday',
        name: detail.name || 'Custom Autonomous Plan',
        category: detail.occasionId || 'birthday',
        location: detail.location || 'Selected Venue',
        dates: detail.dates || 'Upcoming 6 Months',
        guestRange: detail.guestRange || '60 guests',
        budgetUSD: detail.budgetUSD || 5000,
        aiPrompt: detail.aiPrompt,
      });

      setActiveTab('planner');
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
      playCelebrationSound(soundEnabled);
    };

    window.addEventListener('festiya-apply-plan', handleApplyPlan);
    return () => window.removeEventListener('festiya-apply-plan', handleApplyPlan);
  }, [reducedMotion, soundEnabled]);

  const handleStartPlanning = () => {
    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    playCelebrationSound(soundEnabled);
  };

  const handleExploreDemo = () => {
    const demoEl = document.getElementById('interactive-demo') || document.getElementById('insights');
    if (demoEl) {
      demoEl.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const handleQuickOccasionSelect = (id: string) => {
    setActiveOccasion(id);
    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    playCelebrationSound(soundEnabled);
  };

  const handleBlueprintSelectCategory = (occ: string) => {
    setActiveOccasion(occ);
    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToPlanner = () => {
    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOccasionChange = (occ: string) => {
    setActiveOccasion(occ);
    setSelectedPlanningContext(null);
  };

  const handleClearPlanningContext = () => {
    setSelectedPlanningContext(null);
  };

  const handleFestivalSelect = (occ: string) => {
    setActiveOccasion(occ);
    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('festiya_cf_session_v1');
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
        {/* VIEW 1: HOME EXPERIENCE */}
        {activeTab === 'home' && (
          <HomeTabView
            activeOccasion={activeOccasion}
            reducedMotion={reducedMotion}
            soundEnabled={soundEnabled}
            currentCurrency={currentCurrency}
            onSelectOccasion={handleQuickOccasionSelect}
            onStartPlanning={handleStartPlanning}
            onExploreDemo={handleExploreDemo}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSelectPlanningContext={(ctx) => setSelectedPlanningContext(ctx)}
            OrbitableHeroLogoComponent={OrbitableHeroLogo}
          />
        )}

        {/* VIEW 2: DEDICATED 12 EVENT BLUEPRINTS */}
        {activeTab === 'blueprints' && (
          <div style={{ paddingTop: '12px', minHeight: '80vh' }}>
            <Suspense fallback={null}>
              <CategoryShowcase
                onSelectCategory={handleBlueprintSelectCategory}
                onNavigateToPlanner={handleNavigateToPlanner}
              />
            </Suspense>
          </div>
        )}

        {/* VIEW 3: DEDICATED PLANNER WORKSPACE */}
        {activeTab === 'planner' && (
          <div style={{ paddingTop: '12px', minHeight: '80vh' }}>
            <Suspense fallback={null}>
              <PlanBuilder
                activeOccasion={activeOccasion}
                onOccasionChange={handleOccasionChange}
                soundEnabled={soundEnabled}
                planningContext={selectedPlanningContext}
                onClearPlanningContext={handleClearPlanningContext}
              />
            </Suspense>
          </div>
        )}

        {/* VIEW 4: DEDICATED FAQ & SUPPORT HUB */}
        {activeTab === 'faq' && (
          <div style={{ paddingTop: '12px', minHeight: '80vh' }}>
            <Suspense fallback={null}>
              <FAQSection soundEnabled={soundEnabled} />
            </Suspense>
          </div>
        )}

      </main>

      {/* Global Celebrations 3D Parallax & Perspective Footer Showcase with Floating CTA Box */}
      <LazyMount placeholderHeight="580px" rootMargin="300px">
        <Suspense fallback={null}>
          <GlobalFestivalFooterShowcase
            onStartPlanning={handleStartPlanning}
            onSelectFestival={handleFestivalSelect}
          />
        </Suspense>
      </LazyMount>

      {/* FOOTER */}
      <FooterSection
        onNavigateTab={(tab) => setActiveTab(tab)}
        onSelectOccasion={(occ) => setActiveOccasion(occ)}
      />

      {/* Playful 3D Alive Peeking Mascot (randomized, max 3 per session, side & upside-down peek) */}
      <Suspense fallback={null}>
        <PeekingMascot />
      </Suspense>

      {/* Floating Animated Festi AI Mascot & Chatbot */}
      <Suspense fallback={null}>
        <FestiChatbot />
      </Suspense>

      {/* Playful Bottom-Left Mascot Holding Newsletter Upwards */}
      <Suspense fallback={null}>
        <NewsletterMascotWidget
          currentUser={currentUser}
          soundEnabled={soundEnabled}
        />
      </Suspense>

      {/* Edge Tenant Sign In / Sign Up Modal */}
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
