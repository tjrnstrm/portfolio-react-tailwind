/** The options offered by the project brief on the contact page. */

export type Choice = { id: string; label: string };
export type Category = Choice & { types: string[] };

export const CATEGORIES: Category[] = [
  {
    id: 'website',
    label: 'Website',
    types: [
      'Landing page',
      'Company site',
      'E-commerce',
      'Booking site',
      'Blog / CMS',
      'Event page',
      'Membership site',
      'Documentation',
    ],
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
      'Agency / studio',
      'Personal CV',
    ],
  },
  {
    id: 'app',
    label: 'App',
    types: [
      'Web app / SaaS',
      'Mobile app',
      'Internal tool',
      'Dashboard',
      'Customer portal',
      'Booking system',
      'Admin panel',
      'Real-time / chat',
    ],
  },
  {
    id: 'api',
    label: 'API',
    types: [
      'REST API',
      'GraphQL API',
      'Integrations',
      'Payments (Stripe)',
      'Backend for an existing app',
      'Authentication',
      'Webhooks',
    ],
  },
  {
    id: 'redesign',
    label: 'Redesign',
    types: [
      'Fresh new look',
      'Rebuild from scratch',
      'Move to a new platform',
      'Speed & SEO fixes',
      'Fix or extend what exists',
    ],
  },
  {
    id: 'automation',
    label: 'Automation',
    types: [
      'Workflows',
      'Data import / export',
      'Scheduled jobs',
      'Emails & notifications',
    ],
  },
  { id: 'other', label: 'Something else', types: [] },
  { id: 'unsure', label: 'Not sure yet', types: [] },
];

export const SECTIONS: Choice[] = [
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

export const STYLES: Choice[] = [
  { id: 'clean', label: 'Clean & minimal' },
  { id: 'glass', label: 'Glass / iOS' },
  { id: 'bold', label: 'Bold & graphic' },
  { id: 'premium', label: 'Premium' },
  { id: 'warm', label: 'Warm & friendly' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'unsure', label: 'Not sure' },
];

export const THEMES: Choice[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'both', label: 'Both - Toggleable' },
];

export const LANGS: Choice[] = [
  { id: 'sv', label: 'Swedish' },
  { id: 'en', label: 'English' },
  { id: 'both', label: 'Both - Switchable' },
  { id: 'other', label: 'Other' },
];

export const DOMAIN: Choice[] = [
  { id: 'have', label: 'Yes, I have one' },
  { id: 'want', label: 'No, I want one' },
  { id: 'none', label: 'Not needed' },
];

export const MAIL: Choice[] = [
  { id: 'have', label: 'Yes, already set up' },
  { id: 'want', label: 'No, set one up for me' },
  { id: 'none', label: 'Not needed' },
];

export const WHEN = ['As soon as possible', 'Within 1–3 months', 'Flexible'];

export const STEPS = 6;

/** "What I build", shown beside the brief. */
export const SERVICES: [string, string][] = [
  ['Websites', 'Landing pages, e-commerce, booking'],
  ['Apps', 'SaaS, mobile, internal tools, dashboards'],
  ['APIs', 'REST, GraphQL, Stripe, backends'],
  ['The rest', 'Domains, DNS, business email, hosting'],
];
