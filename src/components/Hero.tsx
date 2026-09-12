import { HeroBackground } from './HeroBackground';

export function Hero() {
  return (
    <section
      style={{ paddingBottom: 'var(--nav-h, 74px)' }}
      className="relative isolate w-full h-full flex flex-col items-center justify-center text-center overflow-hidden"
    >
      <HeroBackground />

      <div className="absolute top-0 right-0 z-10 flex flex-col items-center gap-2 mt-12">
        <div className="w-px h-16 overflow-hidden relative bg-zinc-400/60 dark:bg-zinc-700/30">
          <div
            className="absolute inset-x-0 h-full bg-red-500"
            style={{ animation: "scroll-line 2.4s ease infinite" }}
          />
        </div>
        <span
          style={{ writingMode: "vertical-lr" }}
          className="text-[9px] tracking-[0.2em] text-zinc-600 dark:text-zinc-400 uppercase"
        >
          Scroll
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-12">
        <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-zinc-500 dark:text-zinc-400">
          Fullstack Developer · Stockholm
        </p>

        <h1
          aria-label="Alexander Tjernström"
          className="font-heading font-extralight uppercase leading-none tracking-[0.3em] -mr-[0.3em] text-[clamp(2rem,6.5vw,4.25rem)]"
        >
          Tjernstrom
        </h1>

        <div className="flex items-center gap-6 font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-2 text-green-700 dark:text-green-500">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="status-ripple absolute inset-0 rounded-full" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-500" />
            </span>
            Open to work
          </span>
          <a
            href="#work"
            className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            See the work ↓
          </a>
        </div>
      </div>
    </section>
  );
}
