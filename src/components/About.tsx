import { MdArrowOutward } from "react-icons/md";

const stack = [
  "React",
  "TypeScript",
  "Node.js & Express",
  "Tailwind CSS",
  "WordPress & Shopify",
  "MySQL & MongoDB",
  "PostgreSQL & Drizzle",
  "Docker",
  "Next.js",
  "Turborepo",
  "Google Cloud",
  "Stripe",
  "Git",
  "Figma",
  "UI/UX",
  "Adobe Creative Suite",
  "SEO",
];

const labelClass =
  "font-mono text-[10px] text-zinc-600 dark:text-zinc-400 tracking-[0.2em] uppercase";

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-14 flex flex-col w-full">
      <div className="border-b border-zinc-300 dark:border-zinc-200/10 pb-5 mb-8 sm:mb-12">
        <p className={labelClass}>Who am I?</p>
        <h2 className="font-heading text-[clamp(2rem,5.5vw,3.5rem)] font-light tracking-[0.15em] uppercase">
          About<span className="text-red-500">.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-6">
          <p>
            Hi, I'm{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              Alexander Tjernström
            </span>
            , a fullstack developer based in Stockholm. I think good software
            should feel as good as it works.
          </p>

          <p>
            My background in design tools like Figma and the Adobe suite gives
            me a different angle on frontend work. I can work alongside a
            designer or own the visual side independently. The details matter to
            me: typography, spacing, and small interactions. I tend to care too
            much about whether the hover state feels right.
          </p>
          <p>
            I've built and shipped production sites for real clients, and I'm
            currently interning as a fullstack developer at Barrion, where we
            build cybersecurity tools with an AI-assisted workflow. If something
            on this page caught your attention, feel free to reach out!
          </p>
          <div className="flex flex-col gap-2.5 pt-2 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 tracking-widest">
            <div className="flex gap-5">
              <a
                className="hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors"
                href="/CV.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <span className="flex items-center gap-1">
                  CV <MdArrowOutward size={12} />
                </span>
              </a>
              <a
                className="hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors"
                href="https://www.linkedin.com/in/alexandertjernstrom/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors"
                href="https://github.com/tZandr"
                target="_blank"
                rel="noreferrer"
              >
                Github
              </a>
            </div>
            <a
              className="tracking-normal hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors"
              href="mailto:tjernstrom@proton.me"
            >
              tjernstrom@proton.me
            </a>
          </div>
        </div>
        <div className="space-y-16 mt-14 sm:space-y-8 sm:mt-0 sm:ml-20">
          <div className="space-y-4">
            <p className={labelClass}>Skills</p>
            <div className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <span
                  key={item}
                  className="font-mono text-[11px] border border-zinc-300 dark:border-white/10 rounded-full px-3.5 py-1.5 text-zinc-700 dark:text-zinc-400"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <p className={labelClass}>Experience</p>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Barrion · Fullstack Developer Intern
                </p>
                <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  2026 – Present
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  Fullstack work on an AI-driven security scanning platform: a
                  TypeScript monorepo (Turborepo) with a Next.js frontend and
                  Express and Hono services on PostgreSQL, Drizzle ORM and
                  Google Cloud. AI-assisted development with Claude.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <p className={labelClass}>Education</p>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  IT-Högskolan · JavaScript Developer
                </p>
                <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  2025 – 2027 · Ongoing
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Högskolan Väst · Webmaster
                </p>
                <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  2023 – 2025
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  Frontend, backend, databases, UX and web servers. Thesis on
                  AI-related security and career impact.{" "}
                  <a
                    href="https://www.diva-portal.org/smash/record.jsf?dswid=3297&pid=diva2%3A1994529&c=1&searchType=SIMPLE&language=en&query=ai-relaterad+os%C3%A4kerhet+och+yrkesval&af=%5B%5D&aq=%5B%5B%5D%5D&aq2=%5B%5B%5D%5D&aqe=%5B%5D&noOfRows=50&sortOrder=author_sort_asc&sortOrder2=title_sort_asc&onlyFullText=false&sf=all"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-zinc-950 dark:hover:text-zinc-300 transition-colors"
                  >
                    <span className="inline-flex items-center gap-1">
                      Read abstract <MdArrowOutward size={11} />
                    </span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
