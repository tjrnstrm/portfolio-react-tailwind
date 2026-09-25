import { CodeRain } from '../ui/CodeRain';
import { RedArrow } from '../ui/RedArrow';
import { TransitionLink } from '../ui/TransitionLink';

function Status({ className }: { className: string }) {
  return (
    <span
      className={`items-center gap-2 font-mono tracking-[0.03em] text-green-700 dark:text-green-500 ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="status-ripple absolute inset-0 rounded-full" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-500" />
      </span>
      Taking new projects
    </span>
  );
}

export function Hero() {
  return (
    <section
      style={{ paddingBottom: 'var(--nav-h, 74px)' }}
      className="relative isolate w-full h-full flex flex-col items-center justify-center text-center overflow-hidden"
    >
      <CodeRain />

      <Status className="absolute top-1 left-2 z-10 flex text-[11px] sm:hidden" />

      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-12">
        <p className="font-mono text-[11px] sm:text-xs tracking-[0.03em] text-zinc-500 dark:text-zinc-400">
          Fullstack developer · Stockholm
        </p>

        {/* The red dot hangs outside the word (zero width), so the word itself is
            what is centred. The small lift evens out the space above and below
            the lowercase letters, which sit low in their line box. */}
        <h1
          aria-label="Alexander Tjernström"
          className="font-headline -translate-y-[0.09em] font-extralight leading-none tracking-[0.02em] text-[clamp(2.5rem,7vw,5rem)]"
        >
          tjrnstrm.

        </h1>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-[11px] sm:text-xs tracking-[0.03em] text-zinc-500 dark:text-zinc-400">
          {/* Beside the link from sm up; on a phone it sits just below the navbar. */}
          <Status className="hidden sm:flex" />
          <TransitionLink
            to="/contact"
            className="group relative inline-flex items-center gap-2 text-zinc-900 after:absolute after:-inset-x-2 after:-inset-y-3 after:content-[''] dark:text-zinc-100"
          >
            <span className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-[6px] transition-colors group-hover:decoration-current">
              Tell me what to build
            </span>
            <RedArrow />
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
