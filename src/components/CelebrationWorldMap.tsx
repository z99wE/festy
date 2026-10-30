import React, { useState, useMemo, useRef, useCallback } from 'react';
import type * as THREE from 'three';
import {
  Search,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { playPopSound } from '../utils/audio';
import type { EventPlanningContext } from '../data/globalCelebrations';
import {
  type WorldCelebrationPin,
  WORLD_CELEBRATION_PINS,
  formatLocalRegionalBudget,
} from '../data/worldCelebrationData';
import { CelebrationDossierCard } from './CelebrationDossierCard';
import { CelebrationGlobeCanvas } from './CelebrationGlobeCanvas';



const REGIONS = ['All', 'Americas', 'Europe', 'Asia & Pacific', 'Middle East & Africa'] as const;
type RegionType = (typeof REGIONS)[number];

interface CelebrationWorldMapProps {
  reducedMotion?: boolean;
  currentCurrency?: string;
  onSelectEventForPlanner: (occasionId: string, eventName: string, context?: EventPlanningContext) => void;
}

function DestinationChip({
  pin,
  isSelected,
  onSelect,
}: {
  pin: WorldCelebrationPin;
  isSelected: boolean;
  onSelect: (pin: WorldCelebrationPin) => void;
}) {
  const { localFormatted } = formatLocalRegionalBudget(pin);
  return (
    <button
      type="button"
      aria-label={`Select destination ${pin.name}`}
      className={`destination-chip ${isSelected ? 'active' : ''}`}
      onClick={() => onSelect(pin)}
    >
      <span className="chip-flag">{pin.flag}</span>
      <div className="chip-info">
        <span className="chip-name">{pin.name}</span>
        <span className="chip-cost">{localFormatted} ({pin.localCurrencyCode})</span>
      </div>
    </button>
  );
}

export const CelebrationWorldMap: React.FC<CelebrationWorldMapProps> = ({
  reducedMotion = false,
  onSelectEventForPlanner,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<RegionType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePinId, setActivePinId] = useState<string>('rio_carnival');
  const [autoRotate, setAutoRotate] = useState(!reducedMotion);

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetRotationRef = useRef<{ x: number; y: number } | null>(null);

  const filteredPins = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return WORLD_CELEBRATION_PINS.filter((pin) => {
      const matchesRegion = selectedRegion === 'All' || pin.region === selectedRegion;
      const matchesSearch = !q || pin.name.toLowerCase().includes(q) || pin.location.toLowerCase().includes(q) || pin.country.toLowerCase().includes(q);
      return matchesRegion && matchesSearch;
    });
  }, [selectedRegion, searchQuery]);

  const activePin = useMemo(() => {
    return filteredPins.find((p) => p.id === activePinId) || WORLD_CELEBRATION_PINS.find((p) => p.id === activePinId) || filteredPins[0] || WORLD_CELEBRATION_PINS[0];
  }, [activePinId, filteredPins]);

  const focusOnPin = useCallback((pin: WorldCelebrationPin) => {
    playPopSound(false);
    setActivePinId(pin.id);
    const targetY = -((pin.lon - 0) * (Math.PI / 180));
    const targetX = (pin.lat * (Math.PI / 180)) * 0.7;
    targetRotationRef.current = { x: targetX, y: targetY };
  }, []);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const curZ = cameraRef.current.position.z;
    const delta = direction === 'in' ? -25 : 25;
    cameraRef.current.position.z = Math.max(170, Math.min(320, curZ + delta));
  };

  const handleResetRotation = () => {
    targetRotationRef.current = { x: 0.2, y: 0.6 };
    if (cameraRef.current) cameraRef.current.position.z = 240;
  };

  const handlePlanThisEvent = () => {
    onSelectEventForPlanner(activePin.categoryKey, activePin.name, {
      id: activePin.id,
      name: activePin.name,
      category: activePin.categoryKey,
      location: activePin.location,
      dates: activePin.dates,
      budgetUSD: activePin.estBudgetUSD,
      guestRange: activePin.guestRange,
      theme: activePin.tagline,
      logisticsHighlight: activePin.logisticsHighlight,
      aiPrompt: activePin.aiPrompt,
    });
  };

  const handleRegionClick = (r: RegionType) => {
    setSelectedRegion(r);
    if (r !== 'All') {
      const match = WORLD_CELEBRATION_PINS.find((p) => p.region === r);
      if (match) focusOnPin(match);
    }
  };

  return (
    <section className="celebration-world-section" aria-labelledby="world-globe-title">
      <div className="celebration-world-card">
        <div className="celebration-world-header">
          <div>
            <h2 id="world-globe-title" className="celebration-world-title">
              Global Celebrations &amp; Cultural Long Weekends
            </h2>
            <p className="celebration-world-subtitle">
              Spin the 3D globe to explore iconic festivals with native local currency valuations calibrated to regional vendor economics.
            </p>
          </div>

          <div className="globe-controls-pill-group">
            <button
              type="button"
              aria-label={autoRotate ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
              title={autoRotate ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
              className={`mode-toggle-btn ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate(!autoRotate)}
            >
              <RotateCw size={13} className={autoRotate ? 'spin-icon' : ''} />
              <span>{autoRotate ? 'Spinning' : 'Paused'}</span>
            </button>
            <button
              type="button"
              aria-label="Zoom In"
              title="Zoom In"
              className="mode-toggle-btn"
              onClick={() => handleZoom('in')}
            >
              <ZoomIn size={13} />
            </button>
            <button
              type="button"
              aria-label="Zoom Out"
              title="Zoom Out"
              className="mode-toggle-btn"
              onClick={() => handleZoom('out')}
            >
              <ZoomOut size={13} />
            </button>
            <button
              type="button"
              aria-label="Reset View"
              title="Reset View"
              className="mode-toggle-btn"
              onClick={handleResetRotation}
            >
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="celebration-filter-bar">
          <div className="region-pills" role="tablist" aria-label="Filter by region">
            {REGIONS.map((r) => (
              <button key={r} aria-label={'Filter by region: ' + r}
                type="button"
                className={`region-pill-btn ${selectedRegion === r ? 'active' : ''}`}
                onClick={() => handleRegionClick(r)}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="celebration-search-wrap">
            <Search size={14} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              id="celebration-search-input"
              aria-label="Search celebration destinations"
              className="celebration-search-input"
              placeholder="Search festival, city, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="celebration-grid-body">
          <CelebrationGlobeCanvas
            autoRotate={autoRotate}
            activePinId={activePin.id}
            onSelectPin={focusOnPin}
            targetRotationRef={targetRotationRef}
            cameraRef={cameraRef}
          />

          <CelebrationDossierCard
            activePin={activePin}
            onPlanEvent={handlePlanThisEvent}
          />
        </div>

        <div className="globe-destinations-strip">
          <div className="destinations-strip-header">
            <span className="strip-title">Featured World Destinations</span>
            <span className="strip-count">{filteredPins.length} Celebrations</span>
          </div>
          <div className="destinations-scroll-track">
            {filteredPins.map((pin) => (
              <DestinationChip
                key={pin.id}
                pin={pin}
                isSelected={pin.id === activePin.id}
                onSelect={focusOnPin}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CelebrationWorldMap;
