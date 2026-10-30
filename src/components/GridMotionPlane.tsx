import { type CSSProperties, type ReactNode } from 'react';
import { type TileData, clamp } from '../utils/gridMotionMath';

export type GridMotionItem = string | ReactNode | { src: string; alt?: string };
export type { TileData };

function Tile({ tile }: { tile: TileData }) {
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
