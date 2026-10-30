import { useEffect, useMemo, useRef, useState } from 'react';
import type { GridPlaneLayout } from './GridMotionPlane';
import { clamp, wrap, smoothstep } from '../utils/gridMotionMath';

const INERTIA = [0.42, 0.32, 0.26, 0.22];
const PACE = [1, 0.86, 1.12, 0.94];

export interface GridMotionSettings {
  rows: number;
  aspect: number;
  gap: number;
  angle: number;
  tilt: number;
  speed: number;
  direction: 'alternate' | 'left' | 'right';
  parallax: number;
  spotlight: number;
  dim: number;
  fade: number;
}

function updateTileSpotlights(
  list: HTMLElement[],
  values: Float32Array,
  marks: Float32Array,
  left: number,
  rowY: number,
  planeX: number,
  planeY: number,
  reach: number,
  inside: boolean,
  spotlight: number,
  step: number,
  settle: number
) {
  for (let k = 0; k < list.length; k++) {
    let wanted = 0;
    if (inside && spotlight > 0) {
      const dist = Math.hypot(left + k * step - planeX, rowY - planeY) / reach;
      wanted = 1 - smoothstep(0.25, 1, dist);
    }
    values[k] += (wanted - values[k]) * settle;
    if (Math.abs(values[k] - marks[k]) > 0.004) {
      marks[k] = values[k] < 0.004 ? 0 : values[k];
      list[k].style.setProperty('--spot', marks[k].toFixed(3));
    }
  }
}

function projectPointer(
  root: HTMLElement,
  pointer: { x: number; y: number },
  tilt: number,
  angle: number,
  perspective: number
) {
  const rect = root.getBoundingClientRect();
  const scale = rect.width ? root.clientWidth / rect.width : 1;
  const halfWidth = root.clientWidth / 2 || 1;
  const halfHeight = root.clientHeight / 2 || 1;
  const px = (pointer.x - rect.left) * scale - halfWidth;
  const py = (pointer.y - rect.top) * scale - halfHeight;
  const inside = Math.abs(px) <= halfWidth && Math.abs(py) <= halfHeight;
  const lean = (tilt * Math.PI) / 180;
  const turn = (angle * Math.PI) / 180;
  let flatY = py;
  let flatX = px;
  if (lean > 0.0001) {
    flatY = (py * perspective) / (perspective * Math.cos(lean) + py * Math.sin(lean));
    flatX = (px * (perspective - flatY * Math.sin(lean))) / perspective;
  }
  const planeX = flatX * Math.cos(turn) + flatY * Math.sin(turn);
  const planeY = -flatX * Math.sin(turn) + flatY * Math.cos(turn);
  const nudge = clamp(px / halfWidth, -1, 1);
  return { inside, planeX, planeY, nudge };
}

function updateRowOffsets(
  row: HTMLElement,
  r: number,
  s: GridMotionSettings,
  layout: GridPlaneLayout,
  motion: { offsets: number[]; shifts: number[] },
  reduce: boolean,
  nudge: number,
  dt: number
): { rowY: number; left: number } {
  const drift = s.direction === 'left' ? -1 : s.direction === 'right' ? 1 : r % 2 ? 1 : -1;
  if (motion.offsets[r] === undefined) {
    motion.offsets[r] = r * layout.step * 0.37;
    motion.shifts[r] = 0;
  }
  if (!reduce) motion.offsets[r] += s.speed * drift * PACE[r % PACE.length] * dt;
  const target = reduce ? 0 : s.parallax * layout.tileWidth * 1.2 * nudge * (r % 2 ? -1 : 1);
  motion.shifts[r] += (target - motion.shifts[r]) * (1 - Math.exp(-dt / INERTIA[r % INERTIA.length]));
  const x = -layout.period + wrap(motion.offsets[r] + motion.shifts[r], layout.period);
  row.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;

  const rowY = layout.top + r * (layout.tileHeight + s.gap) + layout.tileHeight / 2 - layout.planeHeight / 2;
  const left = x - layout.planeWidth / 2 + layout.tileWidth / 2;
  return { rowY, left };
}

export function useGridMotion(settings: GridMotionSettings) {
  const rootRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<{
    offsets: number[];
    shifts: number[];
    intro: number;
    pointer: { x: number; y: number; active: boolean };
  }>({
    offsets: [],
    shifts: [],
    intro: 0,
    pointer: { x: 0, y: 0, active: false },
  });

  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const layout = useMemo((): GridPlaneLayout | null => {
    const { width, height } = size;
    if (!width || !height) return null;
    const turn = (settings.angle * Math.PI) / 180;
    const lean = (settings.tilt * Math.PI) / 180;
    const cos = Math.abs(Math.cos(turn));
    const sin = Math.abs(Math.sin(turn));
    const planeHeight = ((width * sin + height * cos) / Math.max(0.3, Math.cos(lean))) * 1.12;
    const planeWidth = (width * cos + height * sin) * (1 + Math.sin(lean) * 0.9) * 1.12;
    const tileHeight = Math.max(16, (planeHeight - settings.gap * (settings.rows - 1)) / settings.rows);
    const tileWidth = tileHeight * settings.aspect;
    const step = tileWidth + settings.gap;
    const perRow = Math.ceil(planeWidth / step) + 1;
    const period = perRow * step;
    return {
      planeWidth,
      planeHeight,
      tileWidth,
      tileHeight,
      step,
      perRow,
      period,
      copies: Math.ceil(planeWidth / period) + 2,
      top: (planeHeight - settings.rows * tileHeight - (settings.rows - 1) * settings.gap) / 2,
      perspective: Math.max(width, height) * 1.5,
    };
  }, [size, settings.angle, settings.tilt, settings.rows, settings.gap, settings.aspect]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const observer = new ResizeObserver(() => {
      const width = Math.round(root.clientWidth);
      const height = Math.round(root.clientHeight);
      setSize((curr) => (curr.width === width && curr.height === height ? curr : { width, height }));
    });
    observer.observe(root);
    const motion = motionRef.current;
    const onMove = (event: PointerEvent) => {
      motion.pointer.x = event.clientX;
      motion.pointer.y = event.clientY;
      motion.pointer.active = true;
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerType === 'touch') motion.pointer.active = false;
    };
    const onLeave = () => {
      motion.pointer.active = false;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('blur', onLeave);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('blur', onLeave);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const plane = planeRef.current;
    if (!root || !plane || !layout) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const motion = motionRef.current;
    const rowEls = Array.from(plane.children) as HTMLElement[];
    const tileEls = rowEls.map((row) => Array.from(row.children) as HTMLElement[]);
    const spots = tileEls.map((list) => new Float32Array(list.length));
    const written = tileEls.map((list) => new Float32Array(list.length));
    let raf = 0;
    let last = performance.now();
    let visible = false;
    let alive = true;
    if (motion.intro >= 1) plane.style.opacity = '1';

    const frame = (now: number) => {
      raf = 0;
      if (!alive || !visible) return;
      const s = settingsRef.current;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;

      if (motion.intro < 1) {
        motion.intro = Math.min(1, motion.intro + dt / 0.9);
        plane.style.opacity = String(1 - (1 - motion.intro) ** 3);
      }

      let inside = false;
      let planeX = 0;
      let planeY = 0;
      let nudge = 0;

      if (motion.pointer.active) {
        const proj = projectPointer(root, motion.pointer, s.tilt, s.angle, layout.perspective);
        inside = proj.inside;
        planeX = proj.planeX;
        planeY = proj.planeY;
        nudge = proj.nudge;
      }

      const reach = (0.6 + 2.2 * s.spotlight) * Math.max(layout.tileWidth, layout.tileHeight);
      const settle = 1 - Math.exp(-dt / 0.22);

      rowEls.forEach((row, r) => {
        const offset = updateRowOffsets(row, r, s, layout, motion, reduce, nudge, dt);
        updateTileSpotlights(tileEls[r], spots[r], written[r], offset.left, offset.rowY, planeX, planeY, reach, inside, s.spotlight, layout.step, settle);
      });

      if (visible) raf = requestAnimationFrame(frame);
    };

    const visibility = new IntersectionObserver((entries) => {
      const isIntersecting = entries.some((entry) => entry.isIntersecting);
      visible = isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    visibility.observe(root);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      visibility.disconnect();
    };
  }, [layout]);

  return { rootRef, planeRef, layout };
}
