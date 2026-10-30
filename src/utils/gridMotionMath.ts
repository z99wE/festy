import type { ReactNode } from 'react';

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
