import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { MdArrowOutward } from 'react-icons/md';
import { Footer } from '../components/Footer';
import { clientProjects } from '../data/projects';

const EMAIL = 'tjernstrom@proton.me';

type Choice = { id: string; label: string };
type Category = Choice & { types: string[] };

const CATEGORIES: Category[] = [
  {
    id: 'website',
    label: 'Website',
    types: ['Landing page', 'Company site', 'E-commerce', 'Booking site', 'Portfolio', 'Blog / CMS'],
  },
  {
    id: 'app',
    label: 'App',
    types: ['Web app / SaaS', 'Mobile app', 'Internal tool', 'Dashboard', 'Customer portal'],
  },
  {
    id: 'api',
    label: 'API',
    types: ['REST API', 'GraphQL API', 'Integrations', 'Payments (Stripe)', 'Backend for an existing app'],
  },
  { id: 'unsure', label: 'Not sure yet', types: [] },
];

const DOMAIN: Choice[] = [
  { id: 'have', label: 'Yes, I have one' },
  { id: 'want', label: 'No, I want one' },
  { id: 'none', label: 'Not needed' },
];

const MAIL: Choice[] = [
  { id: 'have', label: 'Yes, already set up' },
  { id: 'want', label: 'No, set one up for me' },
  { id: 'none', label: 'Not needed' },
];

const WHEN = ['As soon as possible', 'Within 1–3 months', 'Flexible'];

const SERVICES: [string, string][] = [
  ['Websites', 'Landing pages, company sites, e-commerce, booking, portfolios, blogs'],
  ['Apps', 'Web apps and SaaS, mobile apps, internal tools, dashboards, portals'],
  ['APIs', 'REST and GraphQL, integrations, Stripe payments, backends'],
  ['The rest', 'Domains, DNS, business email and hosting'],
];

type Brief = {
  cats: string[];
  types: string[];
  domain: string;
  domainValue: string;
  mail: string;
  mailValue: string;
  idea: string;
  when: string;
  name: string;
  email: string;
  company: string;
  phone: string;
};

const INITIAL: Brief = {
  cats: ['website'],
  types: [],
  domain: '',
  domainValue: '',
  mail: '',
  mailValue: '',
  idea: '',
  when: '',
  name: '',
  email: '',
  company: '',
  phone: '',
};

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

function summarise(b: Brief): [string, string][] {
  const project = CATEGORIES.filter((c) => b.cats.includes(c.id)).map((c) => {
    const picked = c.types.filter((t) => b.types.includes(`${c.id}:${t}`));
    return picked.length ? `${c.label} (${picked.join(', ')})` : c.label;
  });
  const choice = (list: Choice[], id: string, value: string) => {
    const label = list.find((o) => o.id === id)?.label;
    if (!label) return 'Not specified';
    return value.trim() ? `${label} · ${value.trim()}` : label;
  };
  const who = [b.name.trim(), b.company.trim() && `(${b.company.trim()})`]
    .filter(Boolean)
    .join(' ');

  const rows: [string, string][] = [
    ['Project', project.length ? project.join('; ') : 'Not specified'],
    ['Domain', choice(DOMAIN, b.domain, b.domainValue)],
    ['Email', choice(MAIL, b.mail, b.mailValue)],
    ['Idea', b.idea.trim() || 'Not specified'],
    ['Timeline', b.when || 'Not specified'],
    ['From', who || 'Not specified'],
    ['Reply to', b.email.trim() || 'Not specified'],
  ];
  if (b.phone.trim()) rows.push(['Phone', b.phone.trim()]);
  return rows;
}

const briefText = (rows: [string, string][]) =>
  rows.map(([k, v]) => `${k}: ${v}`).join('\n');

function mailtoHref(b: Brief, rows: [string, string][]) {
  const subject = `Project brief${b.name.trim() ? ` from ${b.name.trim()}` : ''}`;
  const body = briefText(rows).replace(/\n/g, '\r\n');
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const monoLabel =
  'font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-600 dark:text-zinc-400';

const fieldLabel =
  'text-[13px] font-medium text-zinc-600 dark:text-zinc-400';

const pillFocus =
  'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black/30 dark:focus-visible:outline-white/40';

const CHIP_SIZE = {
  sm: 'min-h-11 text-sm',
  md: 'min-h-12 text-[15px]',
};

type ChipProps = {
  type: 'checkbox' | 'radio';
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  size: keyof typeof CHIP_SIZE;
};

/** A real checkbox/radio dressed as a glass chip (styles: .chip in index.css). */
function Chip({ type, name, label, checked, onChange, size }: ChipProps) {
  return (
    <label className={`chip ${CHIP_SIZE[size]}`}>
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="chip-mark" aria-hidden="true">
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 6.2l2.3 2.3 4.7-5" />
        </svg>
      </span>
      {label}
    </label>
  );
}

function Question({
  n,
  id,
  title,
  hint,
  children,
}: {
  n: string;
  id: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="group"
      aria-labelledby={id}
      className="glass grid grid-cols-1 gap-y-4 rounded-[28px] p-5 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-x-2 sm:gap-y-0 sm:p-9"
    >
      <span
        aria-hidden="true"
        className="glass-badge flex size-[34px] items-center justify-center rounded-full font-mono text-xs text-red-600 dark:text-red-400"
      >
        {n}
      </span>
      <div className="flex min-w-0 flex-col gap-[22px]">
        <h2
          id={id}
          className="text-2xl font-normal tracking-tight sm:text-[28px]"
        >
          {title}
        </h2>
        {hint && (
          <p className="-mt-2.5 text-[15px] leading-normal text-zinc-600 dark:text-zinc-400">
            {hint}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className={fieldLabel}>{label}</span>
      {children}
    </label>
  );
}

export function Contact() {
  const [brief, setBrief] = useState<Brief>(INITIAL);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const doneHeadingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const set = (patch: Partial<Brief>) => setBrief((b) => ({ ...b, ...patch }));

  useEffect(() => {
    const previous = document.title;
    document.title = 'Tell me what to build · Alexander Tjernström';
    return () => {
      document.title = previous;
    };
  }, []);

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

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
    window.location.href = href;
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(briefText(rows));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const groups = CATEGORIES.filter((c) => brief.cats.includes(c.id) && c.types.length);

  return (
    // Pulled up under the navbar so the blobs behind the glass run to the top edge.
    <div
      style={{
        marginTop: 'calc(var(--nav-h, 74px) * -1)',
        paddingTop: 'var(--nav-h, 74px)',
      }}
      className="relative isolate overflow-clip px-4 font-heading sm:px-8 lg:px-12"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
      </div>

      <div className="grid gap-y-8 pt-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_auto_1fr] lg:gap-x-6 lg:gap-y-0">
        {/* Frosted panel behind the pitch (desktop only) */}
        <div
          aria-hidden="true"
          className="glass hidden rounded-[28px] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:block"
        />

        {/* Pitch */}
        <section className="relative flex flex-col gap-7 lg:col-start-1 lg:row-start-1 lg:p-10 lg:pb-12">
          <span className="glass-tag flex w-fit items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] uppercase text-green-700 dark:text-green-500">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="status-ripple absolute inset-0 rounded-full" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-500" />
            </span>
            Taking new projects
          </span>
          <p className="-mb-3 mt-4 font-mono text-[11px] tracking-[0.26em] uppercase text-zinc-500 dark:text-zinc-400">
            Free consultation · Stockholm
          </p>
          <h1 className="text-4xl leading-[1.05] font-extralight tracking-[0.1em] uppercase wrap-break-word sm:text-6xl lg:text-[clamp(2.75rem,4.2vw,4.5rem)]">
            Tell me what to build<span className="text-red-500">.</span>
          </h1>
          <p className="max-w-[46ch] text-base leading-relaxed text-zinc-700 sm:text-[17px] dark:text-zinc-300">
            Websites, apps and APIs, from first call to launch. Fill in the
            brief and I will come back with an honest take on scope, stack and
            cost. The consultation is free.
          </p>
        </section>

        {/* Brief */}
        <div
          ref={mainRef}
          className="flex scroll-mt-24 flex-col gap-5 lg:col-start-2 lg:row-span-3 lg:row-start-1"
        >
          <div className="flex flex-col justify-between gap-1 px-2 pb-1 font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-600 sm:flex-row sm:items-center lg:pt-2 dark:text-zinc-400">
            <span>Project brief</span>
            <span>5 questions · no cost · no commitment</span>
          </div>

          {!done ? (
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <Question
                n="01"
                id="q-build"
                title="What are we building?"
                hint="Pick everything that applies. Not sure is a perfectly good answer."
              >
                <div className="flex flex-wrap gap-2.5">
                  {CATEGORIES.map((c) => (
                    <Chip
                      key={c.id}
                      type="checkbox"
                      name="category"
                      size="md"
                      label={c.label}
                      checked={brief.cats.includes(c.id)}
                      onChange={() => set({ cats: toggle(brief.cats, c.id) })}
                    />
                  ))}
                </div>
                {groups.map((c) => (
                  <div key={c.id} className="flex flex-col gap-2.5">
                    <span className={fieldLabel}>{c.label}: what kind?</span>
                    <div className="flex flex-wrap gap-2">
                      {c.types.map((t) => {
                        const key = `${c.id}:${t}`;
                        return (
                          <Chip
                            key={key}
                            type="checkbox"
                            name={`type-${c.id}`}
                            size="sm"
                            label={t}
                            checked={brief.types.includes(key)}
                            onChange={() => set({ types: toggle(brief.types, key) })}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </Question>

              <Question
                n="02"
                id="q-domain"
                title="Do you have a domain?"
                hint="The address people type to find you, like yourcompany.se."
              >
                <div role="radiogroup" aria-labelledby="q-domain" className="flex flex-wrap gap-2.5">
                  {DOMAIN.map((o) => (
                    <Chip
                      key={o.id}
                      type="radio"
                      name="domain"
                      size="md"
                      label={o.label}
                      checked={brief.domain === o.id}
                      onChange={() => set({ domain: o.id, domainValue: '' })}
                    />
                  ))}
                </div>
                {(brief.domain === 'have' || brief.domain === 'want') && (
                  <Field
                    className="max-w-lg"
                    label={brief.domain === 'have' ? 'Which domain?' : 'Any names in mind?'}
                  >
                    <input
                      type="text"
                      value={brief.domainValue}
                      onChange={(e) => set({ domainValue: e.target.value })}
                      placeholder={brief.domain === 'have' ? 'yourcompany.se' : 'yourcompany.se, yourcompany.com'}
                      className="glass-field"
                    />
                  </Field>
                )}
              </Question>

              <Question
                n="03"
                id="q-mail"
                title="What about email?"
                hint="An address on your own domain, like hello@yourcompany.se."
              >
                <div role="radiogroup" aria-labelledby="q-mail" className="flex flex-wrap gap-2.5">
                  {MAIL.map((o) => (
                    <Chip
                      key={o.id}
                      type="radio"
                      name="mail"
                      size="md"
                      label={o.label}
                      checked={brief.mail === o.id}
                      onChange={() => set({ mail: o.id, mailValue: '' })}
                    />
                  ))}
                </div>
                {(brief.mail === 'have' || brief.mail === 'want') && (
                  <Field
                    className="max-w-lg"
                    label={brief.mail === 'have' ? 'Which provider?' : 'Which addresses do you need?'}
                  >
                    <input
                      type="text"
                      value={brief.mailValue}
                      onChange={(e) => set({ mailValue: e.target.value })}
                      placeholder={
                        brief.mail === 'have'
                          ? 'Google Workspace, Outlook, One.com...'
                          : 'hello@, info@, one per person...'
                      }
                      className="glass-field"
                    />
                  </Field>
                )}
              </Question>

              <Question n="04" id="q-idea" title="Tell me about it">
                <Field label="The idea, in your own words">
                  <textarea
                    rows={5}
                    value={brief.idea}
                    onChange={(e) => set({ idea: e.target.value })}
                    placeholder="What it should do, who it is for, sites or apps you like..."
                    className="glass-field"
                  />
                </Field>
                <div className="flex flex-col gap-2.5">
                  <span id="q-when" className={fieldLabel}>
                    When do you need it?
                  </span>
                  <div role="radiogroup" aria-labelledby="q-when" className="flex flex-wrap gap-2">
                    {WHEN.map((w) => (
                      <Chip
                        key={w}
                        type="radio"
                        name="when"
                        size="sm"
                        label={w}
                        checked={brief.when === w}
                        onChange={() => set({ when: w })}
                      />
                    ))}
                  </div>
                </div>
              </Question>

              <Question n="05" id="q-who" title="Who am I talking to?">
                <div className="grid gap-x-5 gap-y-[18px] sm:grid-cols-2">
                  <Field label="Name">
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={brief.name}
                      onChange={(e) => set({ name: e.target.value })}
                      className="glass-field"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={brief.email}
                      onChange={(e) => set({ email: e.target.value })}
                      className="glass-field"
                    />
                  </Field>
                  <Field label="Company (optional)">
                    <input
                      type="text"
                      autoComplete="organization"
                      value={brief.company}
                      onChange={(e) => set({ company: e.target.value })}
                      className="glass-field"
                    />
                  </Field>
                  <Field label="Phone (optional)">
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={brief.phone}
                      onChange={(e) => set({ phone: e.target.value })}
                      className="glass-field"
                    />
                  </Field>
                </div>
                <button
                  type="submit"
                  className={`glass-pill glass-pill--primary group mt-1 inline-flex min-h-14 items-center gap-5 self-start rounded-full px-7 text-left text-[15px] font-medium ${pillFocus}`}
                >
                  <span>Send brief · book free consultation</span>
                  <span
                    aria-hidden="true"
                    className="text-red-400 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </button>
              </Question>
            </form>
          ) : (
            <div className="glass flex flex-col gap-7 rounded-[28px] p-6 sm:p-10">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-green-700 dark:text-green-500">
                One step left
              </p>
              <h2
                ref={doneHeadingRef}
                tabIndex={-1}
                className="text-[clamp(2.5rem,6vw,4rem)] font-extralight tracking-[0.1em] uppercase outline-none"
              >
                Hit send<span className="text-red-500">.</span>
              </h2>
              <p className="max-w-[52ch] leading-relaxed text-zinc-600 dark:text-zinc-400">
                Your mail app should have opened with the brief filled in. Send
                it from there and I will reply by email. Nothing opened? Copy
                the brief and send it to{' '}
                <a
                  href={`mailto:${EMAIL}`}
                  className="underline transition-colors hover:text-zinc-950 dark:hover:text-zinc-200"
                >
                  {EMAIL}
                </a>
                .
              </p>
              <dl className="max-w-2xl">
                {rows.map(([k, v]) => (
                  <div
                    key={k}
                    className="grid gap-1 border-t border-zinc-900/10 py-3.5 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-6 dark:border-white/10"
                  >
                    <dt className={`${monoLabel} sm:text-[11px]`}>{k}</dt>
                    <dd className="text-[15px] wrap-break-word whitespace-pre-wrap">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap items-center gap-3 text-[15px] font-medium">
                <a
                  href={href}
                  className={`glass-pill glass-pill--primary flex min-h-12 items-center rounded-full px-6 ${pillFocus}`}
                >
                  Open mail app
                </a>
                <button
                  type="button"
                  onClick={copyBrief}
                  className={`glass-pill min-h-12 rounded-full px-6 ${pillFocus}`}
                >
                  {copied ? 'Copied' : 'Copy brief'}
                </button>
                <button
                  type="button"
                  onClick={() => setDone(false)}
                  className={`glass-pill min-h-12 rounded-full px-6 ${pillFocus}`}
                >
                  Edit brief
                </button>
                <span role="status" className="sr-only">
                  {copied ? 'Brief copied to clipboard' : ''}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <aside className="relative flex flex-col gap-12 lg:col-start-1 lg:row-start-2 lg:px-10 lg:pb-12">
          <div className="flex flex-col gap-4">
            <p className={monoLabel}>What I build</p>
            <dl>
              {SERVICES.map(([k, v], i) => (
                <div
                  key={k}
                  className={`grid gap-1 border-t border-zinc-900/10 py-4 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-4 dark:border-white/10 ${
                    i === SERVICES.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <dt className="text-[13px] font-medium tracking-[0.15em] uppercase">{k}</dt>
                  <dd className="text-sm leading-normal text-zinc-600 dark:text-zinc-400">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-4">
            <p className={monoLabel}>Recent client work</p>
            <ul>
              {clientProjects.map((p, i) => (
                <li
                  key={p.name}
                  className={`border-t border-zinc-900/10 dark:border-white/10 ${
                    i === clientProjects.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-baseline justify-between gap-4 py-4"
                  >
                    <span className="flex items-center gap-1.5 text-base font-medium transition-opacity group-hover:opacity-70">
                      {p.name}
                      <MdArrowOutward size={13} className="text-zinc-500" />
                    </span>
                    <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                      {p.tags?.join(' · ')}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-600 dark:text-zinc-400">
            <span>Prefer plain email?</span>
            <a
              href={`mailto:${EMAIL}`}
              className="font-heading text-sm tracking-normal text-zinc-900 normal-case transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
            >
              {EMAIL}
            </a>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
