import React from 'react';
import { GridMotion } from './GridMotion';

const FESTIVAL_PHOTOS = [
  '/festivals/rio-carnival.jpg',
  '/festivals/kyoto-lanterns.jpg',
  '/festivals/venice-masquerade.jpg',
  '/festivals/holi-festival.jpg',
  '/festivals/kyoto-lanterns.jpg',
  '/festivals/rio-carnival.jpg',
  '/festivals/holi-festival.jpg',
  '/festivals/venice-masquerade.jpg',
  '/festivals/rio-carnival.jpg',
  '/festivals/holi-festival.jpg',
  '/festivals/kyoto-lanterns.jpg',
  '/festivals/venice-masquerade.jpg',
];

interface GlobalFestivalFooterShowcaseProps {
  onSelectFestival?: (category: string, name: string) => void;
}

export const GlobalFestivalFooterShowcase: React.FC<GlobalFestivalFooterShowcaseProps> = () => {
  return (
    <section
      className="footer-grid-motion-section"
      aria-label="Global celebrations photo gallery"
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        background: 'var(--bg-canvas, #fbf8f3)',
        paddingTop: '32px',
        paddingBottom: '32px',
      }}
    >
      <div
        className="footer-grid-motion-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '520px',
          overflow: 'hidden',
        }}
      >
        <GridMotion
          items={FESTIVAL_PHOTOS}
          rows={4}
          aspectRatio={1.4}
          gap={18}
          radius={16}
          angle={-10}
          tilt={0}
          speed={22}
          direction="alternate"
          parallax={0.5}
          spotlight={0.65}
          dim={0.25}
          fade={0.5}
          grayscale={false}
          theme="light"
          tileColor="var(--bg-card, #ffffff)"
        />
      </div>
    </section>
  );
};
