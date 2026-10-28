import React from 'react';
import { GridMotion } from './GridMotion';

const FESTIVAL_PHOTOS = [
  {
    src: '/festivals/rio-carnival.webp',
    alt: 'Rio de Janeiro Carnival Celebration - Grand Sambadrome parade with vibrant floats, feathered dancers, and lively music',
  },
  {
    src: '/festivals/kyoto-lanterns.webp',
    alt: 'Kyoto Gion Matsuri Lantern Celebration - Evening historical festival with illuminated traditional paper lanterns in Kyoto streets',
  },
  {
    src: '/festivals/venice-masquerade.webp',
    alt: 'Venice Carnival Grand Masquerade Gala - Elegant baroque costumes and handcrafted gold filigree carnival masks in Venice',
  },
  {
    src: '/festivals/holi-festival.webp',
    alt: 'Holi Festival of Colors Celebration - Joyful spring gathering with organic vibrant powdered gulal colors flying in sunlight',
  },
  {
    src: '/festivals/kyoto-lanterns.webp',
    alt: 'Kyoto Gion Matsuri Evening Festival - Traditional Japanese lantern festival illuminating celebratory night crowds',
  },
  {
    src: '/festivals/rio-carnival.webp',
    alt: 'Rio Carnival Parade Showcase - World-famous Brazilian carnival with spectacular musical performance and radiant costumes',
  },
  {
    src: '/festivals/holi-festival.webp',
    alt: 'Indian Holi Color Festival - Celebratory community festival honoring spring renewal with color bursts and music',
  },
  {
    src: '/festivals/venice-masquerade.webp',
    alt: 'Venice Masquerade Ball - Historic Italian celebration with period Renaissance attire and Venetian carnival artistry',
  },
  {
    src: '/festivals/rio-carnival.webp',
    alt: 'Rio de Janeiro Street Carnival - Energetic bloco celebration with dancing performers and brass band rhythms',
  },
  {
    src: '/festivals/holi-festival.webp',
    alt: 'Holi Festival of Joy - Joyous festival participants celebrating friendship and love with pink and saffron color powders',
  },
  {
    src: '/festivals/kyoto-lanterns.webp',
    alt: 'Kyoto Lantern Festival Walk - Atmospheric lantern-lit heritage path during annual Kyoto cultural festival celebration',
  },
  {
    src: '/festivals/venice-masquerade.webp',
    alt: 'Venetian Carnival Evening - Grand canal palace celebration with masquerade masqueraders in historical costumes',
  },
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
