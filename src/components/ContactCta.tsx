import { CtaPill } from './CtaPill';
import { PAGE_HEADING } from '../lib/type';

/** Closing call-to-action between About and the footer. */
export function ContactCta() {
  return (
    <section id="brief" className="scroll-mt-24 py-14">
      <div className="flex flex-col gap-8 border-t border-zinc-300 pt-12 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-200/10">
        <div>
          <p className="font-mono text-[11px] tracking-[0.03em] text-zinc-600 dark:text-zinc-400">
            Got a project?
          </p>
          <h2 className={PAGE_HEADING}>
            Tell me what to build.
          </h2>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <CtaPill to="/contact" size="lg">
            Start the brief
          </CtaPill>
          <p className="font-mono text-[11px] tracking-[0.03em] text-zinc-500">
            Free consultation · 6 steps · no commitment
          </p>
        </div>
      </div>
    </section>
  );
}
