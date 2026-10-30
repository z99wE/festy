import { Texture } from 'ogl';
import type { FlexCarouselItem } from '../data/flexCarouselPresets';
import { FIT_ASPECT, clamp01, easeInOut, easeOut, easeOutQuint } from '../data/flexCarouselPresets';

export interface CarouselSlot {
  item: FlexCarouselItem;
  index: number;
  texture: Texture;
  aspect: number;
  loaded: boolean;
  failed: boolean;
  ready: number;
  color: [number, number, number];
  image: [number, number];
  dispose: () => void;
}

export interface CarouselMetrics {
  cardH: number;
  widths: number[];
  centers: number[];
  gap: number;
  loop: number;
}

export interface CardEffect {
  alpha: number;
  x: number;
  y: number;
  scale: number;
}

export interface IntroEffectsResult {
  sceneAlpha: number;
  strength: number;
  card: ((rel: number) => CardEffect) | null;
}

function computeImageAverageColor(image: HTMLImageElement): [number, number, number] {
  try {
    const probe = document.createElement('canvas');
    probe.width = 8;
    probe.height = 8;
    const ctx = probe.getContext('2d', { willReadFrequently: true });
    if (!ctx) return [0.5, 0.5, 0.5];
    ctx.drawImage(image, 0, 0, 8, 8);
    const data = ctx.getImageData(0, 0, 8, 8).data;
    const avg: [number, number, number] = [0, 0, 0];
    for (let i = 0; i < data.length; i += 4) {
      avg[0] += data[i];
      avg[1] += data[i + 1];
      avg[2] += data[i + 2];
    }
    return [avg[0] / 64 / 255, avg[1] / 64 / 255, avg[2] / 64 / 255];
  } catch {
    return [0.5, 0.5, 0.5];
  }
}

export function createSlot(
  gl: any,
  item: FlexCarouselItem,
  index: number,
  anisotropy: number,
  isAlive: () => boolean,
  onLoaded: () => void
): CarouselSlot {
  const texture = new Texture(gl, {
    generateMipmaps: true,
    minFilter: gl.LINEAR_MIPMAP_LINEAR,
    magFilter: gl.LINEAR,
    anisotropy
  });
  const slot: CarouselSlot = {
    item,
    index,
    texture,
    aspect: 0.8,
    loaded: false,
    failed: false,
    ready: 0,
    color: [0.5, 0.5, 0.5],
    image: [1, 1],
    dispose: () => {}
  };
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.decoding = 'async';
  image.onload = () => {
    if (!isAlive()) return;
    texture.image = image;
    texture.update();
    const natW = image.naturalWidth;
    const natH = image.naturalHeight;
    slot.image = [natW > 0 ? natW : 1, natH > 0 ? natH : 1];
    slot.aspect = slot.image[0] / slot.image[1];
    slot.color = computeImageAverageColor(image);
    slot.loaded = true;
    onLoaded();
  };
  image.onerror = () => {
    if (!isAlive()) return;
    slot.failed = true;
    onLoaded();
  };
  image.src = item.src;
  slot.dispose = () => {
    image.onload = null;
    image.onerror = null;
    gl.deleteTexture(texture.texture);
  };
  return slot;
}

export function calculateMetrics(slots: CarouselSlot[], s: any, height: number): CarouselMetrics {
  const cardH = Math.max(24, s.cardHeight * height);
  const fixed = FIT_ASPECT[s.fit];
  const widths = slots.map(slot => (fixed ? fixed : slot.aspect) * cardH);
  const centers: number[] = [];
  let cursor = 0;
  for (let i = 0; i < widths.length; i++) {
    centers.push(cursor + widths[i] / 2);
    cursor += widths[i] + s.gap;
  }
  return { cardH, widths, centers, gap: s.gap, loop: Math.max(cursor, 1) };
}

export function calculateIntroEffects(
  introState: { kind: string; t: number; running: boolean; done: boolean },
  width: number,
  height: number
): IntroEffectsResult {
  const t = introState.running ? introState.t : introState.done ? 1 : 0;
  const e: IntroEffectsResult = { sceneAlpha: 1, strength: 1, card: null };
  if (!introState.done && !introState.running) {
    e.sceneAlpha = 0;
    e.strength = 0;
    return e;
  }
  if (t >= 1) return e;

  const kind = introState.kind;
  if (kind === 'rise') {
    e.strength = easeInOut((t - 0.3) / 0.65);
    e.card = (rel: number) => {
      const delay = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.34;
      const local = clamp01((t - delay) / 0.6);
      return {
        alpha: clamp01(local * 4),
        x: 0,
        y: (1 - easeOutQuint(local)) * height * 0.62,
        scale: 0.5 + 0.5 * easeInOut((local - 0.18) / 0.82)
      };
    };
    return e;
  }

  if (kind === 'bloom') {
    e.strength = easeInOut((t - 0.2) / 0.8);
    e.card = (rel: number) => {
      const delay = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.25;
      const local = easeOut((t - delay) / 0.55);
      return { alpha: local, x: 0, y: 0, scale: 0.92 + 0.08 * local };
    };
    return e;
  }

  if (kind === 'spin') {
    e.sceneAlpha = easeOut(t / 0.25);
    e.strength = easeOut((t - 0.55) / 0.45);
    return e;
  }

  if (kind === 'deal') {
    e.strength = easeOut((t - 0.45) / 0.5);
    e.card = (rel: number) => {
      const spread = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.3;
      const local = easeOut((t - 0.12 - spread) / 0.5);
      return { alpha: easeOut((t - spread) / 0.12), x: -rel * (1 - local), y: 0, scale: 1 };
    };
    return e;
  }

  e.sceneAlpha = easeOut(t);
  e.strength = easeOut(t);
  return e;
}
