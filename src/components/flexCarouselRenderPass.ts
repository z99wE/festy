import { wrap, clamp01 } from '../data/flexCarouselPresets';
import type { CarouselSlot, CarouselMetrics, IntroEffectsResult } from './flexCarouselSlots';

export interface CardInstance {
  index: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export interface RenderCardSceneParams {
  gl: any;
  renderer: any;
  target: any;
  cardProgram: any;
  cardMesh: any;
  width: number;
  height: number;
  dpr: number;
  slots: CarouselSlot[];
  m: CarouselMetrics;
  pos: number;
  radius: number;
  squeeze: number;
  energy: number;
  effects: IntroEffectsResult;
  focusAmount: number;
  focusIndex: number;
  focusScale: number;
  focusEase: number;
  reducedMotion: boolean;
}

export interface RenderLensParams {
  renderer: any;
  lensUniforms: any;
  lensMesh: any;
  width: number;
  height: number;
  dpr: number;
  s: any;
  lensX: number;
  lensY: number;
  halfW: number;
  halfH: number;
  deform: number;
  liquidAmount: number;
  effects: IntroEffectsResult;
  focusEase: number;
}

function computeCardTransform(
  i: number,
  rel: number,
  w: number,
  p: RenderCardSceneParams,
  shrink: number,
  homeX: number,
  homeY: number
) {
  const fx = p.effects.card ? p.effects.card(rel) : null;
  let x = homeX + rel + (fx ? fx.x : 0);
  let scale = shrink * (fx ? fx.scale : 1);
  let alpha = fx ? fx.alpha : 1;
  if (p.focusAmount > 0) {
    if (i === p.focusIndex && Math.abs(rel) < w) {
      scale *= 1 + (p.focusScale - 1) * p.focusEase;
    } else {
      const order = Math.min(Math.abs(rel) / p.width, 1) * 0.25;
      const part = p.focusAmount * 1.25 - order > 0.5 ? 1 : 0;
      x += Math.sign(rel) * part * p.width * 0.7;
      alpha *= 1 - part;
    }
  }
  const cw = w * scale;
  const ch = p.m.cardH * scale;
  return { x, y: homeY + (fx ? fx.y : 0), cw, ch, scale, alpha };
}

export function renderCardsScene(p: RenderCardSceneParams): CardInstance[] {
  const instances: CardInstance[] = [];
  const homeX = p.width / 2;
  const homeY = p.height / 2;
  const n = p.slots.length;
  const shrink = 1 - clamp01(p.squeeze) * p.energy;
  const draws: any[] = [];

  for (let i = 0; i < n; i++) {
    const w = p.m.widths[i];
    const baseRel = wrap(p.m.centers[i] - p.pos, p.m.loop);
    for (let k = -3; k <= 3; k++) {
      const rel = baseRel + k * p.m.loop;
      if (Math.abs(rel) - w / 2 > p.width + 40) continue;
      const t = computeCardTransform(i, rel, w, p, shrink, homeX, homeY);
      if (t.alpha <= 0.001 || t.x + t.cw / 2 < -40 || t.x - t.cw / 2 > p.width + 40) continue;
      draws.push({ i, rel, x: t.x, y: t.y, cw: t.cw, ch: t.ch, alpha: t.alpha });
    }
  }

  draws.sort((a, b) => Math.abs(b.rel) - Math.abs(a.rel));
  p.cardProgram.uniforms.uResolution.value = [p.width, p.height];
  p.cardProgram.uniforms.uDpr.value = p.dpr;
  p.cardProgram.uniforms.uRadius.value = p.radius;

  let first = true;
  for (const draw of draws) {
    const slot = p.slots[draw.i];
    p.cardProgram.uniforms.tMap.value = slot.texture;
    p.cardProgram.uniforms.uRect.value = [draw.x, draw.y, draw.cw + 2, draw.ch + 2];
    p.cardProgram.uniforms.uSize.value = [draw.cw, draw.ch];
    p.cardProgram.uniforms.uImage.value = slot.image;
    p.cardProgram.uniforms.uAlpha.value = draw.alpha;
    p.cardProgram.uniforms.uReady.value = slot.ready;
    p.cardProgram.uniforms.uShift.value = p.reducedMotion ? 0 : Math.max(-1, Math.min(1, draw.rel / (p.width * 0.75)));
    p.cardProgram.uniforms.uPlaceholder.value = slot.color;
    p.renderer.render({ scene: p.cardMesh, target: p.target, clear: first });
    first = false;
    instances.push({
      index: draw.i,
      x0: draw.x - draw.cw / 2,
      x1: draw.x + draw.cw / 2,
      y0: draw.y - draw.ch / 2,
      y1: draw.y + draw.ch / 2
    });
  }

  if (first) {
    p.renderer.bindFramebuffer(p.target);
    p.gl.viewport(0, 0, p.target.width, p.target.height);
    p.gl.clear(p.gl.COLOR_BUFFER_BIT);
  }
  p.renderer.bindFramebuffer();
  p.target.texture.bind();
  p.gl.generateMipmap(p.gl.TEXTURE_2D);

  return instances;
}

export function renderLensScene(p: RenderLensParams): void {
  const { lensUniforms, s } = p;
  lensUniforms.uResolution.value = [p.width, p.height];
  lensUniforms.uDpr.value = p.dpr;
  lensUniforms.uCenter.value = [p.lensX, p.lensY];
  lensUniforms.uHalf.value = [Math.max(p.halfW, 1), Math.max(p.halfH, 1)];
  lensUniforms.uAngle.value = (s.tilt * Math.PI) / 180;
  lensUniforms.uExponent.value = 2 + Math.pow(1 - clamp01(s.roundness), 1.5) * 10;
  const spanW = Math.max(p.halfW, 1);
  const spanH = Math.max(p.halfH, 1);
  const inner = Math.max(4, s.reach * (spanW + spanH) * 0.5);
  lensUniforms.uInner.value = inner;
  lensUniforms.uOuter.value = inner * 1.6;
  lensUniforms.uFlow.value = s.bend * (spanW + spanH) * 0.45;
  lensUniforms.uCurl.value = s.curl === 'rise' ? 1 : s.curl === 'fall' ? -1 : 0;
  lensUniforms.uDispersion.value = s.dispersion * 0.12 * (1 + Math.abs(p.deform) * p.liquidAmount * 1.2);
  lensUniforms.uStrength.value = p.effects.strength * (1 - p.focusEase);
  lensUniforms.uSceneAlpha.value = p.effects.sceneAlpha;
  p.renderer.render({ scene: p.lensMesh });
}
