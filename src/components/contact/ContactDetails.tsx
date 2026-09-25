import { clientProjects } from '../../data/projects';
import { EMAIL, GITHUB_HANDLE, GITHUB_URL } from '../../data/site';
import { Eyebrow } from '../ui/Eyebrow';
import { ExternalRow } from '../ui/ExternalRow';

/** Client work, GitHub and plain email. Sibling blocks, so the parent sets the gap. */
export function ContactDetails() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <Eyebrow>Recent client work</Eyebrow>
        <ul>
          {clientProjects.map((p, i) => (
            <li
              key={p.name}
              className={`border-t border-zinc-900/10 dark:border-white/10 ${
                i === clientProjects.length - 1 ? 'border-b' : ''
              }`}
            >
              <ExternalRow href={p.url} name={p.name} meta={p.tags?.join(' · ')} />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <Eyebrow>More work</Eyebrow>
        <ExternalRow
          href={GITHUB_URL}
          name="GitHub"
          meta={GITHUB_HANDLE}
          className="border-y border-zinc-900/10 dark:border-white/10"
        />
      </div>

      <div className="flex flex-col gap-2 font-mono text-[11px] tracking-[0.03em] text-zinc-600 dark:text-zinc-400">
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
