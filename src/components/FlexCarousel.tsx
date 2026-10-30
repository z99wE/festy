import React, { useEffect, useRef, useState } from 'react';
import './FlexCarousel.css';
import type { FlexCarouselItem } from '../data/flexCarouselPresets';
import {
  DEFAULT_ITEMS,
  BEND_PRESETS
} from '../data/flexCarouselPresets';
import { initFlexCarousel } from './flexCarouselEngine';

export type { FlexCarouselItem };

export interface FlexCarouselProps {
  items: FlexCarouselItem[] | undefined;
  preset: ('liquid' | 'ribbon' | 'vortex' | 'arch') | undefined;
  intro: ('rise' | 'bloom' | 'spin' | 'deal' | 'none') | undefined;
  cardHeight: number | undefined;
  gap: number | undefined;
  radius: number | undefined;
  fit: ('natural' | 'portrait' | 'square' | 'landscape') | undefined;
  lensWidth: number | undefined;
  lensHeight: number | undefined;
  tilt: number | undefined;
  roundness: number | undefined;
  bend: number | undefined;
  reach: number | undefined;
  curl: ('twist' | 'rise' | 'fall') | undefined;
  dispersion: number | undefined;
  liquid: number | undefined;
  followCursor: boolean | undefined;
  squeeze: number | undefined;
  focusOnClick: boolean | undefined;
  autoplay: boolean | undefined;
  interval: number | undefined;
  captions: boolean | undefined;
  captureWheel: boolean | undefined;
  onChange: ((index: number, item: FlexCarouselItem) => void) | undefined;
  onSelect: ((index: number, item: FlexCarouselItem) => void) | undefined;
  className: string | undefined;
  style: React.CSSProperties | undefined;
}

export const FlexCarousel: React.FC<Partial<FlexCarouselProps>> = (props) => {
  const {
    items = DEFAULT_ITEMS,
    preset = 'liquid',
    intro = 'rise',
    cardHeight = 0.5,
    gap = 12,
    radius = 0,
    fit = 'natural',
    lensWidth,
    lensHeight,
    tilt,
    roundness,
    bend,
    reach,
    curl,
    dispersion,
    liquid,
    followCursor,
    squeeze = 0.2,
    focusOnClick = true,
    autoplay = false,
    interval = 4,
    captions = true,
    captureWheel = true,
    onChange,
    onSelect,
    className = '',
    style
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<any>(null);
  const itemsRef = useRef(items);
  const engineRef = useRef<any>(null);
  const callbacksRef = useRef<{
    onChange: ((index: number, item: any) => void) | undefined;
    onSelect: ((index: number, item: any) => void) | undefined;
  }>({ onChange, onSelect });

  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [, setFocusOpen] = useState(false);

  const base = BEND_PRESETS[preset] ? BEND_PRESETS[preset] : BEND_PRESETS.liquid;
  const pick = (value: any, key: keyof typeof base) => (value === undefined ? base[key] : value);

  const list = items && items.length > 0 ? items : DEFAULT_ITEMS;
  const itemsKey = list.map(item => item.src).join('|');

  useEffect(() => {
    itemsRef.current = list;
    callbacksRef.current = { onChange, onSelect };
    settingsRef.current = {
      intro,
      cardHeight,
      gap,
      radius,
      fit,
      lensWidth: pick(lensWidth, 'lensWidth'),
      lensHeight: pick(lensHeight, 'lensHeight'),
      tilt: pick(tilt, 'tilt'),
      roundness: pick(roundness, 'roundness'),
      bend: pick(bend, 'bend'),
      reach: pick(reach, 'reach'),
      curl: pick(curl, 'curl'),
      dispersion: pick(dispersion, 'dispersion'),
      liquid: pick(liquid, 'liquid'),
      followCursor: pick(followCursor, 'followCursor'),
      squeeze,
      focusOnClick,
      autoplay,
      interval,
      captureWheel
    };
    if (engineRef.current) engineRef.current.wake();
  });

  useEffect(() => {
    if (engineRef.current) engineRef.current.setItems(itemsRef.current);
  }, [itemsKey]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const engine = initFlexCarousel({
      container,
      settingsRef,
      callbacksRef,
      setActive,
      setRevealed,
      setFocusOpen
    });

    if (!engine) return undefined;
    engineRef.current = engine;
    engine.setItems(itemsRef.current);

    return () => {
      engineRef.current = null;
      engine.destroy();
    };
  }, []);

  const current = list[active] ? list[active] : list[0];
  const label = current ? (current.title ? current.title : (current.alt ? current.alt : `Image ${active + 1}`)) : '';
  const halfHeightStyle = `${Math.min(Math.max(cardHeight, 0.05), 1) * 50}%`;

  return (
    <div
      ref={containerRef}
      className={`flex-carousel ${className}`.trim()}
      style={{ ...style, ['--flex-carousel-half' as any]: halfHeightStyle }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
      tabIndex={0}
    >
      {captions && current && revealed ? (
        <div className="flex-carousel__caption" aria-hidden="true">
          <span key={active} className="flex-carousel__title">
            {current.title ? current.title : current.alt}
            {current.subtitle ? <span className="flex-carousel__subtitle">{current.subtitle}</span> : null}
          </span>
        </div>
      ) : null}
      <div className="flex-carousel__live" aria-live="polite" aria-atomic="true">
        {label}
      </div>
    </div>
  );
};

export default FlexCarousel;
