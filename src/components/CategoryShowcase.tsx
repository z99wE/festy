import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Cake,
  Heart,
  Building2,
  Users2,
  Palette,
  Wine,
  Music,
  Tv,
  Award,
  Tent,
} from 'lucide-react';
import { FlexCarousel, type FlexCarouselItem } from './FlexCarousel';

interface CategoryShowcaseProps {
  onSelectCategory: (occasionId: string) => void;
  onNavigateToPlanner?: () => void;
}

export const CAROUSEL_ITEMS: (FlexCarouselItem & {
  id: string;
  categoryDescription: string;
  tags: string[];
  iconName: string;
  color: string;
})[] = [
  {
    id: 'wedding',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80&auto=format&fit=max',
    alt: 'Joyful wedding reception with glowing floral arches and table settings',
    title: 'Joyful Weddings & Receptions',
    subtitle: '3-Tier Budgets • Tasting Menus • Floral Timelines',
    categoryDescription: 'Coordinate dream venues, tasting menus, floral arches, ceremony run-of-show, and bridal party timelines without sleepless nights.',
    tags: ['Tasting Menus', 'Floral Arches', 'Day-of Run Sheet'],
    iconName: 'heart',
    color: '#FF4D6D',
  },
  {
    id: 'birthday',
    src: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80&auto=format&fit=max',
    alt: 'Vibrant celebration with balloon arches and dessert displays',
    title: 'Milestone Birthdays',
    subtitle: 'Sweet 16s to Golden 50ths • Playlists & Bar Schedules',
    categoryDescription: 'From sweet 16s to vibrant golden 50ths, curate festive playlists, signature cocktails, dessert buffets, and keepsake photo moments.',
    tags: ['Bar Allocation', 'DJ Run-of-Show', 'Dessert Buffets'],
    iconName: 'cake',
    color: '#FF5E1E',
  },
  {
    id: 'festival',
    src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80&auto=format&fit=max',
    alt: 'Open air festival crowd with illuminated stage and food trucks',
    title: 'Open-Air Music Festivals & Carnivals',
    subtitle: 'Open-Air Stages • Food Truck Staging • Crowd Safety',
    categoryDescription: 'Open-air festival grounds, volunteer coordination grid, sound permit benchmarks, power drops, and safe high-capacity crowd egress.',
    tags: ['Sound Permits', 'Stage Power Grids', 'Artist Hospitality'],
    iconName: 'music',
    color: '#FFB703',
  },
  {
    id: 'product_launch',
    src: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80&auto=format&fit=max',
    alt: 'High tech product unveiling auditorium with stage lighting and audience',
    title: 'Tech Product Launches & Hackathons',
    subtitle: 'Keynote Production • Live Streaming • Demo Stations',
    categoryDescription: 'Unveil breakthrough innovations with precision teleprompters, worldwide low-latency streaming, press lounges, and interactive demo pods.',
    tags: ['Keynote Teleprompter', 'Global Stream Sync', 'Press Lounge'],
    iconName: 'tv',
    color: '#118AB2',
  },
  {
    id: 'retreat',
    src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=80&auto=format&fit=max',
    alt: 'Executive team collaboration in luxury mountain retreat',
    title: 'Executive Offsites & Leadership Retreats',
    subtitle: 'Luxury Lodging • Strategic Breakouts • Private Dining',
    categoryDescription: 'Align executive leadership, celebrate quarterly wins, curate private chef dinners, and balance intensive strategy with curated downtime.',
    tags: ['Breakout Rooms', 'Private Chef Menus', 'Team Expeditions'],
    iconName: 'building',
    color: '#059669',
  },
  {
    id: 'anniversary',
    src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80&auto=format&fit=max',
    alt: 'Intimate evening anniversary dinner with candles and wine glasses',
    title: 'Joyful Anniversaries & Vow Renewals',
    subtitle: 'Intimate Feasts • Toast Timelines • Keepsake Planning',
    categoryDescription: 'Multi-generational feasts, nostalgic tribute videos, acoustic string quartets, accessible venue seating, and memorable family keepsakes.',
    tags: ['Wine Pairings', 'Memory Table', 'Acoustic Strings'],
    iconName: 'users',
    color: '#BD3700',
  },
  {
    id: 'wine_tasting',
    src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80&auto=format&fit=max',
    alt: 'Artisanal wine tasting cellar with wooden barrels and crystal glasses',
    title: 'Gourmet Food & Wine Tastings',
    subtitle: 'Sommelier Pairings • Artisanal Courses • Palate Guides',
    categoryDescription: 'Exquisite multi-course tasting dinners, sommelier tasting cards, crystal stemware rental counts, and artisanal pairing logistics.',
    tags: ['Sommelier Notes', 'Course Timings', 'Stemware Rentals'],
    iconName: 'wine',
    color: '#7E4F38',
  },
  {
    id: 'cultural_fest',
    src: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&q=80&auto=format&fit=max',
    alt: 'Glowing festive lanterns celebrating cultural festival',
    title: 'Cultural Heritage Celebrations',
    subtitle: 'Diwali, Lunar New Year & Eid • Lanterns & Banquets',
    categoryDescription: 'Celebrate rich heritage rituals, festive lantern installations, authentic community feast catering, and ceremonial performances.',
    tags: ['Traditional Catering', 'Heritage Decor', 'Customary Rituals'],
    iconName: 'sparkles',
    color: '#FF8A47',
  },
  {
    id: 'shower',
    src: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&q=80&auto=format&fit=max',
    alt: 'Festive brunch table with pastel florals and celebration gifts',
    title: 'Baby & Bridal Showers',
    subtitle: 'Brunch Stations • Favor Registries • Guest Activities',
    categoryDescription: 'Sunlit celebratory brunches, custom mimosa bars, interactive keepsake signing, and guest comfort amenities planned to perfection.',
    tags: ['Brunch Matrix', 'Mimosa Bar', 'Guest Favors'],
    iconName: 'palette',
    color: '#FF4D6D',
  },
  {
    id: 'reunion',
    src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&q=80&auto=format&fit=max',
    alt: 'Group of lifelong friends laughing and celebrating together outdoors',
    title: 'Class & Alumni Reunions',
    subtitle: 'Decade Playlists • Memorabilia Galleries • Cocktail Lounges',
    categoryDescription: 'Bring decades of memories together with nostalgic photo slideshows, school color accents, casual food stations, and digital RSVPs.',
    tags: ['Name Tag Logistics', 'Slide Show AV', 'Late Night Bites'],
    iconName: 'tent',
    color: '#06D6A0',
  },
  {
    id: 'charity_gala',
    src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80&auto=format&fit=max',
    alt: 'Black tie fundraising dinner with stage spotlight and dining tables',
    title: 'Non-Profit Charity Galas & Fundraisers',
    subtitle: 'Silent Auctions • Donor Recognition • Black-Tie Service',
    categoryDescription: 'Maximize donor contributions with live pledge boards, silent auction bidding kiosks, VIP patron tables, and emotional keynote storytelling.',
    tags: ['Auction Catalog', 'Pledge Counters', 'Sponsor Spotlights'],
    iconName: 'award',
    color: '#FFB703',
  },
  {
    id: 'rooftop_soiree',
    src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&q=80&auto=format&fit=max',
    alt: 'Evening rooftop party with fairy lights and city skyline panorama',
    title: 'Rooftop Acoustic Nights & Art Soirées',
    subtitle: 'Cityscape Panoramas • Craft Mixology • Gallery Displays',
    categoryDescription: 'Intimate evening gatherings, craft cocktails, live acoustic guitars under fairy lights, and gallery art displays overlooking the skyline.',
    tags: ['Cocktail Formula', 'Ambient Strings', 'Warm Fairy Lights'],
    iconName: 'music',
    color: '#E64909',
  },
];

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  onSelectCategory,
  onNavigateToPlanner,
}) => {
  const [activePreset, setActivePreset] = useState<'liquid' | 'ribbon' | 'vortex' | 'arch'>('liquid');
  const [activeIndex, setActiveIndex] = useState(0);

  const currentItem = CAROUSEL_ITEMS[activeIndex] || CAROUSEL_ITEMS[0];

  const handleLaunchPlan = (occasionId: string) => {
    onSelectCategory(occasionId);
    if (onNavigateToPlanner) {
      onNavigateToPlanner();
    } else {
      const el = document.getElementById('interactive-planner');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'cake': return <Cake size={22} />;
      case 'heart': return <Heart size={22} />;
      case 'sparkles': return <Sparkles size={22} />;
      case 'building': return <Building2 size={22} />;
      case 'users': return <Users2 size={22} />;
      case 'wine': return <Wine size={22} />;
      case 'music': return <Music size={22} />;
      case 'tv': return <Tv size={22} />;
      case 'award': return <Award size={22} />;
      case 'tent': return <Tent size={22} />;
      default: return <Palette size={22} />;
    }
  };

  return (
    <section className="categories-section" id="categories" aria-labelledby="categories-heading">
      <div className="content-wrapper">
        <div className="section-header" style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 36px' }}>
          <div className="hero-badge" style={{ margin: '0 auto 16px', display: 'inline-flex' }}>
            <Sparkles size={14} style={{ marginRight: '6px' }} />
            <span>Interactive WebGL 3D Carousel (12 Blueprints)</span>
          </div>

          <h2 id="categories-heading" className="section-title">
            12 Battle-Tested Celebration Blueprints Engineered for Operational Calm
          </h2>

          <p className="section-subtitle">
            Pre-calibrated spending models, milestone timelines, and vendor interview criteria. Drag or click any 3D card below to rotate through 12 world-class event formats.
          </p>

          {/* Preset Selector Pill Group */}
          <div className="carousel-preset-pills" role="tablist" aria-label="Carousel 3D Lens Presets">
            <span className="preset-label">
              <Layers size={13} style={{ marginRight: '4px' }} />
              WebGL Lens Preset:
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

        {/* Complete Blueprint Content Card Grid (All 12 Events Clickable) */}
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
                <div
                  className="category-card-icon"
                  style={{
                    backgroundColor: 'var(--orange-100)',
                    color: cat.color,
                  }}
                >
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
