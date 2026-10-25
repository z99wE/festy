import React from 'react';
import { ArrowRight, Cake, Heart, Sparkles, Building2, Users2, Palette } from 'lucide-react';

interface CategoryShowcaseProps {
  onSelectCategory: (occasionId: string) => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'birthday',
      title: 'Milestone Birthdays',
      desc: 'From sweet 16s to golden 50ths, curate festive playlists, dessert bars, and photo moments.',
      icon: <Cake size={26} />,
      badge: 'Most Popular',
      color: 'var(--orange-500)',
    },
    {
      id: 'wedding',
      title: 'Joyful Weddings',
      desc: 'Coordinate venues, tasting menus, floral arches, and guest timelines without sleepless nights.',
      icon: <Heart size={26} />,
      badge: 'High Emotion',
      color: 'var(--accent-coral)',
    },
    {
      id: 'community',
      title: 'Community Carnivals',
      desc: 'Open-air street festivals, volunteer coordination, food truck stages, and safe crowd flow.',
      icon: <Sparkles size={26} />,
      badge: 'Open Air',
      color: 'var(--accent-gold)',
    },
    {
      id: 'work',
      title: 'Company Galas & Launches',
      desc: 'Celebrate team breakthroughs, product unveilings, and festive dinners with executive polish.',
      icon: <Building2 size={26} />,
      badge: 'Professional',
      color: 'var(--accent-sky)',
    },
    {
      id: 'birthday',
      title: 'Family Reunions',
      desc: 'Multi-generational feasts, fun group activities, accessible venues, and memorable keepsakes.',
      icon: <Users2 size={26} />,
      badge: 'Heartwarming',
      color: 'var(--accent-mint-dark)',
    },
    {
      id: 'community',
      title: 'Bespoke Celebrations',
      desc: 'Start with a completely blank canvas and let Festiya help define your unique celebratory ritual.',
      icon: <Palette size={26} />,
      badge: 'Infinite Freedom',
      color: 'var(--accent-violet)',
    },
  ];

  return (
    <section className="categories-section" id="categories" aria-labelledby="categories-heading">
      <div className="content-wrapper">
        <div className="section-header">
          <h2 id="categories-heading" className="section-title">
            Proven Event Blueprints Engineered for High-Stakes Celebrations
          </h2>
          <p className="section-subtitle">
            Pre-calibrated spending models, milestone timelines, and vendor interview criteria for weddings, milestone parties, galas, and festivals.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="category-card"
              onClick={() => {
                onSelectCategory(cat.id);
                const el = document.getElementById('interactive-planner');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCategory(cat.id);
                  const el = document.getElementById('interactive-planner');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              aria-label={`Select ${cat.title} and open plan builder`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="category-card-icon" style={{ background: 'var(--orange-100)', color: cat.color }}>
                  {cat.icon}
                </div>
              </div>

              <h4>{cat.title}</h4>
              <p>{cat.desc}</p>

              <div className="category-card-cta">
                <span>Explore Plan Blueprint</span>
                <ArrowRight size={16} aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
