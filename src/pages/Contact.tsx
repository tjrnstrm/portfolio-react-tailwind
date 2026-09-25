import { useEffect, useRef, useState, type FormEvent } from 'react';
import { BriefForm } from '../components/contact/BriefForm';
import { BriefSent } from '../components/contact/BriefSent';
import { ContactDetails } from '../components/contact/ContactDetails';
import { PitchPanel } from '../components/contact/PitchPanel';
import { ServicesList } from '../components/contact/ServicesList';
import { Footer } from '../components/layout/Footer';
import { CodeRain } from '../components/ui/CodeRain';
import { STEPS } from '../data/brief';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  INITIAL_BRIEF,
  mailtoHref,
  missingFields,
  summarise,
  type Brief,
} from '../lib/brief';
import { playSound } from '../lib/sound';

export function Contact() {
  useDocumentTitle('Tell me what to build · Alexander Tjernström');

  const [brief, setBrief] = useState<Brief>(INITIAL_BRIEF);
  const [done, setDone] = useState(false);
  // Nothing is flagged until the first Send attempt; after that the stars
  // follow the fields live.
  const [showErrors, setShowErrors] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const doneHeadingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const set = (patch: Partial<Brief>) => setBrief((b) => ({ ...b, ...patch }));

  // Bring the swapped-in view (confirmation or form) to the top of the column.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.scrollIntoView({ block: 'start' });
    if (done) doneHeadingRef.current?.focus({ preventScroll: true });
  }, [done]);

  const rows = summarise(brief);
  const href = mailtoHref(brief, rows);
  const missing = missingFields(brief);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (missing.name || missing.email) {
      playSound('error');
      setShowErrors(true);
      const first = e.currentTarget.elements.namedItem(
        missing.name ? 'name' : 'email',
      );
      if (first instanceof HTMLElement) first.focus();
      return;
    }
    playSound('success');
    setDone(true);
    window.location.href = href;
  };

  return (
    // Pulled up under the navbar so the code rain behind the glass runs to the top
    // edge; the content starts 1.5rem below it (the pill state of the navbar ends
    // 1.25rem above that, see Navbar.tsx).
    <div
      style={{
        marginTop: 'calc(var(--nav-h, 72px) * -1)',
        paddingTop: 'calc(var(--nav-h, 72px) + 1.5rem)',
      }}
      className="relative isolate overflow-clip px-4 font-heading sm:px-8 lg:px-12"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <CodeRain variant="page" />
      </div>

      <div className="grid gap-y-8 lg:mb-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-6">
        <PitchPanel />

        <div
          ref={mainRef}
          className="flex scroll-mt-24 flex-col gap-5 lg:col-start-2 lg:row-start-1"
        >
          <div className="reveal flex flex-col justify-between gap-1 px-2 pb-1 font-mono text-[11px] tracking-[0.03em] text-zinc-600 sm:flex-row sm:items-center lg:pt-2 dark:text-zinc-400">
            <span>Project brief</span>
            <span>{STEPS} steps · no cost · no commitment</span>
          </div>

          {!done ? (
            <BriefForm
              brief={brief}
              set={set}
              flagged={{
                name: showErrors && missing.name,
                email: showErrors && missing.email,
              }}
              onSubmit={onSubmit}
            />
          ) : (
            <BriefSent
              rows={rows}
              href={href}
              onEdit={() => setDone(false)}
              headingRef={doneHeadingRef}
            />
          )}
        </div>
      </div>

      {/* Mobile only: on desktop all of this lives in the sticky panel. */}
      <aside className="mt-10 mb-4 flex flex-col gap-12 lg:hidden">
        <ServicesList />
        <ContactDetails />
      </aside>
      <Footer />
    </div>
  );
}
