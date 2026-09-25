import { useHeightVar } from '../../hooks/useHeightVar';
import { PAGE_HEADING } from '../../lib/type';
import { ContactDetails } from './ContactDetails';
import { ServicesList } from './ServicesList';

/**
 * The left side of the contact page. On desktop it is one frosted panel that
 * holds the pitch, services, client work, GitHub and email, and follows the
 * scroll while the form is filled in (see .pitch-sticky in index.css; it is
 * taller than most screens, so it pins by its bottom edge using --panel-h).
 * On mobile only the pitch is here; the rest sits below the form.
 */
export function PitchPanel() {
  const ref = useHeightVar<HTMLDivElement>('--panel-h');

  return (
    <div
      ref={ref}
      className="reveal pitch-sticky flex flex-col gap-10 lg:glass lg:col-start-1 lg:row-start-1 lg:self-start lg:rounded-[28px] lg:p-10"
    >
      <section className="flex flex-col gap-7">
        <p className="-mb-3 font-mono text-xs tracking-[0.03em] text-zinc-500 dark:text-zinc-400">
          Free consultation
        </p>
        <h1 className={PAGE_HEADING}>Tell me what to build.</h1>
        <p className="max-w-[46ch] text-base leading-relaxed text-zinc-700 sm:text-[17px] dark:text-zinc-300">
          Websites, apps and APIs, from first call to launch. Fill in the brief
          and I will come back with an honest take on scope, stack and cost. The
          consultation is free.
        </p>
      </section>
      <div className="hidden lg:block">
        <ServicesList />
      </div>
      <div className="hidden lg:contents">
        <ContactDetails />
      </div>
    </div>
  );
}
