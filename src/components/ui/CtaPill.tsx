import type { ReactNode } from 'react';
import { RedArrow } from './RedArrow';
import { TransitionLink } from './TransitionLink';

const SIZE = {
  sm: 'gap-2 px-4 py-2.5 text-[13px]',
  lg: 'gap-4 px-7 py-4 text-[15px]',
};

type CtaPillProps = {
  to: string;
  size?: keyof typeof SIZE;
  /** Sentence case in a normal weight; the arrow only shows on hover or focus. */
  quiet?: boolean;
  children: ReactNode;
};

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/25 dark:focus-visible:outline-white/30';

/**
 * Call-to-action link: a frosted-glass pill (see .glass-pill in index.css)
 * with a red arrow. No border and no solid fill, like the rest of the
 * site's controls.
 */
export function CtaPill({ to, size = 'sm', quiet, children }: CtaPillProps) {
  if (quiet) {
    // The navbar version: the arrow only shows on hover or focus, and it matches
    // the regular small pill's height (py-2.5 with a 16px line) so the navbar
    // doesn't change height.
    return (
      <TransitionLink
        to={to}
        className={`glass-pill group inline-flex items-center rounded-full px-4 py-2.5 font-heading text-[13px] leading-4 font-medium whitespace-nowrap text-zinc-900 dark:text-zinc-100 ${focusRing}`}
      >
        <span>{children}</span>
        <span
          aria-hidden="true"
          className="ml-0 w-0 -translate-x-1 overflow-hidden text-red-500 opacity-0 transition-[width,margin,opacity,transform] duration-200 group-hover:ml-2 group-hover:w-3.5 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:w-3.5 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
        >
          →
        </span>
      </TransitionLink>
    );
  }

  return (
    <TransitionLink
      to={to}
      className={`glass-pill group inline-flex items-center rounded-full font-heading font-medium whitespace-nowrap text-zinc-900 ${focusRing} dark:text-zinc-100 ${SIZE[size]}`}
    >
      <span>{children}</span>
      <RedArrow className="tracking-normal text-red-500" />
    </TransitionLink>
  );
}
