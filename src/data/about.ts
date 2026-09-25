/** Content of the About page. */

export const STACK = [
  'React',
  'TypeScript',
  'Node.js & Express',
  'Tailwind CSS',
  'WordPress & Shopify',
  'MySQL & MongoDB',
  'PostgreSQL & Drizzle',
  'Docker',
  'Next.js',
  'Turborepo',
  'Google Cloud',
  'Stripe',
  'Git',
  'Figma',
  'UI/UX',
  'Adobe Creative Suite',
  'SEO',
];

export type TimelineItem = {
  title: string;
  period: string;
  description?: string;
  link?: { href: string; label: string };
};

export const EXPERIENCE: TimelineItem[] = [
  {
    title: 'Barrion · Fullstack Developer Intern',
    period: '2026 – Present',
    description:
      'Fullstack work on an AI-driven security scanning platform: a TypeScript monorepo (Turborepo) with a Next.js frontend and Express and Hono services on PostgreSQL, Drizzle ORM and Google Cloud. AI-assisted development with Claude.',
  },
];

export const EDUCATION: TimelineItem[] = [
  {
    title: 'IT-Högskolan · JavaScript Developer',
    period: '2025 – 2027 · Ongoing',
  },
  {
    title: 'Högskolan Väst · Webmaster',
    period: '2023 – 2025',
    description:
      'Frontend, backend, databases, UX and web servers. Thesis on AI-related security and career impact.',
    link: {
      label: 'Read abstract',
      href: 'https://www.diva-portal.org/smash/record.jsf?dswid=3297&pid=diva2%3A1994529&c=1&searchType=SIMPLE&language=en&query=ai-relaterad+os%C3%A4kerhet+och+yrkesval&af=%5B%5D&aq=%5B%5B%5D%5D&aq2=%5B%5B%5D%5D&aqe=%5B%5D&noOfRows=50&sortOrder=author_sort_asc&sortOrder2=title_sort_asc&onlyFullText=false&sf=all',
    },
  },
];
