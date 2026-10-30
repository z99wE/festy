import {
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
} from './flexCarouselPointerEvents';

export { handlePointerDown, handlePointerMove, handlePointerUp };

export interface PointerState {
  x: number;
  y: number;
  over: boolean;
  down: boolean;
  id: number;
  startX: number;
  startY: number;
  startPos: number;
  dragging: boolean;
  touch: boolean;
  samples: Array<{ x: number; t: number }>;
}

export interface CarouselEngineContext {
  container: HTMLDivElement;
  pointer: PointerState;
  getPos: () => number;
  setPos: (p: number) => void;
  getVel: () => number;
  setVel: (v: number) => void;
  getGoal: () => number;
  setGoal: (g: number) => void;
  getMode: () => string;
  setMode: (m: string) => void;
  getSettings: () => any;
  getMetrics: (s: any) => any;
  getInstances: () => any[];
  getActiveIndex: () => number;
  getItems: () => any[];
  getSlotsLength: () => number;
  setInteractedAt: (t: number) => void;
  setWheelAt: (t: number) => void;
  setDirty: () => void;
  start: () => void;
  skipIntro: () => void;
  closeFocus: () => boolean;
  openFocus: (idx: number) => void;
  step: (m: any, delta: number) => void;
  goTo: (m: any, idx: number) => void;
  snapPoint: (m: any, at: number) => number;
  setHasFocus: (focused: boolean) => void;
  onSelectCallback: ((index: number, item: any) => void) | undefined;
}

export function handleWheelEvent(e: WheelEvent, ctx: CarouselEngineContext) {
  const s = ctx.getSettings();
  if (!s || e.ctrlKey) return;
  let dx = e.deltaX;
  let dy = e.deltaY;
  if (e.shiftKey && Math.abs(dx) < Math.abs(dy)) {
    dx = dy;
    dy = 0;
  }
  const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? ctx.container.clientHeight : 1;
  const horizontal = Math.abs(dx) > Math.abs(dy);
  if (!horizontal && !s.captureWheel) return;
  e.preventDefault();
  ctx.skipIntro();
  ctx.setInteractedAt(performance.now());
  if (ctx.closeFocus()) return;
  const delta = Math.max(-120, Math.min(120, (horizontal ? dx : dy) * unit));
  ctx.setGoal(ctx.getGoal() + delta * 1.25);
  ctx.setMode('wheel');
  ctx.setWheelAt(performance.now());
  ctx.start();
}

const NAV_KEYS: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

export function handleKeyDownEvent(e: KeyboardEvent, ctx: CarouselEngineContext) {
  const s = ctx.getSettings();
  if (!s) return;
  const m = ctx.getMetrics(s);

  const stepDelta = NAV_KEYS[e.key];
  if (stepDelta) {
    e.preventDefault();
    ctx.skipIntro();
    ctx.closeFocus();
    ctx.setInteractedAt(performance.now());
    ctx.step(m, stepDelta);
    return;
  }

  if (e.key === 'Home') {
    e.preventDefault();
    ctx.closeFocus();
    ctx.goTo(m, 0);
  } else if (e.key === 'End') {
    e.preventDefault();
    ctx.closeFocus();
    ctx.goTo(m, ctx.getSlotsLength() - 1);
  } else if (e.key === 'Escape') {
    if (ctx.closeFocus()) e.preventDefault();
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    const activeIndex = ctx.getActiveIndex();
    if (ctx.closeFocus() || activeIndex < 0) return;
    const items = ctx.getItems();
    if (ctx.onSelectCallback) ctx.onSelectCallback(activeIndex, items[activeIndex]);
    if (s.focusOnClick) ctx.openFocus(activeIndex);
  }
}

export function bindFlexCarouselListeners(ctx: CarouselEngineContext): () => void {
  const { container, pointer } = ctx;

  const onPointerLeave = () => {
    pointer.over = false;
    ctx.setDirty();
    ctx.start();
  };

  const onPointerCancel = () => {
    pointer.down = false;
    pointer.dragging = false;
    container.removeAttribute('data-dragging');
    const s = ctx.getSettings();
    if (!s) return;
    ctx.setGoal(ctx.snapPoint(ctx.getMetrics(s), ctx.getPos()));
    ctx.setMode('spring');
    ctx.start();
  };

  const onDown = (e: PointerEvent) => handlePointerDown(e, ctx);
  const onMove = (e: PointerEvent) => handlePointerMove(e, ctx);
  const onUp = (e: PointerEvent) => handlePointerUp(e, ctx);
  const onWheel = (e: WheelEvent) => handleWheelEvent(e, ctx);
  const onKeyDown = (e: KeyboardEvent) => handleKeyDownEvent(e, ctx);
  const onFocus = () => ctx.setHasFocus(true);
  const onBlur = () => ctx.setHasFocus(false);
  const onVisibility = () => {
    if (!document.hidden) ctx.start();
  };

  container.addEventListener('pointerdown', onDown);
  container.addEventListener('pointermove', onMove);
  container.addEventListener('pointerup', onUp);
  container.addEventListener('pointerleave', onPointerLeave);
  container.addEventListener('pointercancel', onPointerCancel);
  container.addEventListener('wheel', onWheel, { passive: false });
  container.addEventListener('keydown', onKeyDown);
  container.addEventListener('focus', onFocus);
  container.addEventListener('blur', onBlur);
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    container.removeEventListener('pointerdown', onDown);
    container.removeEventListener('pointermove', onMove);
    container.removeEventListener('pointerup', onUp);
    container.removeEventListener('pointerleave', onPointerLeave);
    container.removeEventListener('pointercancel', onPointerCancel);
    container.removeEventListener('wheel', onWheel);
    container.removeEventListener('keydown', onKeyDown);
    container.removeEventListener('focus', onFocus);
    container.removeEventListener('blur', onBlur);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
