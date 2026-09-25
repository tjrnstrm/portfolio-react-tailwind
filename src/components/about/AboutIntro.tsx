import { MdArrowOutward } from "react-icons/md";
import { CV_URL, EMAIL, GITHUB_URL, LINKEDIN_URL } from "../../data/site";

const linkClass = "hover:text-zinc-950 dark:hover:text-zinc-200 transition-colors";

/** The bio, then CV / LinkedIn / GitHub and the email address. */
export function AboutIntro() {
  return (
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
          <a className={linkClass} href={CV_URL} target="_blank" rel="noreferrer">
            <span className="flex items-center gap-1">
              CV <MdArrowOutward size={12} />
            </span>
          </a>
          <a className={linkClass} href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className={linkClass} href={GITHUB_URL} target="_blank" rel="noreferrer">
            Github
          </a>
        </div>
        <a className={`tracking-normal ${linkClass}`} href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
      </div>
    </div>
  );
}
