import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

const SIZE = {
  sm: 'gap-2 px-4 py-2.5 text-xs',
  lg: 'gap-4 px-7 py-4 text-sm',
};

type CtaPillProps = {
  to: string;
  size?: keyof typeof SIZE;
  children: ReactNode;
};

/**
 * Call-to-action link: a frosted-glass pill (see .glass-pill in index.css)
 * with a red arrow. No border and no solid fill, like the rest of the
 * site's controls.
 */
export function CtaPill({ to, size = 'sm', children }: CtaPillProps) {
  return (
    <Link
      to={to}
      className={`glass-pill group inline-flex items-center rounded-full font-normal tracking-[0.3em] whitespace-nowrap text-zinc-900 uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/25 dark:text-zinc-100 dark:focus-visible:outline-white/30 ${SIZE[size]}`}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="tracking-normal text-red-500 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
      >
        →
      </span>
    </Link>
  );
}
