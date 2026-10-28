import { Suspense, lazy, type ComponentType } from 'react';
import { HeroSection } from './HeroSection';
import { LazyMount } from './LazyMount';
import { TaglineReveal } from './TaglineReveal';
import { GatewayNavSection } from './GatewayNavSection';
import type { EventPlanningContext } from '../data/globalCelebrations';
import type { ActiveAppTab } from './Navbar';

const CelebrationWorldMap = lazy(() => import('./CelebrationWorldMap').then((m) => ({ default: m.CelebrationWorldMap })));
const ProblemSolution = lazy(() => import('./ProblemSolution').then((m) => ({ default: m.ProblemSolution })));
const LiveInteractiveDemo = lazy(() => import('./LiveInteractiveDemo').then((m) => ({ default: m.LiveInteractiveDemo })));
const EventInsights = lazy(() => import('./EventInsights').then((m) => ({ default: m.EventInsights })));
const EventEconomicsAbacus = lazy(() => import('./EventEconomicsAbacus').then((m) => ({ default: m.EventEconomicsAbacus })));

interface HomeTabViewProps {
  activeOccasion: string;
  reducedMotion: boolean;
  soundEnabled: boolean;
  currentCurrency: string;
  onSelectOccasion: (id: string) => void;
  onStartPlanning: () => void;
  onExploreDemo: () => void;
  onNavigateTab: (tab: ActiveAppTab) => void;
  onSelectPlanningContext: (ctx: EventPlanningContext) => void;
  OrbitableHeroLogoComponent: ComponentType<{ reducedMotion: boolean; soundEnabled: boolean }>;
}

export function HomeTabView({
  activeOccasion,
  reducedMotion,
  soundEnabled,
  currentCurrency,
  onSelectOccasion,
  onStartPlanning,
  onExploreDemo,
  onNavigateTab,
  onSelectPlanningContext,
  OrbitableHeroLogoComponent,
}: HomeTabViewProps) {
  const handleMapEventSelect = (occasionId: string, eventName: string, context?: EventPlanningContext) => {
    onSelectOccasion(occasionId);
    if (context) {
      onSelectPlanningContext(context);
    } else {
      onSelectPlanningContext({
        id: occasionId,
        name: eventName,
        category: occasionId,
        location: 'Worldwide',
        dates: 'Upcoming 6 Months',
      });
    }
    onNavigateTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAbacusApply = (summary: { regionName: string }) => {
    onSelectPlanningContext({
      id: 'abacus-valuation',
      name: `${summary.regionName} Celebration`,
      category: activeOccasion,
      location: summary.regionName,
      dates: 'Upcoming Season',
    });
    onNavigateTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToAbacus = () => {
    const el = document.getElementById('event-economics-abacus');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section id="hero" className="hero-section" aria-labelledby="hero-title">
        <div className="content-wrapper">
          <HeroSection
            activeOccasion={activeOccasion}
            reducedMotion={reducedMotion}
            soundEnabled={soundEnabled}
            onSelectOccasion={onSelectOccasion}
            onStartPlanning={onStartPlanning}
            onExploreBlueprints={() => {
              onNavigateTab('blueprints');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            OrbitableHeroLogoComponent={OrbitableHeroLogoComponent}
          />

          <div style={{ marginTop: '36px', marginBottom: '40px' }}>
            <LazyMount placeholderHeight="420px" rootMargin="350px">
              <Suspense fallback={<div style={{ minHeight: '380px' }} />}>
                <CelebrationWorldMap
                  reducedMotion={reducedMotion}
                  currentCurrency={currentCurrency}
                  onSelectEventForPlanner={handleMapEventSelect}
                />
              </Suspense>
            </LazyMount>
          </div>

          <GatewayNavSection
            onNavigateTab={onNavigateTab}
            onScrollToAbacus={handleScrollToAbacus}
          />
        </div>
      </section>

      <LazyMount placeholderHeight="520px" rootMargin="300px">
        <Suspense fallback={null}>
          <EventEconomicsAbacus onApplyToWorkspace={handleAbacusApply} />
        </Suspense>
      </LazyMount>

      <LazyMount placeholderHeight="320px" rootMargin="300px">
        <Suspense fallback={null}>
          <LiveInteractiveDemo />
        </Suspense>
      </LazyMount>

      <TaglineReveal reducedMotion={reducedMotion} />

      <LazyMount placeholderHeight="360px" rootMargin="300px">
        <Suspense fallback={null}>
          <ProblemSolution />
        </Suspense>
      </LazyMount>

      <LazyMount placeholderHeight="580px" rootMargin="350px">
        <Suspense fallback={null}>
          <EventInsights
            onStartPlanning={onStartPlanning}
            onExploreDemo={onExploreDemo}
          />
        </Suspense>
      </LazyMount>
    </>
  );
}
