import React, { useState, useRef } from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { openFestiAIChat } from './FestiChatbot';

interface FestivalCard {
  id: string;
  title: string;
  location: string;
  dates: string;
  image: string;
  vibe: string;
  category: string;
}

const GLOBAL_FESTIVALS: FestivalCard[] = [
  {
    id: 'rio-carnival',
    title: 'Rio de Janeiro Carnival',
    location: 'Rio de Janeiro, Brazil',
    dates: 'Feb 13–18, 2026',
    image: '/festivals/rio-carnival.jpg',
    vibe: 'Sambadrome Parades & Street Block Parties',
    category: 'festival',
  },
  {
    id: 'kyoto-lanterns',
    title: 'Kyoto Floating Lantern Festival',
    location: 'Kyoto, Japan',
    dates: 'Aug 16, 2026',
    image: '/festivals/kyoto-lanterns.jpg',
    vibe: 'Twilight Toroo Nagashi & Illuminated Pagodas',
    category: 'cultural_fest',
  },
  {
    id: 'venice-masquerade',
    title: 'Venetian Masquerade Grand Ball',
    location: 'Venice, Italy',
    dates: 'Jan 31 – Feb 17, 2026',
    image: '/festivals/venice-masquerade.jpg',
    vibe: 'Opulent Palazzo Gala & Baroque Costumes',
    category: 'gala',
  },
  {
    id: 'holi-festival',
    title: 'Holi Festival of Colors',
    location: 'Jaipur & Mathura, India',
    dates: 'Mar 3–4, 2026',
    image: '/festivals/holi-festival.jpg',
    vibe: 'Vivid Gulal Powder Dances & Heritage Banquets',
    category: 'cultural_fest',
  },
];

interface GlobalFestivalFooterShowcaseProps {
  onSelectFestival?: (category: string, name: string) => void;
}

export const GlobalFestivalFooterShowcase: React.FC<GlobalFestivalFooterShowcaseProps> = ({
  onSelectFestival,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tiltStyles, setTiltStyles] = useState<Record<number, React.CSSProperties>>({});
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Max -10 to +10 deg
    const rotateY = ((x - centerX) / centerX) * 10;

    setTiltStyles((prev) => ({
      ...prev,
      [idx]: {
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'transform 0.1s ease-out',
      },
    }));
  };

  const handleMouseLeave = (idx: number) => {
    setHoveredIdx(null);
    setTiltStyles((prev) => ({
      ...prev,
      [idx]: {
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    }));
  };

  return (
    <section className="global-footer-gallery-section" aria-label="Celebrations around the world">
      <div className="content-wrapper">
        <div className="section-header" style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px' }}>
          <h2 className="section-title" style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>
            Celebrations Engineered Across the Globe
          </h2>
          <p className="section-subtitle">
            From the electric rhythm of Rio to the candlelit waters of Kyoto, Festiya architects high-calm,
            budget-accurate blueprints for iconic spectacles worldwide.
          </p>
        </div>

        {/* 3D Parallax Festival Gallery Grid */}
        <div className="footer-gallery-grid">
          {GLOBAL_FESTIVALS.map((fest, idx) => (
            <div
              key={fest.id}
              ref={(el) => { cardRefs.current[idx] = el; }}
              className={`footer-gallery-card ${hoveredIdx === idx ? 'hovered' : ''}`}
              style={tiltStyles[idx] || {}}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseLeave={() => handleMouseLeave(idx)}
            >
              <div className="footer-gallery-img-wrapper">
                <img
                  src={fest.image}
                  alt={fest.title}
                  className="footer-gallery-img"
                  loading="lazy"
                />
                <div className="footer-gallery-gradient-overlay" />
              </div>

              <div className="footer-gallery-content">
                <div className="footer-gallery-badges">
                  <span className="footer-gallery-date">
                    <Calendar size={12} />
                    <span>{fest.dates}</span>
                  </span>
                  <span className="footer-gallery-loc">
                    <MapPin size={12} />
                    <span>{fest.location}</span>
                  </span>
                </div>

                <h3 className="footer-gallery-title">{fest.title}</h3>
                <p className="footer-gallery-vibe">{fest.vibe}</p>

                <div className="footer-gallery-actions">
                  <button
                    type="button"
                    className="btn btn-primary footer-gallery-btn"
                    onClick={() => {
                      if (onSelectFestival) {
                        onSelectFestival(fest.category, fest.title);
                      } else {
                        openFestiAIChat(`I want to plan a celebration inspired by ${fest.title} in ${fest.location}. Can you architect a budget and schedule?`);
                      }
                    }}
                  >
                    <span>Plan Celebration</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
