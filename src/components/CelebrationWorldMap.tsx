import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import {
  Calendar,
  ArrowRight,
  Search,
  MessageSquare,
  Users,
  MapPin,
  Compass,
  RotateCw,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { playPopSound } from '../utils/audio';
import { openFestiAIChat } from './FestiChatbot';
import type { EventPlanningContext } from '../data/globalCelebrations';

export interface WorldCelebrationPin {
  id: string;
  name: string;
  location: string;
  country: string;
  flag: string;
  region: 'Americas' | 'Europe' | 'Asia & Pacific' | 'Middle East & Africa';
  dates: string;
  month: string;
  daysUntil: number;
  localCurrencyCode: string;
  localCurrencySymbol: string;
  estBudgetLocal: number;
  estBudgetUSD: number;
  guestRange: string;
  categoryKey: string;
  categoryLabel: string;
  tagline: string;
  logisticsHighlight: string;
  lat: number;
  lon: number;
  color: string;
  aiPrompt: string;
}

export const WORLD_CELEBRATION_PINS: WorldCelebrationPin[] = [
  {
    id: 'rio_carnival',
    name: 'Rio Carnival Spectacular',
    location: 'Rio de Janeiro',
    country: 'Brazil',
    flag: '🇧🇷',
    region: 'Americas',
    dates: 'Feb 12 – Feb 17, 2027',
    month: 'February 2027',
    daysUntil: 108,
    localCurrencyCode: 'BRL',
    localCurrencySymbol: 'R$ ',
    estBudgetLocal: 120000,
    estBudgetUSD: 24000,
    guestRange: '150–500 Guests',
    categoryKey: 'festival',
    categoryLabel: 'Music & Street Festivals',
    tagline: 'Samba pavilions, feijoada banquets & sunset seaside parades',
    logisticsHighlight: 'Acoustic containment barriers needed for live batucada percussion bands past 2:00 AM.',
    lat: -22.9,
    lon: -43.1,
    color: '#FF5E1E',
    aiPrompt: 'Plan a vibrant Rio Carnival celebration with Brazilian churrasco catering, samba band timelines, and costume staging lounges.',
  },
  {
    id: 'diwali_delhi',
    name: 'Diwali Festival of Lights',
    location: 'New Delhi & Jaipur',
    country: 'India',
    flag: '🇮🇳',
    region: 'Asia & Pacific',
    dates: 'Oct 31 – Nov 4, 2026',
    month: 'November 2026',
    daysUntil: 18,
    localCurrencyCode: 'INR',
    localCurrencySymbol: '₹',
    estBudgetLocal: 1540000,
    estBudgetUSD: 18500,
    guestRange: '250–600 Guests',
    categoryKey: 'cultural_fest',
    categoryLabel: 'Heritage Festivals',
    tagline: 'Illuminated Diya courtyards, floral rangoli & royal sweets banquets',
    logisticsHighlight: 'Requires certified fire marshal review for outdoor sparklers and 48-hr ghee lamp vendor permits.',
    lat: 28.6,
    lon: 77.2,
    color: '#F59E0B',
    aiPrompt: 'Generate a royal Diwali gala blueprint with courtyard lighting layouts, 5-course artisanal vegetarian menus, and sparkler safety protocols.',
  },
  {
    id: 'hanami_kyoto',
    name: 'Hanami Cherry Blossom Gala',
    location: 'Kyoto & Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    region: 'Asia & Pacific',
    dates: 'Mar 25 – Apr 2, 2027',
    month: 'March 2027',
    daysUntil: 148,
    localCurrencyCode: 'JPY',
    localCurrencySymbol: '¥',
    estBudgetLocal: 2250000,
    estBudgetUSD: 14500,
    guestRange: '80–200 Guests',
    categoryKey: 'cultural_fest',
    categoryLabel: 'Heritage Festivals',
    tagline: 'Night Sakura canopy, wagashi dessert tasting & sake sommelier flights',
    logisticsHighlight: 'Park picnic zoning permits must be booked 90 days ahead; requires zero-waste pack-out protocol.',
    lat: 35.0,
    lon: 135.7,
    color: '#EC4899',
    aiPrompt: 'Design a serene Hanami cherry blossom event with illuminated night Sakura trees, sake tasting flights, and zero-waste bento catering.',
  },
  {
    id: 'venice_carnival',
    name: 'Venetian Masquerade Regatta',
    location: 'Venice',
    country: 'Italy',
    flag: '🇮🇹',
    region: 'Europe',
    dates: 'Feb 20 – Mar 2, 2027',
    month: 'February 2027',
    daysUntil: 115,
    localCurrencyCode: 'EUR',
    localCurrencySymbol: '€',
    estBudgetLocal: 20200,
    estBudgetUSD: 22000,
    guestRange: '100–300 Guests',
    categoryKey: 'anniversary',
    categoryLabel: 'Galas & Anniversaries',
    tagline: 'Grand Canal gondola processions & candlelit palazzo masquerade balls',
    logisticsHighlight: 'Water taxi charter permits and tidal surge (Acqua Alta) emergency gangways required for palazzo entrances.',
    lat: 45.4,
    lon: 12.3,
    color: '#5B42F3',
    aiPrompt: 'Architect an authentic Venetian masquerade ball inside a historic palazzo with chamber music, wine pairings, and gondola arrival schedules.',
  },
  {
    id: 'midsummer_uk',
    name: 'Midsummer Solstice Gathering',
    location: 'Somerset & Wiltshire',
    country: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    dates: 'Jun 18 – Jun 22, 2027',
    month: 'June 2027',
    daysUntil: 234,
    localCurrencyCode: 'GBP',
    localCurrencySymbol: '£',
    estBudgetLocal: 16800,
    estBudgetUSD: 21500,
    guestRange: '150–400 Guests',
    categoryKey: 'festival',
    categoryLabel: 'Music Festivals',
    tagline: 'Wildflower meadows, solar acoustic stages & artisanal cider bars',
    logisticsHighlight: 'Temporary field power generators must comply with eco-friendly biodiesel noise dampening guidelines.',
    lat: 51.1,
    lon: -2.7,
    color: '#10B981',
    aiPrompt: 'Build a 4-day Midsummer Solstice celebration with wildflower crown workshops, organic cider bars, and sunset acoustic timelines.',
  },
  {
    id: 'sydney_nye',
    name: 'Harbour Midnight Gala',
    location: 'Sydney Harbour',
    country: 'Australia',
    flag: '🇦🇺',
    region: 'Asia & Pacific',
    dates: 'Dec 31, 2026 – Jan 3, 2027',
    month: 'December 2026',
    daysUntil: 65,
    localCurrencyCode: 'AUD',
    localCurrencySymbol: 'A$ ',
    estBudgetLocal: 42500,
    estBudgetUSD: 28000,
    guestRange: '200–800 Guests',
    categoryKey: 'anniversary',
    categoryLabel: 'Galas & Anniversaries',
    tagline: 'Rooftop champagne, synchronized pyrotechnics & midnight countdowns',
    logisticsHighlight: 'Harbour waterfront maritime authority permits and load-in freight elevator bookings required 60 days prior.',
    lat: -33.8,
    lon: 151.2,
    color: '#0284C7',
    aiPrompt: 'Design an ultra-luxurious New Year rooftop ball overlooking Sydney Harbour with synchronized countdown lighting and seafood bar logistics.',
  },
  {
    id: 'oaxaca_dead',
    name: 'Día de los Muertos & Mezcal Tastings',
    location: 'Oaxaca & Mexico City',
    country: 'Mexico',
    flag: '🇲🇽',
    region: 'Americas',
    dates: 'Oct 31 – Nov 3, 2026',
    month: 'November 2026',
    daysUntil: 18,
    localCurrencyCode: 'MXN',
    localCurrencySymbol: 'Mex$ ',
    estBudgetLocal: 185000,
    estBudgetUSD: 12500,
    guestRange: '80–250 Guests',
    categoryKey: 'wine_tasting',
    categoryLabel: 'Private Tastings',
    tagline: 'Cempasúchil marigold arches, copal incense, mole tasting flights & artisanal mezcal',
    logisticsHighlight: 'Secure local culinary masters for traditional slow-cooked moles 30 days ahead; open flame candle zoning permits.',
    lat: 17.0,
    lon: -96.7,
    color: '#EA580C',
    aiPrompt: 'Create a heartfelt Día de los Muertos culinary gathering with 7-mole tasting flights, marigold table runners, and artisanal mezcal sommelier pairings.',
  },
  {
    id: 'nola_mardi_gras',
    name: 'Mardi Gras & Brass Heritage Gala',
    location: 'New Orleans',
    country: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    dates: 'Feb 5 – Feb 9, 2027',
    month: 'February 2027',
    daysUntil: 100,
    localCurrencyCode: 'USD',
    localCurrencySymbol: '$',
    estBudgetLocal: 15000,
    estBudgetUSD: 15000,
    guestRange: '120–350 Guests',
    categoryKey: 'festival',
    categoryLabel: 'Music Festivals',
    tagline: 'French Quarter second-line brass, crawfish boils & beignet brunches',
    logisticsHighlight: 'Second-line parade police escort permits must be registered with the New Orleans Police Department 45 days prior.',
    lat: 29.9,
    lon: -90.0,
    color: '#8B5CF6',
    aiPrompt: 'Plan an electric New Orleans Mardi Gras weekend with private balcony access, authentic brass band parade pacing, and Cajun seafood catering.',
  },
  {
    id: 'vienna_ball',
    name: 'Imperial Opera Ball & Banquet',
    location: 'Vienna',
    country: 'Austria',
    flag: '🇦🇹',
    region: 'Europe',
    dates: 'Feb 11 – Feb 14, 2027',
    month: 'February 2027',
    daysUntil: 107,
    localCurrencyCode: 'EUR',
    localCurrencySymbol: '€',
    estBudgetLocal: 26000,
    estBudgetUSD: 28000,
    guestRange: '150–400 Guests',
    categoryKey: 'wedding',
    categoryLabel: 'Luxury Weddings',
    tagline: 'Habsburg state rooms, white-tie waltzes, Sachertorte banquets & midnight quadrilles',
    logisticsHighlight: 'White-tie dress code verification concierge and antique parquet dance floor protection insurance mandatory.',
    lat: 48.2,
    lon: 16.3,
    color: '#6366F1',
    aiPrompt: 'Generate a royal Viennese waltz celebration master plan with string orchestra riders, white-tie protocols, and multi-course Austrian pastry stations.',
  },
  {
    id: 'songkran_thai',
    name: 'Songkran Water Blessing Festival',
    location: 'Chiang Mai & Bangkok',
    country: 'Thailand',
    flag: '🇹🇭',
    region: 'Asia & Pacific',
    dates: 'Apr 13 – Apr 16, 2027',
    month: 'April 2027',
    daysUntil: 168,
    localCurrencyCode: 'THB',
    localCurrencySymbol: '฿',
    estBudgetLocal: 420000,
    estBudgetUSD: 13200,
    guestRange: '100–350 Guests',
    categoryKey: 'cultural_fest',
    categoryLabel: 'Heritage Festivals',
    tagline: 'Jasmine scented water blessing ceremonies, night markets & tropical DJ stages',
    logisticsHighlight: 'IP68 waterproof cabling for all electrical equipment and high-flow clean water storage bowsers.',
    lat: 18.7,
    lon: 98.9,
    color: '#06B6D4',
    aiPrompt: 'Design a Songkran tropical holiday celebration balancing traditional water blessing rituals with energetic poolside evening music festivals.',
  },
  {
    id: 'thanksgiving_ny',
    name: 'Thanksgiving Starlight Harvest Banquet',
    location: 'Hudson Valley & New York',
    country: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    dates: 'Nov 26 – Nov 29, 2026',
    month: 'November 2026',
    daysUntil: 29,
    localCurrencyCode: 'USD',
    localCurrencySymbol: '$',
    estBudgetLocal: 11000,
    estBudgetUSD: 11000,
    guestRange: '60–180 Guests',
    categoryKey: 'birthday',
    categoryLabel: 'Milestone Birthdays',
    tagline: 'Farm-to-table roast feasts, artisanal mulled cider & starlight heated marquees',
    logisticsHighlight: 'Lock heritage turkey and roast orders 45 days prior; arrange heated outdoor dining marquee with thermal windbreakers.',
    lat: 41.7,
    lon: -73.9,
    color: '#D97706',
    aiPrompt: 'Plan an unforgettable 4-day Thanksgiving family and alumni reunion with harvest menus, cozy seating layouts, and run-of-show schedule.',
  },
  {
    id: 'seville_feria',
    name: 'Feria de Abril & Flamenco Fiesta',
    location: 'Seville',
    country: 'Spain',
    flag: '🇪🇸',
    region: 'Europe',
    dates: 'Apr 20 – Apr 25, 2027',
    month: 'April 2027',
    daysUntil: 174,
    localCurrencyCode: 'EUR',
    localCurrencySymbol: '€',
    estBudgetLocal: 19000,
    estBudgetUSD: 20500,
    guestRange: '100–300 Guests',
    categoryKey: 'wedding',
    categoryLabel: 'Luxury Weddings',
    tagline: 'Striped caseta pavilions, Manzanilla sherry, flamenco guitars & paper lanterns',
    logisticsHighlight: 'Municipal fairground caseta access badges and private equestrian carriage permits require 90-day booking lead.',
    lat: 37.3,
    lon: -5.9,
    color: '#F97316',
    aiPrompt: 'Architect a Spanish Feria celebration with authentic private caseta layouts, tapas catering, flamenco performers, and late-night churros.',
  },
  {
    id: 'marrakech_solstice',
    name: 'Marrakech Oasis Lantern Gala',
    location: 'Marrakech',
    country: 'Morocco',
    flag: '🇲🇦',
    region: 'Middle East & Africa',
    dates: 'Dec 18 – Dec 22, 2026',
    month: 'December 2026',
    daysUntil: 51,
    localCurrencyCode: 'MAD',
    localCurrencySymbol: 'MAD ',
    estBudgetLocal: 135000,
    estBudgetUSD: 16500,
    guestRange: '80–220 Guests',
    categoryKey: 'anniversary',
    categoryLabel: 'Galas & Anniversaries',
    tagline: 'Illuminated riad courtyards, Berber acoustic lutes, tagine banquets & starlight desert camps',
    logisticsHighlight: 'Agafay desert luxury transport 4x4 permits and fire lantern safety clearances required.',
    lat: 31.6,
    lon: -8.0,
    color: '#EAB308',
    aiPrompt: 'Design an opulent Marrakech riad anniversary gala with Berber acoustic musicians, traditional Moroccan banquets, and desert stargazing logistics.',
  },
];

// Helper to format event budget specifically in its local region currency
export function formatLocalRegionalBudget(pin: WorldCelebrationPin): {
  localFormatted: string;
  usdBenchmark: string;
} {
  let localFormatted = '';
  if (pin.localCurrencyCode === 'INR') {
    localFormatted = `${pin.localCurrencySymbol}${pin.estBudgetLocal.toLocaleString('en-IN')}`;
  } else if (pin.localCurrencyCode === 'JPY') {
    localFormatted = `${pin.localCurrencySymbol}${pin.estBudgetLocal.toLocaleString('ja-JP')}`;
  } else {
    localFormatted = `${pin.localCurrencySymbol}${pin.estBudgetLocal.toLocaleString('en-US')}`;
  }
  const usdBenchmark = `≈ $${pin.estBudgetUSD.toLocaleString()} USD`;
  return { localFormatted, usdBenchmark };
}

// Precise Continent SVG path data used to paint the procedural Globe canvas texture
const CONTINENT_PATHS = [
  "M 32,69.4 L 53.3,52.8 L 80,55.6 L 133.3,55.6 L 173.3,61.1 L 226.7,55.6 L 266.7,77.8 L 280,88.9 L 320,111.1 L 333.3,116.7 L 320,122.2 L 304,127.8 L 293.3,133.3 L 282.7,144.4 L 277.3,155.6 L 266.7,180.6 L 261.3,172.2 L 245.3,166.7 L 226.7,169.4 L 221.3,177.8 L 240,191.7 L 245.3,205.6 L 258.7,222.2 L 274.7,227.8 L 266.7,225 L 253.3,216.7 L 226.7,205.6 L 200,194.4 L 186.7,183.3 L 173.3,166.7 L 160,155.6 L 149.3,138.9 L 149.3,116.7 L 133.3,100 L 117.3,88.9 L 80,83.3 L 53.3,94.4 L 37.3,83.3 L 32,69.4 Z",
  "M 360,19.4 L 413.3,22.2 L 432,36.1 L 421.3,55.6 L 386.7,69.4 L 362.7,83.3 L 346.7,72.2 L 333.3,55.6 L 320,38.9 L 333.3,22.2 L 360,19.4 Z",
  "M 274.7,227.8 L 288,216.7 L 314.7,219.4 L 346.7,244.4 L 362.7,258.3 L 384,266.7 L 386.7,275 L 376,291.7 L 368,311.1 L 352,322.2 L 341.3,338.9 L 325.3,347.2 L 312,361.1 L 304,377.8 L 301.3,400 L 288,400 L 282.7,388.9 L 282.7,366.7 L 288,344.4 L 290.7,322.2 L 277.3,300 L 266.7,263.9 L 264,255.6 L 272,241.7 L 274.7,227.8 Z",
  "M 456,150 L 456,130.6 L 474.7,127.8 L 488,119.4 L 485.3,108.3 L 493.3,102.8 L 501.3,100 L 493.3,88.9 L 493.3,77.8 L 512,69.4 L 520,58.3 L 546.7,52.8 L 562.7,55.6 L 560,69.4 L 538.7,83.3 L 528,88.9 L 512,97.2 L 528,100 L 538.7,100 L 554.7,94.4 L 565.3,105.6 L 560,122.2 L 554.7,133.3 L 544,144.4 L 538.7,150 L 544,138.9 L 522.7,138.9 L 520,144.4 L 512,133.3 L 504,127.8 L 488,133.3 L 472,138.9 L 464,150 L 456,150 Z",
  "M 466.7,111.1 L 477.3,108.3 L 482.7,105.6 L 480,100 L 474.7,91.7 L 469.3,88.9 L 466.7,94.4 L 472,102.8 L 466.7,111.1 Z",
  "M 453.3,105.6 L 464,105.6 L 464,97.2 L 453.3,100 L 453.3,105.6 Z",
  "M 464,150 L 485.3,150 L 506.7,147.2 L 512,158.3 L 538.7,161.1 L 565.3,163.9 L 570.7,175 L 581.3,188.9 L 594.7,216.7 L 616,222.2 L 608,236.1 L 592,255.6 L 586.7,277.8 L 576,305.6 L 565.3,327.8 L 554.7,341.7 L 528,344.4 L 522.7,333.3 L 512,311.1 L 512,288.9 L 504,261.1 L 488,238.9 L 488,233.3 L 469.3,236.1 L 448,227.8 L 434.7,216.7 L 434.7,205.6 L 445.3,183.3 L 453.3,166.7 L 464,150 Z",
  "M 610.7,283.3 L 616,291.7 L 608,319.4 L 597.3,319.4 L 597.3,300 L 610.7,283.3 Z",
  "M 565.3,105.6 L 586.7,97.2 L 613.3,97.2 L 640,83.3 L 666.7,50 L 720,44.4 L 773.3,47.2 L 840,52.8 L 880,52.8 L 933.3,63.9 L 960,66.7 L 920,83.3 L 896,105.6 L 858.7,111.1 L 832,130.6 L 821.3,144.4 L 805.3,166.7 L 800,183.3 L 768,194.4 L 762.7,222.2 L 746.7,238.9 L 741.3,227.8 L 725.3,205.6 L 714.7,188.9 L 693.3,205.6 L 688,225 L 677.3,208.3 L 666.7,186.1 L 640,180.6 L 626.7,186.1 L 634.7,194.4 L 624,205.6 L 608,211.1 L 597.3,216.7 L 576,188.9 L 570.7,175 L 573.3,158.3 L 576,150 L 586.7,133.3 L 608,138.9 L 618.7,127.8 L 608,116.7 L 565.3,105.6 Z",
  "M 853.3,125 L 866.7,127.8 L 858.7,138.9 L 853.3,150 L 842.7,155.6 L 826.7,161.1 L 832,155.6 L 848,144.4 L 853.3,125 Z",
  "M 789.3,277.8 L 821.3,277.8 L 853.3,291.7 L 885.3,300 L 874.7,322.2 L 853.3,344.4 L 826.7,344.4 L 805.3,327.8 L 794.7,305.6 L 789.3,277.8 Z",
  "M 901.3,347.2 L 917.3,355.6 L 912,377.8 L 896,366.7 L 901.3,347.2 Z",
];

// Generate procedural equirectangular texture with brand mascot colors (zero black!)
function createProceduralGlobeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Warm plush apricot & peach cream base (Zero black, branded warmth)
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  oceanGrad.addColorStop(0, '#FFEBDD');
  oceanGrad.addColorStop(0.3, '#FFF5ED');
  oceanGrad.addColorStop(0.5, '#FFFDFB');
  oceanGrad.addColorStop(0.7, '#FFF5ED');
  oceanGrad.addColorStop(1, '#FFEBDD');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // 2. Graticules / latitude & longitude grid lines in delicate soft coral
  ctx.strokeStyle = 'rgba(255, 94, 30, 0.12)';
  ctx.lineWidth = 1.2;

  // Latitudes
  for (let lat = 0; lat <= 1024; lat += 64) {
    ctx.beginPath();
    ctx.moveTo(0, lat);
    ctx.lineTo(2048, lat);
    ctx.stroke();
  }
  // Longitudes
  for (let lon = 0; lon <= 2048; lon += 64) {
    ctx.beginPath();
    ctx.moveTo(lon, 0);
    ctx.lineTo(lon, 1024);
    ctx.stroke();
  }

  // Equator highlight in vibrant festive brand orange
  ctx.strokeStyle = 'rgba(255, 94, 30, 0.32)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 512);
  ctx.lineTo(2048, 512);
  ctx.stroke();

  // 3. Draw continents in plush mascot terracotta orange & sunset coral
  ctx.save();
  ctx.scale(2048 / 960, 1024 / 500);

  CONTINENT_PATHS.forEach((svgD) => {
    try {
      const p = new Path2D(svgD);
      // Soft plush shadow
      ctx.shadowColor = 'rgba(255, 94, 30, 0.25)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#FF6B4A';
      ctx.fill(p);

      // Continent coast outline in bright peach gold
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#FFA756';
      ctx.lineWidth = 2.2;
      ctx.stroke(p);
    } catch {
      // Fallback
    }
  });

  ctx.restore();

  // 4. Sparkling festival starburst points across celebration capitals
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  for (let i = 0; i < 90; i++) {
    const rx = Math.random() * 2048;
    const ry = Math.random() * 1024;
    ctx.beginPath();
    ctx.arc(rx, ry, Math.random() * 1.8 + 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Convert Lat/Lon to 3D spherical Cartesian coordinates
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

interface CelebrationWorldMapProps {
  reducedMotion?: boolean;
  currentCurrency?: string;
  onSelectEventForPlanner: (occasionId: string, eventName: string, context?: EventPlanningContext) => void;
}

export const CelebrationWorldMap: React.FC<CelebrationWorldMapProps> = ({
  reducedMotion = false,
  onSelectEventForPlanner,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<
    'All' | 'Americas' | 'Europe' | 'Asia & Pacific' | 'Middle East & Africa'
  >('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePinId, setActivePinId] = useState<string>('rio_carnival');
  const [autoRotate, setAutoRotate] = useState(!reducedMotion);

  // 3D Canvas Ref & Label Positions state
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Screen projected coordinates for interactive 2D labels floating on the 3D globe
  const [labelCoords, setLabelCoords] = useState<
    Array<{
      id: string;
      name: string;
      location: string;
      flag: string;
      color: string;
      x: number;
      y: number;
      visible: boolean;
    }>
  >([]);

  // Filtered Pins based on region & search
  const filteredPins = useMemo(() => {
    return WORLD_CELEBRATION_PINS.filter((pin) => {
      const matchesRegion = selectedRegion === 'All' || pin.region === selectedRegion;
      const matchesSearch =
        searchQuery === '' ||
        pin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.country.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [selectedRegion, searchQuery]);

  // Active pin object
  const activePin = useMemo(() => {
    return (
      filteredPins.find((p) => p.id === activePinId) ||
      WORLD_CELEBRATION_PINS.find((p) => p.id === activePinId) ||
      filteredPins[0] ||
      WORLD_CELEBRATION_PINS[0]
    );
  }, [activePinId, filteredPins]);

  // Interactive Drag & Rotation State
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotVelocityRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number } | null>(null);

  // Smoothly rotate globe towards target pin
  const focusOnPin = useCallback((pin: WorldCelebrationPin) => {
    playPopSound(false);
    setActivePinId(pin.id);

    // Compute target rotation in radians so lat/lon faces camera
    // Target Y angle (longitude): lon + 180 degrees offset
    const targetY = -((pin.lon - 0) * (Math.PI / 180));
    const targetX = (pin.lat * (Math.PI / 180)) * 0.7; // slight tilt
    targetRotationRef.current = { x: targetX, y: targetY };
  }, []);

  // Three.js 3D Globe Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 420;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 240);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    // Append canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 2.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffecd5, 2.6);
    sunLight.position.set(160, 120, 180);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xff7a45, 1.5);
    rimLight.position.set(-160, -60, -100);
    scene.add(rimLight);

    // 3. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Sphere Geometry (radius 75)
    const globeRadius = 75;
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const globeTexture = createProceduralGlobeTexture();

    const sphereMat = new THREE.MeshPhysicalMaterial({
      map: globeTexture,
      roughness: 0.32,
      metalness: 0.04,
      clearcoat: 0.75,
      clearcoatRoughness: 0.18,
      transmission: 0.14,
      transparent: true,
      opacity: 0.96,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeMesh);

    // Atmosphere Glow Outer Shell (radius 78) in warm brand sunset peach
    const atmosGeo = new THREE.SphereGeometry(globeRadius + 3, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0xff7a45,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosMesh);

    // 4. Hotspot Pins on Sphere Surface (clean warm colors, NO bright red dots!)
    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    WORLD_CELEBRATION_PINS.forEach((pin) => {
      const pos = latLonToVector3(pin.lat, pin.lon, globeRadius + 1.2);

      // Elevated beacon head (radius 2.2)
      const beaconGeo = new THREE.SphereGeometry(2.2, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: pin.color || '#FF9E30',
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.copy(pos);
      pinGroup.add(beaconMesh);

      // Ground disc ring
      const ringGeo = new THREE.RingGeometry(1.8, 3.6, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: pin.color || '#FF9E30',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      pinGroup.add(ringMesh);
    });

    // 5. Initial angle facing Americas / Atlantic
    globeGroup.rotation.y = 0.6;
    globeGroup.rotation.x = 0.2;

    // 6. Animation Loop
    let lastTime = performance.now();

    const animate = (time: number) => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Handle smooth interpolation to target rotation
      if (targetRotationRef.current) {
        const tx = targetRotationRef.current.x;
        const ty = targetRotationRef.current.y;
        globeGroup.rotation.x += (tx - globeGroup.rotation.x) * 0.08;
        globeGroup.rotation.y += (ty - globeGroup.rotation.y) * 0.08;

        if (
          Math.abs(tx - globeGroup.rotation.x) < 0.002 &&
          Math.abs(ty - globeGroup.rotation.y) < 0.002
        ) {
          targetRotationRef.current = null;
        }
      } else if (!isDraggingRef.current) {
        // Apply inertia velocity
        globeGroup.rotation.y += rotVelocityRef.current.y;
        globeGroup.rotation.x += rotVelocityRef.current.x;
        rotVelocityRef.current.y *= 0.94;
        rotVelocityRef.current.x *= 0.94;

        // Auto-rotation if enabled and stationary
        if (autoRotate && Math.abs(rotVelocityRef.current.y) < 0.001) {
          globeGroup.rotation.y += delta * 0.15;
        }
      }

      // Clamp X tilt
      globeGroup.rotation.x = Math.max(-0.65, Math.min(0.65, globeGroup.rotation.x));

      // Render Three.js Scene
      renderer.render(scene, camera);

      // Project 3D Hotspot Coordinates to 2D Screen for HTML Overlay Tags
      if (camera && container) {
        const cWidth = container.clientWidth;
        const cHeight = container.clientHeight;
        const camDir = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);

        const newCoords = WORLD_CELEBRATION_PINS.map((pin) => {
          const localPos = latLonToVector3(pin.lat, pin.lon, globeRadius + 2.5);
          const worldPos = localPos.clone().applyMatrix4(globeGroup.matrixWorld);

          // Check if on front side facing camera
          const normal = worldPos.clone().normalize();
          const dot = normal.dot(camDir);
          const isFront = dot > 0.15;

          // Project to 2D screen
          const proj = worldPos.project(camera);
          const screenX = ((proj.x + 1) / 2) * cWidth;
          const screenY = ((-proj.y + 1) / 2) * cHeight;

          return {
            id: pin.id,
            name: pin.name,
            location: pin.location.split('&')[0].trim(),
            flag: pin.flag,
            color: pin.color,
            x: screenX,
            y: screenY,
            visible: isFront,
          };
        });

        setLabelCoords(newCoords);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // 7. Mouse / Touch Drag Handlers
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      targetRotationRef.current = null;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
      rotVelocityRef.current = { x: 0, y: 0 };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      globeGroup.rotation.y += dx * 0.007;
      globeGroup.rotation.x += dy * 0.007;
      rotVelocityRef.current = { x: dy * 0.002, y: dx * 0.002 };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        targetRotationRef.current = null;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        rotVelocityRef.current = { x: 0, y: 0 };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMouseRef.current.x;
      const dy = e.touches[0].clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      globeGroup.rotation.y += dx * 0.009;
      globeGroup.rotation.x += dy * 0.009;
      rotVelocityRef.current = { x: dy * 0.002, y: dx * 0.002 };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    // Resize Observer
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });
    ro.observe(container);

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Cleanup
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      sphereGeo.dispose();
      sphereMat.dispose();
      globeTexture.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      renderer.dispose();
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, [autoRotate]);

  // Zoom Controls
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

  const budgetDisplay = formatLocalRegionalBudget(activePin);

  return (
    <section className="celebration-world-section" aria-labelledby="world-globe-title">
      <div className="celebration-world-card">
        {/* SECTION HEADER */}
        <div className="celebration-world-header">
          <div>
            <div className="celebration-badge-pill">
              <Compass size={13} aria-hidden="true" />
              <span>Interactive 3D Celebration Globe</span>
            </div>
            <h2 id="world-globe-title" className="celebration-world-title">
              Global Celebrations &amp; Cultural Long Weekends
            </h2>
            <p className="celebration-world-subtitle">
              Spin the 3D globe to explore iconic festivals with native local currency valuations calibrated to regional vendor economics.
            </p>
          </div>

          {/* Quick Globe Controls */}
          <div className="globe-controls-pill-group">
            <button
              type="button"
              className={`mode-toggle-btn ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
            >
              <RotateCw size={13} className={autoRotate ? 'spin-icon' : ''} />
              <span>{autoRotate ? 'Spinning' : 'Paused'}</span>
            </button>
            <button
              type="button"
              className="mode-toggle-btn"
              onClick={() => handleZoom('in')}
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            <button
              type="button"
              className="mode-toggle-btn"
              onClick={() => handleZoom('out')}
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <button
              type="button"
              className="mode-toggle-btn"
              onClick={handleResetRotation}
              title="Reset View"
            >
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* REGION FILTER BAR & SEARCH */}
        <div className="celebration-filter-bar">
          <div className="region-pills" role="tablist" aria-label="Filter by region">
            {(['All', 'Americas', 'Europe', 'Asia & Pacific', 'Middle East & Africa'] as const).map((r) => (
              <button
                key={r}
                type="button"
                className={`region-pill-btn ${selectedRegion === r ? 'active' : ''}`}
                onClick={() => {
                  setSelectedRegion(r);
                  if (r !== 'All') {
                    const firstMatch = WORLD_CELEBRATION_PINS.find((p) => p.region === r);
                    if (firstMatch) {
                      focusOnPin(firstMatch);
                    }
                  }
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="celebration-search-wrap">
            <Search size={14} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              className="celebration-search-input"
              placeholder="Search festival, city, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search celebration destinations"
            />
          </div>
        </div>

        {/* 3D GLOBE CANVAS & DOSSIER GRID */}
        <div className="celebration-grid-body">
          {/* LEFT: 3D GLOBE CONTAINER */}
          <div className="celebration-visual-canvas globe-canvas-wrapper">
            {/* The WebGL 3D Globe renders here */}
            <div
              ref={mountRef}
              className="three-globe-container"
              style={{ width: '100%', height: '440px', cursor: 'grab' }}
            />

            {/* Interactive Projected HTML Labels Floating on Front Hemisphere */}
            <div className="globe-labels-overlay" aria-hidden="true">
              {labelCoords.map((label) => {
                if (!label.visible) return null;
                const isSelected = label.id === activePin.id;
                const pinData = WORLD_CELEBRATION_PINS.find((p) => p.id === label.id);
                return (
                  <button
                    key={label.id}
                    type="button"
                    className={`globe-floating-pin-badge ${isSelected ? 'active-pin' : ''}`}
                    style={{
                      left: `${label.x}px`,
                      top: `${label.y}px`,
                      transform: 'translate(-50%, -100%)',
                      borderColor: isSelected ? '#5B42F3' : 'rgba(255, 158, 48, 0.45)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (pinData) focusOnPin(pinData);
                    }}
                  >
                    <span className="globe-pin-beacon" style={{ background: label.color }} />
                    <span className="globe-pin-flag">{label.flag}</span>
                    <span className="globe-pin-city">{label.location}</span>
                  </button>
                );
              })}
            </div>

            {/* Hint overlay */}
            <div className="map-region-hint">
              <span>Drag to spin 3D globe • Click city beacon to inspect celebration</span>
            </div>
          </div>

          {/* RIGHT: REGIONAL CELEBRATION DOSSIER CARD */}
          <div className="celebration-dossier-card">

            <div className="dossier-header-row">
              <span className="dossier-category-pill">{activePin.categoryLabel}</span>
              <span className="dossier-countdown-pill">
                <Calendar size={13} aria-hidden="true" />
                <span>In {activePin.daysUntil} days</span>
              </span>
            </div>

            <div className="dossier-title-block">
              <div className="dossier-flag-location">
                <span className="dossier-flag">{activePin.flag}</span>
                <span className="dossier-location">
                  {activePin.location}, {activePin.country}
                </span>
              </div>
              <h3 className="dossier-title">{activePin.name}</h3>
              <p className="dossier-tagline">{activePin.tagline}</p>
            </div>

            <div className="dossier-specs-grid">
              <div className="dossier-spec-item">
                <span className="spec-label">Calendar Dates</span>
                <span className="spec-val">
                  <Calendar size={14} className="spec-icon" aria-hidden="true" />
                  {activePin.dates}
                </span>
              </div>

              {/* Specific Regional Native Valuation (NO forced Rupees!) */}
              <div className="dossier-spec-item regional-valuation-highlight">
                <span className="spec-label">Local Market Valuation</span>
                <div className="regional-currency-block">
                  <span className="spec-val highlight-gold">
                    {budgetDisplay.localFormatted}
                  </span>
                  <span className="currency-code-pill">{activePin.localCurrencyCode}</span>
                </div>
                <span className="spec-usd-benchmark">{budgetDisplay.usdBenchmark}</span>
              </div>

              <div className="dossier-spec-item">
                <span className="spec-label">Expected Attendance</span>
                <span className="spec-val">
                  <Users size={14} className="spec-icon" aria-hidden="true" />
                  {activePin.guestRange}
                </span>
              </div>

              <div className="dossier-spec-item">
                <span className="spec-label">Regional Destination</span>
                <span className="spec-val">{activePin.region}</span>
              </div>
            </div>

            <div className="dossier-logistics-box">
              <div className="logistics-title-row">
                <MapPin size={14} className="logistics-icon" aria-hidden="true" />
                <span>Key Logistics Safeguard</span>
              </div>
              <p className="logistics-text">{activePin.logisticsHighlight}</p>
            </div>

            <div className="dossier-actions-row">
              <button
                type="button"
                className="btn btn-primary dossier-btn-primary"
                onClick={handlePlanThisEvent}
              >
                <span>Plan this celebration</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>

              <button
                type="button"
                className="btn btn-secondary dossier-btn-ai"
                onClick={() => openFestiAIChat(activePin.aiPrompt)}
                title="Ask Festi AI about this event"
              >
                <MessageSquare size={15} aria-hidden="true" />
                <span>Ask Festi AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM QUICK-SWITCH DESTINATION CAROUSEL STRIP */}
        <div className="globe-destinations-strip">
          <div className="destinations-strip-header">
            <span className="strip-title">Featured World Destinations</span>
            <span className="strip-count">{filteredPins.length} Celebrations</span>
          </div>
          <div className="destinations-scroll-track">
            {filteredPins.map((pin) => {
              const isSelected = pin.id === activePin.id;
              const { localFormatted } = formatLocalRegionalBudget(pin);
              return (
                <button
                  key={pin.id}
                  type="button"
                  className={`destination-chip ${isSelected ? 'active' : ''}`}
                  onClick={() => focusOnPin(pin)}
                >
                  <span className="chip-flag">{pin.flag}</span>
                  <div className="chip-info">
                    <span className="chip-name">{pin.name}</span>
                    <span className="chip-cost">{localFormatted} ({pin.localCurrencyCode})</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
