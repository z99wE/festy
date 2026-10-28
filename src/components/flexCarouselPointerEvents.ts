import type { CarouselEngineContext } from './flexCarouselEvents';

export function getLocalPoint(container: HTMLDivElement, e: MouseEvent | PointerEvent): [number, number] {
  const rect = container.getBoundingClientRect();
  return [e.clientX - rect.left, e.clientY - rect.top];
}

export function handlePointerDown(e: PointerEvent, ctx: CarouselEngineContext) {
  if (e.button !== undefined && e.button > 0) return;
  ctx.skipIntro();
  const [x, y] = getLocalPoint(ctx.container, e);
  const p = ctx.pointer;
  p.down = true;
  p.id = e.pointerId;
  p.touch = e.pointerType === 'touch';
  p.startX = x;
  p.startY = y;
  p.x = x;
  p.y = y;
  p.startPos = ctx.getPos();
  p.dragging = false;
  p.samples = [{ x, t: performance.now() }];
  ctx.setInteractedAt(performance.now());
  if (Math.abs(ctx.getVel()) > 40) {
    ctx.setGoal(ctx.getPos());
    ctx.setVel(0);
  }
  ctx.setDirty();
  ctx.start();
}

export function handlePointerMove(e: PointerEvent, ctx: CarouselEngineContext) {
  const [x, y] = getLocalPoint(ctx.container, e);
  const p = ctx.pointer;
  p.x = x;
  p.y = y;
  p.over = true;
  if (!p.down || e.pointerId !== p.id) return;

  const dx = x - p.startX;
  const dy = y - p.startY;
  const slop = p.touch ? 10 : 5;
  if (!p.dragging) {
    if (p.touch && Math.abs(dy) > slop && Math.abs(dy) > Math.abs(dx)) {
      p.down = false;
      return;
    }
    if (Math.abs(dx) > slop) {
      p.dragging = true;
      p.startX = x;
      p.startPos = ctx.getPos();
      ctx.closeFocus();
      try {
        ctx.container.setPointerCapture(e.pointerId);
      } catch {
        p.dragging = true;
      }
      ctx.container.setAttribute('data-dragging', '');
    }
  }

  if (p.dragging) {
    const nextPos = p.startPos - (x - p.startX);
    ctx.setPos(nextPos);
    ctx.setGoal(nextPos);
    ctx.setVel(0);
    const now = performance.now();
    p.samples.push({ x, t: now });
    while (p.samples.length > 2 && now - p.samples[0].t > 100) p.samples.shift();
  }

  ctx.setDirty();
  ctx.start();
}

export function handlePointerUp(e: PointerEvent, ctx: CarouselEngineContext) {
  const p = ctx.pointer;
  if (!p.down || e.pointerId !== p.id) return;
  p.down = false;
  ctx.container.removeAttribute('data-dragging');
  const s = ctx.getSettings();
  if (!s) return;
  const m = ctx.getMetrics(s);
  ctx.setInteractedAt(performance.now());

  if (p.dragging) {
    p.dragging = false;
    const now = performance.now();
    const first = p.samples[0];
    const lastSample = p.samples[p.samples.length - 1];
    let velocity = 0;
    if (first && lastSample && lastSample.t > first.t && now - lastSample.t < 70) {
      velocity = -((lastSample.x - first.x) / (lastSample.t - first.t)) * 1000;
    }
    ctx.setVel(velocity);
    const landing = ctx.snapPoint(m, ctx.getPos() + velocity * 0.32);
    ctx.setGoal(landing);
    if (Math.abs(velocity) > 400 && Math.abs(landing - ctx.getPos()) < 1) {
      ctx.step(m, velocity > 0 ? 1 : -1);
    }
    ctx.setMode('spring');
    ctx.start();
    return;
  }

  if (ctx.closeFocus()) return;
  const [x, y] = getLocalPoint(ctx.container, e);
  const instances = ctx.getInstances();
  const hit = instances.find((inst) => x >= inst.x0 && x <= inst.x1 && y >= inst.y0 && y <= inst.y1);
  if (!hit) return;

  const activeIndex = ctx.getActiveIndex();
  if (hit.index === activeIndex && Math.abs(ctx.getGoal() - ctx.getPos()) < 2) {
    const items = ctx.getItems();
    ctx.onSelectCallback?.(hit.index, items[hit.index]);
    if (s.focusOnClick) ctx.openFocus(hit.index);
  } else {
    const width = ctx.container.clientWidth;
    const rel = (hit.x0 + hit.x1) / 2 - width / 2;
    ctx.setGoal(ctx.snapPoint(m, ctx.getPos() + rel));
    ctx.setMode('spring');
    ctx.start();
  }
}
