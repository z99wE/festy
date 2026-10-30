import { wrap, INTRO_DURATION } from '../data/flexCarouselPresets';
import type { CarouselMetrics, CarouselSlot } from './flexCarouselSlots';

export function nearestSlot(m: CarouselMetrics, at: number): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < m.centers.length; i++) {
    const dist = Math.abs(wrap(m.centers[i] - at, m.loop));
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

export function snapPoint(m: CarouselMetrics, at: number): number {
  const i = nearestSlot(m, at);
  return at + wrap(m.centers[i] - at, m.loop);
}

export function remapPosition(from: CarouselMetrics, to: CarouselMetrics, at: number): number {
  const i = nearestSlot(from, at);
  const offset = wrap(at - from.centers[i], from.loop);
  const cycles = Math.round((at - offset - from.centers[i]) / from.loop);
  return cycles * to.loop + to.centers[i] + offset * (to.widths[i] / from.widths[i]);
}

export function calculateStepGoal(m: CarouselMetrics, delta: number, goal: number): number {
  let at = snapPoint(m, goal);
  let index = nearestSlot(m, at);
  const n = m.centers.length;
  for (let k = 0; k < Math.abs(delta); k++) {
    const next = (index + (delta > 0 ? 1 : n - 1)) % n;
    const distance =
      delta > 0
        ? m.widths[index] / 2 + m.gap + m.widths[next] / 2
        : -(m.widths[next] / 2 + m.gap + m.widths[index] / 2);
    at += distance;
    index = next;
  }
  return at;
}

export function calculateGoToGoal(m: CarouselMetrics, index: number, goal: number): number {
  const i = ((index % m.centers.length) + m.centers.length) % m.centers.length;
  return goal + wrap(m.centers[i] - goal, m.loop);
}

export function getCarouselStiffness(spinning: boolean, mode: string): number {
  if (spinning) return 9;
  if (mode === 'wheel') return 80;
  return 55;
}

export function integrateSpring(
  dt: number,
  pos: number,
  vel: number,
  goal: number,
  stiffness: number
): { pos: number; vel: number; animating: boolean } {
  const damping = 2 * Math.sqrt(stiffness);
  const steps = Math.ceil(dt / (1 / 240));
  const h = dt / steps;
  let curPos = pos;
  let curVel = vel;
  for (let i = 0; i < steps; i++) {
    const acc = stiffness * (goal - curPos) - damping * curVel;
    curVel += acc * h;
    curPos += curVel * h;
  }
  if (Math.abs(goal - curPos) < 0.05 && Math.abs(curVel) < 0.5) {
    return { pos: goal, vel: 0, animating: false };
  }
  return { pos: curPos, vel: curVel, animating: true };
}

export function updateDeformSpring(
  dt: number,
  deform: number,
  deformVel: number,
  vel: number
): { deform: number; deformVel: number; animating: boolean } {
  const push = Math.max(-1, Math.min(1, vel / 2200));
  const deformStiffness = 120;
  const deformDamping = 2 * Math.sqrt(deformStiffness) * 0.32;
  const nextVel = deformVel + (deformStiffness * (push - deform) - deformDamping * deformVel) * dt;
  const nextDeform = deform + nextVel * dt;
  const animating = Math.abs(nextDeform) > 0.0005 || Math.abs(nextVel) > 0.005;
  return { deform: nextDeform, deformVel: nextVel, animating };
}

export function updateLensPosition(lens: any, aimX: number, aimY: number, dt: number): boolean {
  const lensK = 110;
  const lensC = 2 * Math.sqrt(lensK) * 0.8;
  lens.vx += (lensK * (aimX - lens.x) - lensC * lens.vx) * dt;
  lens.vy += (lensK * (aimY - lens.y) - lensC * lens.vy) * dt;
  lens.x += lens.vx * dt;
  lens.y += lens.vy * dt;
  return Math.abs(aimX - lens.x) + Math.abs(aimY - lens.y) > 0.2 || Math.abs(lens.vx) + Math.abs(lens.vy) > 0.5;
}

export function updateFocusSpring(focus: any, dt: number): boolean {
  const focusStiffness = 64;
  focus.v += (focusStiffness * (focus.target - focus.t) - 2 * Math.sqrt(focusStiffness) * focus.v) * dt;
  focus.t += focus.v * dt;
  if (Math.abs(focus.target - focus.t) < 0.0005 && Math.abs(focus.v) < 0.001) {
    focus.t = focus.target;
    focus.v = 0;
    return false;
  }
  return true;
}

export function advanceIntro(
  introState: any,
  s: any,
  dt: number,
  now: number,
  slots: CarouselSlot[],
  reducedMotion: boolean,
  onDone: () => void
): boolean {
  if (!introState.running && !introState.done) {
    const hasLoaded = slots.some(slot => slot.loaded);
    if (hasLoaded || now - introState.readyAt > 400) {
      const kind = reducedMotion && s.intro !== 'none' ? 'fade' : s.intro;
      introState.kind = INTRO_DURATION[kind] ? kind : 'none';
      introState.running = introState.kind !== 'none';
      introState.done = !introState.running;
      introState.t = 0;
      if (introState.done) onDone();
    }
  }
  if (introState.running) {
    introState.t = Math.min(1, introState.t + dt / (INTRO_DURATION[introState.kind] || 1));
    if (introState.t >= 1) {
      introState.running = false;
      introState.done = true;
      onDone();
    }
    return true;
  }
  return false;
}

export function canTriggerAutoplay(
  s: any,
  reducedMotion: boolean,
  introDone: boolean,
  focusTarget: number,
  focusT: number,
  pointerOver: boolean,
  pointerDown: boolean,
  hasFocus: boolean,
  mode: string,
  goalDiff: number,
  now: number,
  interactedAt: number,
  autoplayAt: number
): boolean {
  if (!s.autoplay || reducedMotion || !introDone || focusTarget !== 0 || focusT >= 0.01) return false;
  if (pointerOver || pointerDown || hasFocus || mode !== 'spring' || goalDiff >= 1) return false;
  return now - interactedAt > 3000 && now - autoplayAt > s.interval * 1000;
}
