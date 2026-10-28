import React, { isValidElement, useMemo, type CSSProperties } from 'react';
import './GridMotion.css';
import {
  type GridMotionItem,
  type TileData,
  EMPTY,
  clamp,
  feather,
  GridMotionPlane,
} from './GridMotionPlane';
import { useGridMotion, type GridMotionSettings } from './useGridMotion';

export { type GridMotionItem };

export interface GridMotionTheme {
  tile: string;
  text: string;
  border: string;
}

const THEMES: Record<'dark' | 'light', GridMotionTheme> = {
  dark: { tile: '#24140e', text: 'rgba(255, 255, 255, 0.85)', border: 'rgba(255, 255, 255, 0.1)' },
  light: { tile: '#f5efe6', text: '#2d1810', border: 'rgba(45, 24, 16, 0.1)' },
};

const IMAGE = /^(https?:\/\/|\/\/|\/|\.\.?\/|data:image\/|blob:)|\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i;

function toTile(item: GridMotionItem): TileData {
  if (!item) return EMPTY;
  if (isValidElement(item)) return { kind: 'node', node: item };
  if (typeof item === 'object' && 'src' in item) {
    return { kind: 'image', src: String(item.src), alt: item.alt || '' };
  }
  const text = String(item).trim();
  return IMAGE.test(text) ? { kind: 'image', src: text, alt: '' } : { kind: 'text', text };
}

export interface GridMotionProps {
  items?: GridMotionItem[];
  rows?: number;
  aspectRatio?: number;
  gap?: number;
  radius?: number;
  angle?: number;
  tilt?: number;
  speed?: number;
  direction?: 'alternate' | 'left' | 'right';
  parallax?: number;
  spotlight?: number;
  dim?: number;
  grayscale?: boolean;
  fade?: number;
  tileColor?: string;
  textColor?: string;
  theme?: 'dark' | 'light';
  className?: string;
  style?: CSSProperties;
}

export const GridMotion: React.FC<GridMotionProps> = ({
  items = [],
  rows = 4,
  aspectRatio = 1.33,
  gap = 16,
  radius = 14,
  angle = -12,
  tilt = 0,
  speed = 24,
  direction = 'alternate',
  parallax = 0.5,
  spotlight = 0.6,
  dim = 0.35,
  grayscale = false,
  fade = 0.5,
  tileColor,
  textColor,
  theme = 'dark',
  className = '',
  style,
}) => {
  const palette = THEMES[theme] || THEMES.dark;

  const settings: GridMotionSettings = {
    rows: clamp(Math.round(rows), 1, 12),
    aspect: clamp(aspectRatio, 0.3, 4),
    gap: Math.max(0, gap),
    angle,
    tilt: clamp(tilt, 0, 75),
    speed,
    direction,
    parallax: clamp(parallax, 0, 1),
    spotlight: clamp(spotlight, 0, 1),
    dim: clamp(dim, 0, 1),
    fade: clamp(fade, 0, 1),
  };

  const { rootRef, planeRef, layout } = useGridMotion(settings);
  const tiles = useMemo(() => items.map(toTile), [items]);

  const rowTiles = layout
    ? Array.from({ length: settings.rows }, (_, r) =>
        Array.from({ length: layout.perRow }, (_, j) =>
          tiles.length ? tiles[(r * layout.perRow + j) % tiles.length] : EMPTY
        )
      )
    : [];

  const mask =
    settings.fade > 0
      ? `${feather('to right', settings.fade * 34)}, ${feather('to bottom', settings.fade * 44)}`
      : undefined;

  const rootClass = ['grid-motion', grayscale && 'grid-motion--gray', className].filter(Boolean).join(' ');

  return (
    <div
      ref={rootRef}
      className={rootClass}
      style={
        {
          '--gm-tile': tileColor || palette.tile,
          '--gm-text': textColor || palette.text,
          '--gm-border': palette.border,
          '--gm-radius': `${Math.max(0, radius)}px`,
          '--gm-dim': settings.dim,
          perspective: layout && settings.tilt > 0 ? `${layout.perspective}px` : undefined,
          maskImage: mask,
          WebkitMaskImage: mask,
          maskComposite: mask ? 'intersect' : undefined,
          WebkitMaskComposite: mask ? 'source-in' : undefined,
          ...style,
        } as CSSProperties
      }
    >
      {layout && (
        <GridMotionPlane
          planeRef={planeRef}
          layout={layout}
          rowTiles={rowTiles}
          tilt={settings.tilt}
          angle={settings.angle}
          gap={settings.gap}
        />
      )}
    </div>
  );
};

export default GridMotion;
