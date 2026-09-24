import { CtaPill } from './CtaPill';

/** Closing call-to-action between About and the footer. */
export function ContactCta() {
  return (
    <section id="brief" className="scroll-mt-24 py-14">
      <div className="flex flex-col gap-8 border-t border-zinc-300 pt-12 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-200/10">
        <div>
          <p className="font-mono text-[10px] text-zinc-600 dark:text-zinc-400 tracking-[0.2em] uppercase">
            Got a project?
          </p>
          <h2 className="font-heading text-[clamp(2rem,5.5vw,3.5rem)] font-light tracking-[0.15em] uppercase">
            Tell me what to build<span className="text-red-500">.</span>
          </h2>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <CtaPill to="/contact" size="lg">
            Start the brief
          </CtaPill>
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-zinc-500">
            Free consultation · 5 questions · no commitment
          </p>
        </div>
      </div>
    </section>
  );
}
