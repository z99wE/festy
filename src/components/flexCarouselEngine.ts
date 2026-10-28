import { Renderer } from 'ogl';
import type { FlexCarouselItem } from '../data/flexCarouselPresets';
import { PIXEL_BUDGET } from '../data/flexCarouselPresets';
import { initGLResources } from './flexCarouselGLSetup';
import type { CarouselSlot, CarouselMetrics } from './flexCarouselSlots';
import {
  createSlot,
  calculateMetrics,
  calculateIntroEffects
} from './flexCarouselSlots';
import type { CardInstance } from './flexCarouselRenderPass';
import { renderCardsScene, renderLensScene } from './flexCarouselRenderPass';
import type { CarouselEngineContext, PointerState } from './flexCarouselEvents';
import { bindFlexCarouselListeners } from './flexCarouselEvents';
import {
  nearestSlot,
  snapPoint,
  remapPosition,
  calculateStepGoal,
  calculateGoToGoal,
  getCarouselStiffness,
  integrateSpring,
  updateDeformSpring,
  advanceIntro,
  canTriggerAutoplay
} from './flexCarouselPhysics';
import {
  updateLensDynamics,
  updateFocusDynamics,
  updateEnergyAndTravel,
  updateSlotsReadiness,
  detectHoverElement,
  applyHoverAttribute
} from './flexCarouselDynamics';

export interface FlexCarouselEngineOptions {
  container: HTMLDivElement;
  settingsRef: { current: any };
  callbacksRef: { current: { onChange: ((index: number, item: any) => void) | undefined; onSelect: ((index: number, item: any) => void) | undefined } };
  setActive: (index: number) => void;
  setRevealed: (revealed: boolean) => void;
  setFocusOpen: (open: boolean) => void;
}

export function initFlexCarousel(options: FlexCarouselEngineOptions) {
  const { container, settingsRef, callbacksRef, setActive, setRevealed, setFocusOpen } = options;

  const renderer = new Renderer({
    dpr: Math.min(window.devicePixelRatio, 2),
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false
  });
  const gl = renderer.gl;
  if (!renderer.isWebgl2) {
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    return null;
  }
  gl.clearColor(0, 0, 0, 0);
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.setAttribute('aria-hidden', 'true');
  container.prepend(canvas);

  const glRes = initGLResources(gl);
  let reducedMotion = false;
  try {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    reducedMotion = false;
  }
  const ext = renderer.getExtension('EXT_texture_filter_anisotropic');
  const anisotropy = ext ? 8 : 0;

  let slots: CarouselSlot[] = [];
  let width = 1;
  let height = 1;
  let pos = 0;
  let vel = 0;
  let goal = 0;
  let mode = 'spring';
  let wheelAt = 0;
  let raf = 0;
  let last = performance.now();
  let visible = true;
  let alive = true;
  let dirty = true;
  let activeIndex = -1;
  let interactedAt = -Infinity;
  let autoplayAt = performance.now();
  let hasFocus = false;
  let deform = 0;
  let deformVel = 0;
  let layout: CarouselMetrics | null = null;
  let resnap = false;
  let hover = '';
  let lift = 1;
  let energy = 0;
  let lastPos = 0;
  const lens = { x: 0, y: 0, vx: 0, vy: 0, ready: false };
  const pointer: PointerState = {
    x: 0,
    y: 0,
    over: false,
    down: false,
    id: -1,
    startX: 0,
    startY: 0,
    startPos: 0,
    dragging: false,
    touch: false,
    samples: []
  };
  const introState = { kind: 'none', t: 0, running: false, done: false, readyAt: 0 };
  const focus = { index: -1, pending: -1, t: 0, v: 0, target: 0 };
  let instances: CardInstance[] = [];

  const start = () => {
    const isBusy = raf > 0 || !visible || !alive;
    if (isBusy) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const setItems = (next: FlexCarouselItem[]) => {
    slots.forEach(slot => slot.dispose());
    slots = next.map((item, idx) =>
      createSlot(gl, item, idx, anisotropy, () => alive, () => {
        dirty = true;
        start();
      })
    );
    activeIndex = -1;
    layout = null;
    resnap = true;
    focus.target = 0;
    focus.t = 0;
    focus.v = 0;
    focus.pending = -1;
    setFocusOpen(false);
    introState.readyAt = performance.now();
    dirty = true;
    start();
  };

  const openFocus = (index: number) => {
    focus.index = index;
    focus.pending = -1;
    focus.target = 1;
    setFocusOpen(true);
    dirty = true;
    start();
  };

  const closeFocus = () => {
    focus.pending = -1;
    if (focus.target === 0) return false;
    focus.target = 0;
    setFocusOpen(false);
    dirty = true;
    start();
    return true;
  };

  const skipIntro = () => {
    if (introState.running) introState.t = 1;
  };

  const resize = () => {
    width = Math.max(1, container.clientWidth);
    height = Math.max(1, container.clientHeight);
    renderer.dpr = Math.min(window.devicePixelRatio, 2, Math.sqrt(PIXEL_BUDGET / (width * height)));
    renderer.setSize(width, height);
    glRes.target.setSize(Math.max(2, Math.round(width * renderer.dpr)), Math.max(2, Math.round(height * renderer.dpr)));
    glRes.lensUniforms.tScene.value = glRes.target.texture;
    dirty = true;
    start();
  };

  const frame = (now: number) => {
    raf = 0;
    if (!alive) return;
    const s = settingsRef.current;
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    if (!s || !slots.length) {
      if (visible) raf = requestAnimationFrame(frame);
      return;
    }

    const m = calculateMetrics(slots, s, height);
    let animating = false;

    if (resnap) {
      goal = snapPoint(m, goal);
      pos = goal;
      vel = 0;
      resnap = false;
    } else if (layout && layout.loop !== m.loop) {
      pos = remapPosition(layout, m, pos);
      goal = remapPosition(layout, m, goal);
      pointer.startPos = pos + (pointer.x - pointer.startX);
      animating = true;
    }
    layout = m;

    if (advanceIntro(introState, s, dt, now, slots, reducedMotion, () => setRevealed(true))) {
      animating = true;
    }

    if (mode === 'wheel' && now - wheelAt > 150) {
      goal = snapPoint(m, goal);
      mode = 'spring';
    }
    if (!pointer.dragging) {
      const spinning = introState.running && introState.kind === 'spin';
      const stiffness = getCarouselStiffness(spinning, mode);
      const res = integrateSpring(dt, pos, vel, goal, stiffness);
      pos = res.pos;
      vel = res.vel;
      if (res.animating) animating = true;
    } else {
      animating = true;
    }

    if (Math.abs(pos) > m.loop * 8) {
      const shift = Math.round(pos / m.loop) * m.loop;
      pos -= shift;
      goal -= shift;
      pointer.startPos -= shift;
    }

    const current = nearestSlot(m, pos);
    if (current !== activeIndex) {
      activeIndex = current;
      setActive(current);
      if (callbacksRef.current.onChange) callbacksRef.current.onChange(current, slots[current].item);
    }

    if (
      canTriggerAutoplay(
        s,
        reducedMotion,
        introState.done,
        focus.target,
        focus.t,
        pointer.over,
        pointer.down,
        hasFocus,
        mode,
        Math.abs(goal - pos),
        now,
        interactedAt,
        autoplayAt
      )
    ) {
      autoplayAt = now;
      goal = calculateStepGoal(m, 1, goal);
      mode = 'spring';
      dirty = true;
      start();
    }
    if (s.autoplay && !reducedMotion) animating = true;

    const energyRes = updateEnergyAndTravel(energy, pos, lastPos, dt, reducedMotion);
    energy = energyRes.energy;
    lastPos = pos;

    const defRes = updateDeformSpring(dt, deform, deformVel, vel);
    deform = defRes.deform;
    deformVel = defRes.deformVel;

    const focusDyn = updateFocusDynamics(container, focus, m, width, height, slots.length, lift, dt);
    lift = focusDyn.lift;

    const lensDyn = updateLensDynamics(lens, s, pointer, focus.target, width, height, deform, dt, reducedMotion);

    const hasActiveDynamics = Boolean(
      Number(energyRes.animating) +
      Number(defRes.animating) +
      Number(focusDyn.animating) +
      Number(lensDyn.animating) +
      Number(updateSlotsReadiness(slots, dt))
    );
    if (hasActiveDynamics) animating = true;

    if (dirty || animating || pointer.dragging) {
      dirty = false;
      const effects = calculateIntroEffects(introState, width, height);
      instances = renderCardsScene({
        gl,
        renderer,
        target: glRes.target,
        cardProgram: glRes.cardProgram,
        cardMesh: glRes.cardMesh,
        width,
        height,
        dpr: renderer.dpr,
        slots,
        m,
        pos,
        radius: s.radius,
        squeeze: s.squeeze,
        energy,
        effects,
        focusAmount: focusDyn.focusAmount,
        focusIndex: focus.index,
        focusScale: focusDyn.focusScale,
        focusEase: focusDyn.focusEase,
        reducedMotion
      });

      renderLensScene({
        renderer,
        lensUniforms: glRes.lensUniforms,
        lensMesh: glRes.lensMesh,
        width,
        height,
        dpr: renderer.dpr,
        s,
        lensX: lensDyn.lensX,
        lensY: lensDyn.lensY,
        halfW: lensDyn.halfW,
        halfH: lensDyn.halfH,
        deform,
        liquidAmount: lensDyn.liquidAmount,
        effects,
        focusEase: focusDyn.focusEase
      });
    }

    const nextHover = detectHoverElement(instances, pointer, introState.done, s.focusOnClick, focus.target);
    hover = applyHoverAttribute(container, nextHover, hover);

    const shouldLoop = animating || !introState.done || dirty || pointer.down;
    if (visible && shouldLoop) {
      raf = requestAnimationFrame(frame);
    }
  };

  const engineCtx: CarouselEngineContext = {
    container,
    pointer,
    getPos: () => pos,
    setPos: (p: number) => { pos = p; },
    getVel: () => vel,
    setVel: (v: number) => { vel = v; },
    getGoal: () => goal,
    setGoal: (g: number) => { goal = g; },
    getMode: () => mode,
    setMode: (m: string) => { mode = m; },
    getSettings: () => settingsRef.current,
    getMetrics: (s: any) => calculateMetrics(slots, s, height),
    getInstances: () => instances,
    getActiveIndex: () => activeIndex,
    getItems: () => slots.map(slot => slot.item),
    getSlotsLength: () => slots.length,
    setInteractedAt: (t: number) => { interactedAt = t; },
    setWheelAt: (t: number) => { wheelAt = t; },
    setDirty: () => { dirty = true; },
    start,
    skipIntro,
    closeFocus,
    openFocus,
    step: (m, delta) => {
      goal = calculateStepGoal(m, delta, goal);
      mode = 'spring';
      dirty = true;
      start();
    },
    goTo: (m, idx) => {
      goal = calculateGoToGoal(m, idx, goal);
      mode = 'spring';
      dirty = true;
      start();
    },
    snapPoint,
    setHasFocus: (focused: boolean) => { hasFocus = focused; },
    onSelectCallback: (idx: number, item: any) => {
      if (callbacksRef.current.onSelect) callbacksRef.current.onSelect(idx, item);
    }
  };

  const unbindListeners = bindFlexCarouselListeners(engineCtx);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    start();
  });
  intersectionObserver.observe(container);

  resize();

  return {
    wake: () => {
      dirty = true;
      start();
    },
    setItems,
    destroy: () => {
      alive = false;
      visible = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      unbindListeners();
      slots.forEach(slot => slot.dispose());
      slots = [];
      const lose = gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  };
}
