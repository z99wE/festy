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
      <div className="hero-masthead-centerpiece" role="region" aria-label="Festiya Interactive 3D Mascot Logo">
        <Suspense fallback={<HeroLogoFallback />}>
          <OrbitableHeroLogoComponent reducedMotion={reducedMotion} soundEnabled={soundEnabled} />
        </Suspense>
      </div>

      <div
        className="hero-badge"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(91, 66, 243, 0.08)',
          border: '1px solid rgba(49, 46, 129, 0.25)',
          color: '#312e81',
          fontWeight: 700,
          fontSize: '0.875rem',
          margin: '0 auto 16px auto',
        }}
      >
        <span>✨ Autonomous GenAI Celebration &amp; Event Planning Assistant</span>
      </div>

      <h1 id="hero-title" className="hero-title">
        <span className="hero-headline-lead">Your GenAI Event Planning Assistant</span>
        <br />
        <span className="highlight-orange">For Weddings, Birthdays &amp; Community Gatherings.</span>
      </h1>

      <h2 className="hero-subtitle">
        Intelligent 3-tier budgets, minute-by-minute timelines, vendor negotiation checklists, and personalized celebratory ideas — generated in under 90 seconds.
      </h2>

      <p className="hero-description">
        Organizing an unforgettable wedding, a milestone birthday party, or a vibrant community festival? <strong>Festiya</strong> acts as your dedicated GenAI planning assistant — synthesizing custom budgets, precision run-of-show schedules, vendor checklists, and tailored celebration concepts into an actionable master plan.
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
