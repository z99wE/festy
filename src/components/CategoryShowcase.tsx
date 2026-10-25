import React, { useState } from 'react';
import { ArrowRight, Sparkles, Layers, Cake, Heart, Building2, Users2, Palette } from 'lucide-react';
import { FlexCarousel, type FlexCarouselItem } from './FlexCarousel';

interface CategoryShowcaseProps {
  onSelectCategory: (occasionId: string) => void;
}

const CAROUSEL_ITEMS: (FlexCarouselItem & { id: string; categoryDescription: string; tags: string[]; iconName: string; color: string })[] = [
  {
    id: 'wedding',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80&auto=format&fit=max',
    alt: 'Joyful wedding reception with glowing floral arches and table settings',
    title: 'Joyful Weddings & Receptions',
    subtitle: '3-Tier Budgets • Tasting Menus • Floral Timelines',
    categoryDescription: 'Coordinate venues, tasting menus, floral arches, and guest timelines without sleepless nights.',
    tags: ['Tasting Menus', 'Floral Arches', 'Day-of Run Sheet'],
    iconName: 'heart',
    color: 'var(--accent-coral)'
  },
  {
    id: 'birthday',
    src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80&auto=format&fit=max',
    alt: 'Vibrant celebration with balloon arches and dessert displays',
    title: 'Milestone Birthdays',
    subtitle: 'Sweet 16s to Golden 50ths • Playlists & Bar Schedules',
    categoryDescription: 'From sweet 16s to golden 50ths, curate festive playlists, dessert bars, and photo moments.',
    tags: ['Bar Allocation', 'DJ Run-of-Show', 'Dessert Buffets'],
    iconName: 'cake',
    color: 'var(--orange-500)'
  },
  {
    id: 'community',
    src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80&auto=format&fit=max',
    alt: 'Open air festival crowd with illuminated stage and food trucks',
    title: 'Community Carnivals & Festivals',
    subtitle: 'Open-Air Stages • Food Truck Staging • Crowd Safety',
    categoryDescription: 'Open-air street festivals, volunteer coordination, food truck stages, and safe crowd flow.',
    tags: ['Volunteer Grid', 'Permit Milestones', 'Power & Sound'],
    iconName: 'sparkles',
    color: 'var(--accent-gold)'
  },
  {
    id: 'work',
    src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80&auto=format&fit=max',
    alt: 'Corporate gala dinner with stage lighting and banquet tables',
    title: 'Company Galas & Offsites',
    subtitle: 'Executive Keynotes • Multi-Vendor Logistics • VIP Dining',
    categoryDescription: 'Celebrate team breakthroughs, product unveilings, and festive dinners with executive polish.',
    tags: ['AV Production', 'Keynote Run Sheet', 'VIP Catering'],
    iconName: 'building',
    color: 'var(--accent-sky)'
  },
  {
    id: 'anniversary',
    src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80&auto=format&fit=max',
    alt: 'Intimate evening anniversary dinner with candles and wine glasses',
    title: 'Joyful Anniversaries & Vow Renewals',
    subtitle: 'Intimate Feasts • Toast Timelines • Keepsake Planning',
    categoryDescription: 'Multi-generational feasts, fun group activities, accessible venues, and memorable keepsakes.',
    tags: ['Wine Pairings', 'Memory Table', 'Intimate Acoustics'],
    iconName: 'users',
    color: 'var(--accent-mint-dark)'
  },
  {
    id: 'shower',
    src: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&q=80&auto=format&fit=max',
    alt: 'Festive brunch table with pastel florals and celebration gifts',
    title: 'Baby & Bridal Showers',
    subtitle: 'Brunch Stations • Favor Registries • Guest Activities',
    categoryDescription: 'Start with a completely blank canvas and let Festiya help define your unique celebratory ritual.',
    tags: ['Brunch Matrix', 'Mimosa Bar', 'Guest Favors'],
    iconName: 'palette',
    color: 'var(--accent-violet)'
  }
];

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onSelectCategory }) => {
  const [activePreset, setActivePreset] = useState<'liquid' | 'ribbon' | 'vortex' | 'arch'>('liquid');
  const [activeIndex, setActiveIndex] = useState(0);

  const currentItem = CAROUSEL_ITEMS[activeIndex] || CAROUSEL_ITEMS[0];

  const handleLaunchPlan = (occasionId: string) => {
    onSelectCategory(occasionId);
    const el = document.getElementById('interactive-planner');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'cake': return <Cake size={24} />;
      case 'heart': return <Heart size={24} />;
      case 'sparkles': return <Sparkles size={24} />;
      case 'building': return <Building2 size={24} />;
      case 'users': return <Users2 size={24} />;
      default: return <Palette size={24} />;
    }
  };

  return (
    <section className="categories-section" id="categories" aria-labelledby="categories-heading">
      <div className="content-wrapper">
        <div className="section-header" style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 36px' }}>
          <div className="hero-badge" style={{ margin: '0 auto 16px', display: 'inline-flex' }}>
            <Sparkles size={14} style={{ marginRight: '6px' }} />
            <span>Interactive WebGL 3D Carousel</span>
          </div>

          <h2 id="categories-heading" className="section-title">
            Proven Event Blueprints Engineered for High-Stakes Celebrations
          </h2>

          <p className="section-subtitle">
            Pre-calibrated spending models, milestone timelines, and vendor interview criteria. Drag or click the 3D cards to explore each celebration type.
          </p>

          {/* Preset Selector Pill Group */}
          <div className="carousel-preset-pills" role="tablist" aria-label="Carousel 3D Lens Presets">
            <span className="preset-label">
              <Layers size={13} style={{ marginRight: '4px' }} />
              Lens Distortion Preset:
            </span>
            {(['liquid', 'ribbon', 'vortex', 'arch'] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                role="tab"
                aria-selected={activePreset === preset}
                className={`preset-pill ${activePreset === preset ? 'active' : ''}`}
                onClick={() => setActivePreset(preset)}
              >
                {preset.charAt(0).toUpperCase() + preset.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic 3D FlexCarousel from React Bits */}
        <div className="carousel-viewport-wrapper">
          <div className="carousel-canvas-container" style={{ width: '100%', height: '540px', position: 'relative' }}>
            <FlexCarousel
              items={CAROUSEL_ITEMS}
              preset={activePreset}
              intro="rise"
              cardHeight={0.52}
              gap={16}
              radius={18}
              squeeze={0.2}
              focusOnClick
              captions
              autoplay
              interval={4.5}
              onChange={(idx) => setActiveIndex(idx)}
              onSelect={(_idx, item) => {
                if (item?.id) {
                  handleLaunchPlan(item.id);
                }
              }}
            />
          </div>

          {/* Active Category Information Card & Launch Bar */}
          <div className="carousel-active-details">
            <div className="active-details-text">
              <div className="active-tag-row">
                {currentItem.tags.map((tag, i) => (
                  <span key={i} className="active-tag-pill">{tag}</span>
                ))}
              </div>
              <h3 className="active-category-title">{currentItem.title}</h3>
              <p className="active-category-desc">{currentItem.categoryDescription}</p>
            </div>

            <button
              type="button"
              className="btn btn-primary active-category-cta"
              onClick={() => handleLaunchPlan(currentItem.id)}
            >
              <span>Build {currentItem.title} Blueprint</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Complete Blueprint Content Card Grid (Always accessible & clickable) */}
        <div className="category-grid" style={{ marginTop: '40px' }}>
          {CAROUSEL_ITEMS.map((cat, idx) => (
            <div
              key={idx}
              className={`category-card ${idx === activeIndex ? 'active-highlight' : ''}`}
              onClick={() => {
                setActiveIndex(idx);
                handleLaunchPlan(cat.id);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveIndex(idx);
                  handleLaunchPlan(cat.id);
                }
              }}
              aria-label={`Select ${cat.title} and launch blueprint`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="category-card-icon" style={{ background: 'var(--orange-100)', color: cat.color }}>
                  {getCategoryIcon(cat.iconName)}
                </div>
                <span className="badge-pill sunshine" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  {cat.tags[0]}
                </span>
              </div>

              <h4>{cat.title}</h4>
              <p>{cat.categoryDescription}</p>

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
