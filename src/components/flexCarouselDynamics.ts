import { clamp01, easeInOut } from '../data/flexCarouselPresets';
import type { CarouselMetrics, CarouselSlot } from './flexCarouselSlots';
import type { CardInstance } from './flexCarouselRenderPass';
import type { PointerState } from './flexCarouselEvents';
import { updateLensPosition, updateFocusSpring } from './flexCarouselPhysics';

export interface LensDynamicsResult {
  lensX: number;
  lensY: number;
  halfW: number;
  halfH: number;
  liquidAmount: number;
  animating: boolean;
}

export function updateLensDynamics(
  lens: { x: number; y: number; vx: number; vy: number; ready: boolean },
  s: any,
  pointer: PointerState,
  focusTarget: number,
  width: number,
  height: number,
  deform: number,
  dt: number,
  reducedMotion: boolean
): LensDynamicsResult {
  const homeX = width / 2;
  const homeY = height / 2;
  const isPointerActive = pointer.over && !pointer.dragging && !pointer.touch;
  const follow = s.followCursor && isPointerActive && focusTarget === 0;
  const aimX = follow ? pointer.x : homeX;
  const aimY = follow ? pointer.y : homeY;
  if (!lens.ready) {
    lens.x = homeX;
    lens.y = homeY;
    lens.ready = true;
  }
  const animating = updateLensPosition(lens, aimX, aimY, dt);

  const liquidAmount = reducedMotion ? 0 : s.liquid;
  let halfW = (s.lensWidth * width) / 2;
  let halfH = (s.lensHeight * width) / 2;
  const squash = Math.abs(deform) * liquidAmount;
  halfW *= 1 + squash * 0.16;
  halfH *= 1 - squash * 0.08;
  const lensX = lens.x - deform * 14 * liquidAmount;

  return { lensX, lensY: lens.y, halfW, halfH, liquidAmount, animating };
}

export interface FocusDynamicsResult {
  focusAmount: number;
  focusEase: number;
  focusScale: number;
  lift: number;
  animating: boolean;
}

export function updateFocusDynamics(
  container: HTMLDivElement,
  focus: { index: number; pending: number; t: number; v: number; target: number },
  m: CarouselMetrics,
  width: number,
  height: number,
  n: number,
  currentLift: number,
  dt: number
): FocusDynamicsResult {
  const animating = updateFocusSpring(focus, dt);
  const focusAmount = clamp01(focus.t);
  const focusEase = easeInOut(focusAmount);
  const hasFocusSlot = focus.index >= 0 && focus.index < n;
  const focusW = hasFocusSlot ? m.widths[focus.index] : m.cardH;
  const focusScale = Math.max(1, Math.min(1.3, (height * 0.84) / m.cardH, (width * 0.92) / focusW));
  const nextLift = 1 + (focusScale - 1) * focusEase;
  if (Math.abs(nextLift - currentLift) > 0.0005) {
    container.style.setProperty('--flex-carousel-lift', nextLift.toFixed(4));
  }
  return { focusAmount, focusEase, focusScale, lift: nextLift, animating };
}

export function updateEnergyAndTravel(
  energy: number,
  pos: number,
  lastPos: number,
  dt: number,
  reducedMotion: boolean
): { energy: number; animating: boolean } {
  const travel = Math.abs(pos - lastPos) / dt;
  const energyTarget = reducedMotion ? 0 : Math.min(travel / 2600, 1);
  const decay = energyTarget > energy ? 0.07 : 0.35;
  const nextEnergy = energy + (energyTarget - energy) * (1 - Math.exp(-dt / decay));
  return { energy: nextEnergy, animating: nextEnergy > 0.001 };
}

export function updateSlotsReadiness(slots: CarouselSlot[], dt: number): boolean {
  let animating = false;
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    if (slot.loaded && slot.ready < 1) {
      slot.ready = Math.min(1, slot.ready + dt / 0.45);
      animating = true;
    }
  }
  return animating;
}

export function detectHoverElement(
  instances: CardInstance[],
  pointer: PointerState,
  introDone: boolean,
  focusOnClick: boolean,
  focusTarget: number
): string {
  if (!pointer.over || pointer.dragging || !introDone || !focusOnClick) return '';
  if (focusTarget > 0) return 'close';
  const px = pointer.x;
  const py = pointer.y;
  const hit = instances.find(inst => px >= inst.x0 && px <= inst.x1 && py >= inst.y0 && py <= inst.y1);
  return hit ? 'open' : '';
}

export function applyHoverAttribute(container: HTMLDivElement, nextHover: string, currentHover: string): string {
  if (nextHover === currentHover) return currentHover;
  if (nextHover) container.setAttribute('data-hover', nextHover);
  else container.removeAttribute('data-hover');
  return nextHover;
}
