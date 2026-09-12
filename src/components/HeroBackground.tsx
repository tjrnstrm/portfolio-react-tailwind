import { useEffect, useRef } from 'react';

type Column = { y: number; speed: number; len: number; glyphs: string[] };

const GLYPHS = '01{}[]()<>/*=+-;:$#&|!?.'.split('');
const FONT = 14;
const COL_W = FONT * 1.35;

const rndGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

/** Code rain scoped to the hero section — scrolls away with it. */
export function HeroBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let cols: Column[] = [];

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

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT}px "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'top';
      cols = Array.from({ length: Math.ceil(w / COL_W) + 1 }, () => makeCol(false));
    };
    build();

    const ro = new ResizeObserver(build);
    ro.observe(canvas);

    let raf = 0;
    let running = false;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);

      const d = isDark();
      const head = d ? '214,220,255' : '35,42,110';
      const tail = d ? '138,152,255' : '74,86,165';
      const headA = d ? 0.34 : 0.28;
      const tailA = d ? 0.15 : 0.12;

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
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${FONT}px "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'top';
      const d = isDark();
      ctx.fillStyle = d ? 'rgba(138,152,255,0.10)' : 'rgba(74,86,165,0.09)';
      for (let i = 0; i < cols.length; i++) {
        const x = i * COL_W + (COL_W - FONT) / 2;
        for (let k = 0; k < 3; k++) {
          if (Math.random() < 0.6) ctx.fillText(rndGlyph(), x, Math.random() * h);
        }
      }
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
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      style={{
        // Fades in at the top, dims behind the centred text, returns for the
        // lower third, then dissolves to nothing before the fold — no marquee
        // to cap the clipped bottom edge, so the rain has to end softly itself.
        maskImage:
          'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.12) 38%, rgba(0,0,0,0.12) 55%, #000 72%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.12) 38%, rgba(0,0,0,0.12) 55%, #000 72%, transparent 100%)',
      }}
    />
  );
}
