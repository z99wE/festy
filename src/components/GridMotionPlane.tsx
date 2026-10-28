import { type CSSProperties, type ReactNode } from 'react';

export type GridMotionItem = string | ReactNode | { src: string; alt?: string };

export type TileData =
  | { kind: 'empty' }
  | { kind: 'node'; node: ReactNode }
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'text'; text: string };

export const EMPTY: TileData = { kind: 'empty' };

export const clamp = (val: number, min: number, max: number): number => Math.min(max, Math.max(min, val));
export const wrap = (val: number, tot: number): number => ((val % tot) + tot) % tot;
export const smoothstep = (e0: number, e1: number, val: number): number => {
  const t = clamp((val - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

export const feather = (side: string, zone: number): string => {
  const stops: string[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const alpha = t * t * t * (t * (t * 6 - 15) + 10);
    stops.push(`rgba(0, 0, 0, ${alpha.toFixed(4)}) ${(t * zone).toFixed(2)}%`);
  }
  const mirrored = stops.map((_, i) => {
    const t = (12 - i) / 12;
    const alpha = t * t * t * (t * (t * 6 - 15) + 10);
    return `rgba(0, 0, 0, ${alpha.toFixed(4)}) ${(100 - t * zone).toFixed(2)}%`;
  });
  return `linear-gradient(${side}, ${stops.join(', ')}, ${mirrored.join(', ')})`;
};

export function Tile({ tile }: { tile: TileData }) {
  if (tile.kind === 'image') {
    return (
      <div className="grid-motion__tile">
        <img
          src={tile.src}
          alt={tile.alt || 'Festiya Global Celebration Festival - Atmospheric cultural event gathering'}
          title={tile.alt || 'Global Celebration Showcase'}
          draggable={false}
          decoding="async"
          loading="lazy"
          width={320}
          height={228}
        />
      </div>
    );
  }

  if (tile.kind === 'text') {
    return (
      <div className="grid-motion__tile">
        <span className="grid-motion__text">{tile.text}</span>
      </div>
    );
  }

  if (tile.kind === 'node') {
    return <div className="grid-motion__tile">{tile.node}</div>;
  }

  return <div className="grid-motion__tile" />;
}

export interface GridPlaneLayout {
  planeWidth: number;
  planeHeight: number;
  tileWidth: number;
  tileHeight: number;
  step: number;
  perRow: number;
  period: number;
  copies: number;
  top: number;
  perspective: number;
}

interface GridMotionPlaneProps {
  planeRef: React.RefObject<HTMLDivElement | null>;
  layout: GridPlaneLayout;
  rowTiles: TileData[][];
  tilt: number;
  angle: number;
  gap: number;
}

export function GridMotionPlane({
  planeRef,
  layout,
  rowTiles,
  tilt,
  angle,
  gap,
}: GridMotionPlaneProps) {
  const planeStyle: CSSProperties = {
    width: layout.planeWidth,
    height: layout.planeHeight,
    transform: `translate(-50%, -50%) rotateX(${tilt}deg) rotateZ(${angle}deg)`,
    '--gm-gap': `${gap}px`,
    '--gm-tile-w': `${layout.tileWidth}px`,
    '--gm-tile-h': `${layout.tileHeight}px`,
    '--gm-font': `${clamp(layout.tileHeight * 0.12, 12, 32)}px`,
  } as CSSProperties;

  return (
    <div
      ref={planeRef}
      className="grid-motion__plane"
      aria-hidden="true"
      style={planeStyle}
    >
      {rowTiles.map((sequence, r) => (
        <div
          key={r}
          className="grid-motion__row"
          style={{ top: layout.top + r * (layout.tileHeight + gap) }}
        >
          {Array.from({ length: layout.copies * layout.perRow }, (_, k) => (
            <Tile key={k} tile={sequence[k % layout.perRow]} />
          ))}
        </div>
      ))}
    </div>
  );
}
