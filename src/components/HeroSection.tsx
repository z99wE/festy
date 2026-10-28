import { Suspense, type ComponentType } from 'react';
import { OCCASION_SWAP_ITEMS } from '../data/occasionData';

interface HeroSectionProps {
  activeOccasion: string;
  reducedMotion: boolean;
  soundEnabled: boolean;
  onSelectOccasion: (id: string) => void;
  onStartPlanning: () => void;
  onExploreBlueprints: () => void;
  OrbitableHeroLogoComponent: ComponentType<{ reducedMotion: boolean; soundEnabled: boolean }>;
}

function HeroLogoFallback() {
  return (
    <div
      className="orbitable-hero-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '940px',
        aspectRatio: '940 / 400',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src="/festiya-logo.webp"
        alt="Festiya 3D Plush Mascot Logo - Autonomous Celebration Architect & Event Planning Platform"
        title="Festiya 3D Plush Mascot Logo"
        width={639}
        height={240}
        fetchPriority="high"
        className="festiya-masthead-img"
      />
    </div>
  );
}

function OccasionGridItem({
  id,
  name,
  isActive,
  onSelect,
}: {
  id: string;
  name: string;
  isActive: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Select ${name} celebration`}
      className={`occasion-grid-btn ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(id)}
      aria-pressed={isActive}
    >
      <span className="occasion-grid-label">{name}</span>
    </button>
  );
}

export function HeroSection({
  activeOccasion,
  reducedMotion,
  soundEnabled,
  onSelectOccasion,
  onStartPlanning,
  onExploreBlueprints,
  OrbitableHeroLogoComponent,
}: HeroSectionProps) {
  return (
    <div className="hero-masthead-flow">
      <div className="hero-masthead-centerpiece" aria-label="Festiya Interactive 3D Mascot Logo">
        <Suspense fallback={<HeroLogoFallback />}>
          <OrbitableHeroLogoComponent reducedMotion={reducedMotion} soundEnabled={soundEnabled} />
        </Suspense>
      </div>

      <h1 id="hero-title" className="hero-title">
        <span className="hero-headline-lead">Plan Extraordinary Celebrations</span>
        <br />
        <span className="highlight-orange">Without the Stress, Spreadsheets, or Overcharging.</span>
      </h1>

      <h2 className="hero-subtitle">
        Audit-ready 3-tier budgets, milestone itineraries, and vendor contract run sheets — generated in under 90 seconds.
      </h2>

      <p className="hero-description">
        From intimate terrace dinners to 500-guest heritage weddings and corporate galas, <strong>Festiya</strong> replaces planning anxiety with real-time financial certainty, bespoke cost curves, and contract safeguards tailored to your city.
      </p>

      <div className="hero-occasion-grid" role="group" aria-label="Select celebration category">
        {OCCASION_SWAP_ITEMS.map((item) => (
          <OccasionGridItem
            key={item.id}
            id={item.id}
            name={item.name}
            isActive={activeOccasion === item.id}
            onSelect={onSelectOccasion}
          />
        ))}
      </div>

      <div className="hero-actions">
        <button
          type="button"
          aria-label="Build your event plan"
          className="btn btn-primary hero-btn-primary"
          onClick={onStartPlanning}
        >
          <span>Build your event plan</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        <button
          type="button"
          aria-label="Explore Blueprints"
          className="btn btn-secondary hero-btn-secondary"
          onClick={onExploreBlueprints}
        >
          <span>Explore Blueprints</span>
        </button>
      </div>
    </div>
  );
}
