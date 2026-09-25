import {
  CATEGORIES,
  DOMAIN,
  LANGS,
  MAIL,
  SECTIONS,
  STYLES,
  THEMES,
  type Choice,
} from '../data/brief';
import { EMAIL } from '../data/site';

/** Everything the visitor fills in on the contact page. */
export type Brief = {
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
  langOther: string;
  color: string;
  domain: string;
  domainValue: string;
  mail: string;
  mailValue: string;
  when: string;
  refs: string;
  idea: string;
};

export type BriefRows = [string, string][];

/** What each step of the form receives. */
export type StepProps = {
  brief: Brief;
  set: (patch: Partial<Brief>) => void;
};

export const INITIAL_BRIEF: Brief = {
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
  langOther: '',
  color: '',
  domain: '',
  domainValue: '',
  mail: '',
  mailValue: '',
  when: '',
  refs: '',
  idea: '',
};

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

const labelOf = (list: Choice[], id: string) =>
  list.find((o) => o.id === id)?.label;

/**
 * The mandatory fields, in page order. Each key is also the `name` of its input
 * (or of its group of radio chips), so a failed Send can focus the first one.
 */
export const REQUIRED = [
  'name',
  'email',
  'industry',
  'cta',
  'style',
  'theme',
  'lang',
  'langOther',
  'domain',
  'mail',
  'when',
] as const;

export type RequiredKey = (typeof REQUIRED)[number];
export type Missing = Record<RequiredKey, boolean>;

/** What each step with mandatory fields receives on top of the brief. */
export type FlaggedProps = StepProps & { flagged: Missing };

/** The mandatory fields that are empty (or, for email, not an address). */
export function missingFields(b: Brief): Missing {
  return {
    name: !b.name.trim(),
    email: !EMAIL_RE.test(b.email.trim()),
    industry: !b.industry.trim(),
    cta: !b.cta.trim(),
    style: !b.style,
    theme: !b.theme,
    lang: !b.lang,
    langOther: b.lang === 'other' && !b.langOther.trim(),
    domain: !b.domain,
    mail: !b.mail,
    when: !b.when,
  };
}

export const NOTHING_MISSING = Object.fromEntries(
  REQUIRED.map((k) => [k, false]),
) as Missing;

/** Only answered questions make it into the brief; the three that always do come first. */
export function summarise(b: Brief): BriefRows {
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
    b.style === 'unsure' ? 'style not decided' : labelOf(STYLES, b.style),
    b.theme === 'both'
      ? 'light and dark (toggleable)'
      : labelOf(THEMES, b.theme)?.toLowerCase(),
    b.lang === 'both'
      ? 'Swedish and English copy (switchable)'
      : b.lang === 'other'
        ? `${b.langOther.trim() || 'other language'} copy`
        : labelOf(LANGS, b.lang) && `${labelOf(LANGS, b.lang)} copy`,
  ]
    .filter(Boolean)
    .join(', ');
  const sections = SECTIONS.filter((s) => b.secs.includes(s.id)).map(
    (s) => s.label,
  );

  const rows: BriefRows = [
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

export const briefText = (rows: BriefRows) =>
  rows.map(([k, v]) => `${k}: ${v}`).join('\n');

export function mailtoHref(b: Brief, rows: BriefRows) {
  const subject = `Project brief${b.name.trim() ? ` from ${b.name.trim()}` : ''}`;
  const body = briefText(rows).replace(/\n/g, '\r\n');
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
