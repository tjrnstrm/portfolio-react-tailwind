import { useEffect, useRef } from 'react';

type Column = { y: number; speed: number; len: number; glyphs: string[] };

const GLYPHS = '01{}[]()<>/*=+-;:$#&|!?.'.split('');
const FONT = 14;
const COL_W = FONT * 1.35;

const rndGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

/**
 * The code rain behind every page. There is one of it, mounted in App, so it
 * keeps falling when you move between pages instead of starting over. It is a
 * fixed, viewport-sized layer that the page scrolls over.
 *
 * `hero` (the home page) dims the rain behind the centred text, `page` keeps it
 * even with soft top and bottom edges (see .code-rain in index.css, which also
 * fades between the two). `strength` scales the brightness; the contact page
 * uses more because its rain sits behind blurred glass. Both change smoothly.
 */
export function CodeRain({
  mode,
  strength = 1,
}: {
  mode: 'hero' | 'page';
  strength?: number;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const target = useRef(strength);

  useEffect(() => {
    target.current = strength;
  }, [strength]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    const cols: Column[] = [];
    let boost = target.current;

    const isDark = () => document.documentElement.classList.contains('dark');

    const makeCol = (fromTop: boolean): Column => {
      const len = 8 + Math.floor(Math.random() * 16);
      return {
        y: fromTop ? Math.random() * -h : Math.random() * h,
        speed: 55 + Math.random() * 95,
        len,
        glyphs: Array.from({ length: len }, rndGlyph),
      };
    };

    // Sizes the canvas and adds or drops columns to fit, but keeps the ones it
    // has: a page with a scrollbar makes the canvas a few pixels narrower, and
    // that must not restart the rain.
    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT}px "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'top';
      const count = Math.ceil(w / COL_W) + 1;
      if (cols.length > count) cols.length = count;
      while (cols.length < count) cols.push(makeCol(false));
    };
    build();

    // Reduced motion: a still scatter of glyphs. It is drawn from fixed picks
    // (per column: which of three rows, and the glyph), so it can be painted
    // again after a resize clears the canvas.
    const still = new Map<number, { y: number; g: string }[]>();
    const paintStill = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${FONT}px "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'top';
      ctx.fillStyle = isDark() ? 'rgba(138,152,255,0.10)' : 'rgba(74,86,165,0.09)';
      for (let i = 0; i < cols.length; i++) {
        if (!still.has(i)) {
          still.set(
            i,
            Array.from({ length: 3 }, () => ({ y: Math.random(), g: rndGlyph() })).filter(
              () => Math.random() < 0.6,
            ),
          );
        }
        const x = i * COL_W + (COL_W - FONT) / 2;
        for (const s of still.get(i)!) ctx.fillText(s.g, x, s.y * h);
      }
    };

    const ro = new ResizeObserver(() => {
      build();
      if (reduce) paintStill();
    });
    ro.observe(canvas);

    let raf = 0;
    let running = false;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);

      // ease the brightness towards the current page's value
      boost += (target.current - boost) * Math.min(1, dt * 3);

      const d = isDark();
      const head = d ? '214,220,255' : '35,42,110';
      const tail = d ? '138,152,255' : '74,86,165';
      const headA = (d ? 0.34 : 0.28) * boost;
      const tailA = (d ? 0.15 : 0.12) * boost;

      for (let i = 0; i < cols.length; i++) {
        const c = cols[i];
        c.y += c.speed * dt;
        if (Math.random() < 0.06) c.glyphs[(Math.random() * c.len) | 0] = rndGlyph();

        const x = i * COL_W + (COL_W - FONT) / 2;
        for (let k = 0; k < c.len; k++) {
          const yy = c.y - k * FONT;
          if (yy < -FONT || yy > h) continue;
          ctx.fillStyle =
            k === 0
              ? `rgba(${head},${headA})`
              : `rgba(${tail},${(tailA * (1 - k / c.len)).toFixed(3)})`;
          ctx.fillText(c.glyphs[k], x, yy);
        }

        if (c.y - c.len * FONT > h) cols[i] = makeCol(true);
      }
      raf = requestAnimationFrame(draw);
    };

    if (reduce) {
      paintStill();
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !running) {
            running = true;
            last = performance.now();
            raf = requestAnimationFrame(draw);
          } else if (!e.isIntersecting && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        }
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      data-mode={mode}
      className="code-rain pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
