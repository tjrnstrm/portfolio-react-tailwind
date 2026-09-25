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
  /** The compact navbar version: sentence case, small, with the red arrow. */
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
    // The navbar version: no background, just the text and the same always-visible
    // red arrow as the "Tell me what to build" link (it nudges right on hover).
    // It keeps the regular small pill's height (py-2.5 with a 16px line) so the
    // navbar doesn't change height.
    return (
      <TransitionLink
        to={to}
        className={`group inline-flex items-center gap-2 rounded-full px-1 py-2.5 font-heading text-[13px] leading-4 font-medium whitespace-nowrap text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300 ${focusRing}`}
      >
        <span>{children}</span>
        <RedArrow className="tracking-normal text-red-500" />
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
