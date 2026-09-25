import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from 'react';
import { MdArrowOutward } from 'react-icons/md';
import { Footer } from '../components/Footer';
import { HeroBackground } from '../components/HeroBackground';
import { playSound } from '../lib/sound';
import { clientProjects } from '../data/projects';

const EMAIL = 'tjernstrom@proton.me';
const GITHUB = 'https://github.com/tZandr';
const EMAIL_RE = /^\S+@\S+\.\S+$/;

type Choice = { id: string; label: string };
type Category = Choice & { types: string[] };

const CATEGORIES: Category[] = [
  {
    id: 'website',
    label: 'Website',
    types: ['Landing page', 'Company site', 'E-commerce', 'Booking site', 'Blog / CMS'],
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    types: [
      'Photography',
      'Design / creative',
      'Developer',
      'Music / audio',
      'Art / illustration',
      'Personal CV',
    ],
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
  { id: 'other', label: 'Something else', types: [] },
  { id: 'unsure', label: 'Not sure yet', types: [] },
];

const SECTIONS: Choice[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'services', label: 'Services / offer' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work / gallery' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'faq', label: 'FAQ' },
  { id: 'booking', label: 'Booking' },
  { id: 'team', label: 'Team' },
  { id: 'blog', label: 'News / blog' },
  { id: 'hours', label: 'Map & hours' },
  { id: 'contact', label: 'Contact form' },
];

const STYLES: Choice[] = [
  { id: 'clean', label: 'Clean & minimal' },
  { id: 'glass', label: 'Glass / iOS' },
  { id: 'bold', label: 'Bold & graphic' },
  { id: 'premium', label: 'Premium' },
  { id: 'warm', label: 'Warm & friendly' },
  { id: 'corporate', label: 'Corporate' },
];

const THEMES: Choice[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'both', label: 'Both (toggleable)' },
];

const LANGS: Choice[] = [
  { id: 'sv', label: 'Swedish' },
  { id: 'en', label: 'English' },
  { id: 'both', label: 'Both (switchable)' },
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

const STEPS = 6;

const SERVICES: [string, string][] = [
  ['Websites', 'Landing pages, e-commerce, booking'],
  ['Apps', 'SaaS, mobile, internal tools, dashboards'],
  ['APIs', 'REST, GraphQL, Stripe, backends'],
  ['The rest', 'Domains, DNS, business email, hosting'],
];

type Brief = {
  cats: string[];
  types: string[];
  other: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  location: string;
  audience: string;
  secs: string[];
  cta: string;
  style: string;
  theme: string;
  lang: string;
  color: string;
  domain: string;
  domainValue: string;
  mail: string;
  mailValue: string;
  when: string;
  refs: string;
  idea: string;
};

const INITIAL: Brief = {
  cats: ['website'],
  types: [],
  other: '',
  name: '',
  email: '',
  phone: '',
  company: '',
  industry: '',
  location: '',
  audience: '',
  secs: [],
  cta: '',
  style: '',
  theme: '',
  lang: '',
  color: '',
  domain: '',
  domainValue: '',
  mail: '',
  mailValue: '',
  when: '',
  refs: '',
  idea: '',
};

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

const labelOf = (list: Choice[], id: string) => list.find((o) => o.id === id)?.label;

/** Only answered questions make it into the brief; the three that always do come first. */
function summarise(b: Brief): [string, string][] {
  const project = CATEGORIES.filter((c) => b.cats.includes(c.id)).map((c) => {
    const picked = c.types.filter((t) => b.types.includes(`${c.id}:${t}`));
    return picked.length ? `${c.label} (${picked.join(', ')})` : c.label;
  });
  const choice = (list: Choice[], id: string, value: string) => {
    const label = labelOf(list, id);
    if (!label) return '';
    return value.trim() ? `${label} · ${value.trim()}` : label;
  };
  const who = [b.name.trim(), b.company.trim() && `(${b.company.trim()})`]
    .filter(Boolean)
    .join(' ');
  const feel = [
    labelOf(STYLES, b.style),
    b.theme === 'both' ? 'light and dark (toggleable)' : labelOf(THEMES, b.theme)?.toLowerCase(),
    b.lang === 'both'
      ? 'Swedish and English copy (switchable)'
      : labelOf(LANGS, b.lang) && `${labelOf(LANGS, b.lang)} copy`,
  ]
    .filter(Boolean)
    .join(', ');
  const sections = SECTIONS.filter((s) => b.secs.includes(s.id)).map((s) => s.label);

  const rows: [string, string][] = [
    ['Project', project.length ? project.join('; ') : 'Not specified'],
    ['From', who || 'Not specified'],
    ['Reply to', b.email.trim() || 'Not specified'],
    ['Phone', b.phone.trim()],
    ['What they do', b.industry.trim()],
    ['Location', b.location.trim()],
    ['Customers', b.audience.trim()],
    ['Something else', b.cats.includes('other') ? b.other.trim() : ''],
    ['Sections', sections.join(', ')],
    ['Visitors should', b.cta.trim()],
    ['Feel', feel],
    ['Brand colour', b.color.trim()],
    ['Domain', choice(DOMAIN, b.domain, b.domainValue)],
    ['Business email', choice(MAIL, b.mail, b.mailValue)],
    ['Timeline', b.when],
    ['Sites they like', b.refs.trim()],
    ['Notes', b.idea.trim()],
  ];
  return rows.filter(([k, v]) => v || k === 'Project');
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
        onChange={() => {
          playSound('toggle');
          onChange();
        }}
        className="sr-only"
      />
      <span className="chip-tick" aria-hidden="true">
        <svg
          width="14"
          height="14"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
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

/**
 * Follow-up questions open and close with a height and fade animation instead
 * of popping in (styles: .fold in index.css). Closed content stays mounted but
 * inert, so it is out of the tab order and hidden from screen readers.
 */
function Fold({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div className={`fold${open ? ' open' : ''}`} inert={!open}>
      <div className="fold-in">{children}</div>
    </div>
  );
}

type ChoicesProps = {
  name: string;
  options: Choice[];
  selected: string[];
  onPick: (id: string) => void;
  size: keyof typeof CHIP_SIZE;
  radio?: boolean;
  label?: string;
  /** Fan the chips in one after another when their fold opens. */
  stagger?: boolean;
};

/** A labelled row of chips: checkboxes by default, radios with `radio`. */
function Choices({ name, options, selected, onPick, size, radio, label, stagger }: ChoicesProps) {
  const labelId = `${name}-label`;
  return (
    <div className="flex flex-col gap-2.5">
      {label && (
        <span id={labelId} className={fieldLabel}>
          {label}
        </span>
      )}
      <div
        role={label ? (radio ? 'radiogroup' : 'group') : undefined}
        aria-labelledby={label ? labelId : undefined}
        className={`flex flex-wrap ${size === 'md' ? 'gap-2.5' : 'gap-2'}`}
      >
        {options.map((o, i) => {
          const chip = (
            <Chip
              key={o.id}
              type={radio ? 'radio' : 'checkbox'}
              name={name}
              size={size}
              label={o.label}
              checked={selected.includes(o.id)}
              onChange={() => onPick(o.id)}
            />
          );
          return stagger ? (
            <span key={o.id} className="fold-item" style={{ '--i': i } as CSSProperties}>
              {chip}
            </span>
          ) : (
            chip
          );
        })}
      </div>
    </div>
  );
}

function Question({
  id,
  title,
  hint,
  children,
}: {
  id: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="group"
      aria-labelledby={id}
      className="reveal glass flex min-w-0 flex-col gap-[22px] rounded-[28px] p-5 sm:p-9"
    >
      <h2 id={id} className="text-2xl font-normal tracking-tight sm:text-[28px]">
        {title}
      </h2>
      {hint && (
        <p className="-mt-2.5 text-[15px] leading-normal text-zinc-600 dark:text-zinc-400">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

/** `required` adds a * after the label; `flagged` turns it red (a mandatory field left empty). */
function Field({
  label,
  children,
  className = '',
  required,
  flagged,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
  flagged?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className={fieldLabel}>
        {label}
        {required && (
          <span
            aria-hidden="true"
            className={`ml-1 transition-colors duration-200 ${
              flagged ? 'text-red-500' : 'text-zinc-400 dark:text-zinc-500'
            }`}
          >
            *
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

function Services() {
  return (
    <div className="flex flex-col gap-4">
      <p className={monoLabel}>What I build</p>
      <dl>
        {SERVICES.map(([k, v], i) => (
          <div
            key={k}
            className={`grid gap-1 border-t border-zinc-900/10 py-3.5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4 dark:border-white/10 ${
              i === SERVICES.length - 1 ? 'border-b' : ''
            }`}
          >
            <dt className="text-[13px] font-medium tracking-[0.15em] uppercase">{k}</dt>
            <dd className="text-sm leading-normal text-zinc-600 dark:text-zinc-400">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Client work, GitHub and plain email. Sibling blocks, so the parent sets the gap. */
function Details() {
  return (
    <>
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

      <div className="flex flex-col gap-4">
        <p className={monoLabel}>More work</p>
        <a
          href={GITHUB}
          target="_blank"
          rel="noreferrer"
          className="group flex items-baseline justify-between gap-4 border-y border-zinc-900/10 py-4 dark:border-white/10"
        >
          <span className="flex items-center gap-1.5 text-base font-medium transition-opacity group-hover:opacity-70">
            GitHub
            <MdArrowOutward size={13} className="text-zinc-500" />
          </span>
          <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
            github.com/tZandr
          </span>
        </a>
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
    </>
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

  // The sticky panel is taller than most screens, so index.css pins it by its
  // bottom edge; that needs its height as a CSS variable.
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const update = () => el.style.setProperty('--panel-h', `${el.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rows = summarise(brief);
  const href = mailtoHref(brief, rows);

  // Mandatory fields. Nothing is flagged until the first Send attempt; after
  // that the stars follow the fields live.
  const [showErrors, setShowErrors] = useState(false);
  const missing = {
    name: !brief.name.trim(),
    email: !EMAIL_RE.test(brief.email.trim()),
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (missing.name || missing.email) {
      playSound('error');
      setShowErrors(true);
      const first = e.currentTarget.elements.namedItem(missing.name ? 'name' : 'email');
      if (first instanceof HTMLElement) first.focus();
      return;
    }
    playSound('success');
    setDone(true);
    window.location.href = href;
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(briefText(rows));
      playSound('success');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
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
        <HeroBackground variant="page" />
      </div>

      <div className="grid gap-y-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-6">
        {/* Pitch. On desktop this is one frosted panel that holds the pitch,
            services, client work, GitHub and email, and follows the scroll while
            the form is filled in (see .pitch-sticky in index.css). */}
        <div
          ref={panelRef}
          className="reveal pitch-sticky flex flex-col gap-10 lg:glass lg:col-start-1 lg:row-start-1 lg:self-start lg:rounded-[28px] lg:p-10"
        >
          <section className="flex flex-col gap-7">
            <p className="-mb-3 font-mono text-[11px] tracking-[0.26em] uppercase text-zinc-500 dark:text-zinc-400">
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
          <div className="hidden lg:block">
            <Services />
          </div>
          <div className="hidden lg:contents">
            <Details />
          </div>
        </div>

        {/* Brief */}
        <div
          ref={mainRef}
          className="flex scroll-mt-24 flex-col gap-5 lg:col-start-2 lg:row-start-1"
        >
          <div className="reveal flex flex-col justify-between gap-1 px-2 pb-1 font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-600 sm:flex-row sm:items-center lg:pt-2 dark:text-zinc-400">
            <span>Project brief</span>
            <span>{STEPS} steps · no cost · no commitment</span>
          </div>

          {!done ? (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
              <Question
                id="q-build"
                title="What are we building?"
                hint="Pick everything that applies. Not sure is a perfectly good answer."
              >
                <Choices
                  name="category"
                  size="md"
                  options={CATEGORIES}
                  selected={brief.cats}
                  onPick={(id) => set({ cats: toggle(brief.cats, id) })}
                />
                {CATEGORIES.filter((c) => c.types.length).map((c) => (
                  <Fold key={c.id} open={brief.cats.includes(c.id)}>
                    <Choices
                      stagger
                      name={`type-${c.id}`}
                      size="sm"
                      label={`${c.label}: what kind?`}
                      options={c.types.map((t) => ({ id: `${c.id}:${t}`, label: t }))}
                      selected={brief.types}
                      onPick={(id) => set({ types: toggle(brief.types, id) })}
                    />
                  </Fold>
                ))}
                <Fold open={brief.cats.includes('other')}>
                  <Field label="Something else: describe it">
                    <input
                      type="text"
                      value={brief.other}
                      onChange={(e) => set({ other: e.target.value })}
                      placeholder="A digital menu for a restaurant, an event page, a members club..."
                      className="glass-field"
                    />
                  </Field>
                </Fold>
              </Question>

              <Question
                id="q-who"
                title="About you"
                hint="So I know who I am building for, and where to reply. Fields marked * are required."
              >
                <div className="grid gap-x-5 gap-y-[18px] sm:grid-cols-2">
                  <Field label="Your name" required flagged={showErrors && missing.name}>
                    <input
                      type="text"
                      name="name"
                      required
                      aria-invalid={showErrors && missing.name}
                      autoComplete="name"
                      value={brief.name}
                      onChange={(e) => set({ name: e.target.value })}
                      className="glass-field"
                    />
                  </Field>
                  <Field label="Email" required flagged={showErrors && missing.email}>
                    <input
                      type="email"
                      name="email"
                      required
                      aria-invalid={showErrors && missing.email}
                      autoComplete="email"
                      value={brief.email}
                      onChange={(e) => set({ email: e.target.value })}
                      placeholder="you@company.se"
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
                  <Field label="Company (optional)">
                    <input
                      type="text"
                      autoComplete="organization"
                      value={brief.company}
                      onChange={(e) => set({ company: e.target.value })}
                      placeholder="Your company AB"
                      className="glass-field"
                    />
                  </Field>
                  <Field label="What you do">
                    <input
                      type="text"
                      value={brief.industry}
                      onChange={(e) => set({ industry: e.target.value })}
                      placeholder="Excavation contractor, hair salon..."
                      className="glass-field"
                    />
                  </Field>
                  <Field label="Location">
                    <input
                      type="text"
                      value={brief.location}
                      onChange={(e) => set({ location: e.target.value })}
                      placeholder="Stockholm"
                      className="glass-field"
                    />
                  </Field>
                  <Field label="Who are your customers?" className="sm:col-span-2">
                    <input
                      type="text"
                      value={brief.audience}
                      onChange={(e) => set({ audience: e.target.value })}
                      placeholder="Construction firms and private homeowners"
                      className="glass-field"
                    />
                  </Field>
                </div>
              </Question>

              <Question
                id="q-sections"
                title="What goes on it?"
                hint="Sections for the first version. Skip this if it is an API or you are not sure."
              >
                <Choices
                  name="section"
                  size="sm"
                  options={SECTIONS}
                  selected={brief.secs}
                  onPick={(id) => set({ secs: toggle(brief.secs, id) })}
                />
                <Field label="What should visitors do?" className="max-w-lg">
                  <input
                    type="text"
                    value={brief.cta}
                    onChange={(e) => set({ cta: e.target.value })}
                    placeholder="Request a quote, book a time..."
                    className="glass-field"
                  />
                </Field>
              </Question>

              <Question id="q-feel" title="How should it feel?">
                <Choices
                  radio
                  name="style"
                  size="sm"
                  label="Style"
                  options={STYLES}
                  selected={[brief.style]}
                  onPick={(id) => set({ style: id })}
                />
                <div className="grid gap-x-5 gap-y-[22px] sm:grid-cols-2">
                  <Choices
                    radio
                    name="theme"
                    size="sm"
                    label="Theme"
                    options={THEMES}
                    selected={[brief.theme]}
                    onPick={(id) => set({ theme: id })}
                  />
                  <Choices
                    radio
                    name="lang"
                    size="sm"
                    label="Copy language"
                    options={LANGS}
                    selected={[brief.lang]}
                    onPick={(id) => set({ lang: id })}
                  />
                </div>
                <Field label="Brand colour" className="max-w-lg">
                  <input
                    type="text"
                    value={brief.color}
                    onChange={(e) => set({ color: e.target.value })}
                    placeholder="Deep green #1f5f4a, or match your logo"
                    className="glass-field"
                  />
                </Field>
              </Question>

              <Question
                id="q-practical"
                title="The practical bits"
                hint="A domain is the address people type to find you, like yourcompany.se."
              >
                <Choices
                  radio
                  name="domain"
                  size="md"
                  label="Do you have a domain?"
                  options={DOMAIN}
                  selected={[brief.domain]}
                  onPick={(id) => set({ domain: id, domainValue: '' })}
                />
                <Fold open={brief.domain === 'have' || brief.domain === 'want'}>
                  <Field
                    className="max-w-lg"
                    label={brief.domain === 'want' ? 'Any names in mind?' : 'Which domain?'}
                  >
                    <input
                      type="text"
                      value={brief.domainValue}
                      onChange={(e) => set({ domainValue: e.target.value })}
                      placeholder={brief.domain === 'want' ? 'yourcompany.se, yourcompany.com' : 'yourcompany.se'}
                      className="glass-field"
                    />
                  </Field>
                </Fold>
                <Choices
                  radio
                  name="mail"
                  size="md"
                  label="Email on your own domain, like hello@yourcompany.se?"
                  options={MAIL}
                  selected={[brief.mail]}
                  onPick={(id) => set({ mail: id, mailValue: '' })}
                />
                <Fold open={brief.mail === 'have' || brief.mail === 'want'}>
                  <Field
                    className="max-w-lg"
                    label={brief.mail === 'want' ? 'Which addresses do you need?' : 'Which provider?'}
                  >
                    <input
                      type="text"
                      value={brief.mailValue}
                      onChange={(e) => set({ mailValue: e.target.value })}
                      placeholder={
                        brief.mail === 'want'
                          ? 'hello@, info@, one per person...'
                          : 'Google Workspace, Outlook, One.com...'
                      }
                      className="glass-field"
                    />
                  </Field>
                </Fold>
                <Choices
                  radio
                  name="when"
                  size="sm"
                  label="When do you need it?"
                  options={WHEN.map((w) => ({ id: w, label: w }))}
                  selected={[brief.when]}
                  onPick={(id) => set({ when: id })}
                />
              </Question>

              <Question id="q-else" title="Anything else?">
                <Field label="Sites you like">
                  <input
                    type="text"
                    value={brief.refs}
                    onChange={(e) => set({ refs: e.target.value })}
                    placeholder="apple.com, a competitor..."
                    className="glass-field"
                  />
                </Field>
                <Field label="The idea, in your own words">
                  <textarea
                    rows={5}
                    value={brief.idea}
                    onChange={(e) => set({ idea: e.target.value })}
                    placeholder="What it should do, who it is for, anything I should know..."
                    className="glass-field"
                  />
                </Field>
                <button
                  type="submit"
                  className={`glass-pill group mt-1 inline-flex min-h-14 items-center gap-5 self-start rounded-full px-7 text-left text-[15px] font-medium ${pillFocus}`}
                >
                  <span>Send brief · book free consultation</span>
                  <span
                    aria-hidden="true"
                    className="text-red-500 transition-transform dark:text-red-400 group-hover:translate-x-1 motion-reduce:transition-none"
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
                  className={`glass-pill flex min-h-12 items-center rounded-full px-6 ${pillFocus}`}
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

      </div>

      {/* Mobile only: on desktop all of this lives in the sticky panel. */}
      <aside className="mt-10 mb-4 flex flex-col gap-12 lg:hidden">
        <Services />
        <Details />
      </aside>
      <Footer />
    </div>
  );
}
