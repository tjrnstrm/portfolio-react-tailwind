import { MdArrowOutward } from 'react-icons/md';

/** A full-width link row: a name with an outward arrow, and a mono note on the right. */
export function ExternalRow({
  href,
  name,
  meta,
  className = '',
}: {
  href: string;
  name: string;
  meta?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group flex items-baseline justify-between gap-4 py-4 ${className}`}
    >
      <span className="flex items-center gap-1.5 text-base font-medium transition-opacity group-hover:opacity-70">
        {name}
        <MdArrowOutward size={13} className="text-zinc-500" />
      </span>
      <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
        {meta}
      </span>
    </a>
  );
}
