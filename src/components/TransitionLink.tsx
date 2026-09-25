import type { MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { Link, useLocation, useNavigate, type LinkProps } from 'react-router-dom';
import { playSound } from '../lib/sound';

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

/**
 * A Link that animates page changes with the View Transitions API: the old page
 * fades out, then the contact page's cards fade up one after another, or the
 * home page rises into place on the way back (see the ::view-transition and
 * .reveal rules in index.css). Links that stay on the same page (hash-only),
 * modified clicks, reduced motion and browsers without the API all fall
 * through to a plain Link.
 */
export function TransitionLink({ to, onClick, ...rest }: LinkProps & { to: string }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== '_self') return;

    const doc = document as ViewTransitionDocument;
    const url = new URL(to, window.location.origin);
    if (
      url.pathname === pathname ||
      !doc.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    e.preventDefault();
    const root = document.documentElement;
    const direction = url.pathname === '/contact' ? 'vt-forward' : 'vt-back';
    root.classList.add(direction);

    const transition = doc.startViewTransition(() => {
      // Commit the new page before the browser takes the "after" snapshot,
      // scroll included, otherwise it would capture the old scroll position.
      flushSync(() => navigate(to));
      if (url.hash) {
        document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    });
    transition.finished.finally(() => root.classList.remove(direction));

    if (direction === 'vt-forward') {
      playSound('arrival');
      // The contact cards stagger in on their own animations. Hold them until
      // the transition is actually on screen, and keep their start delay (a CSS
      // variable on <html>) until they have finished: dropping it mid-run would
      // shorten every remaining delay and make the stagger jump ahead.
      root.classList.add('reveal-delay', 'reveal-wait');
      transition.ready.catch(() => {}).finally(() => root.classList.remove('reveal-wait'));
      window.setTimeout(() => root.classList.remove('reveal-delay'), 2500);
    }
  };

  return <Link to={to} onClick={handleClick} {...rest} />;
}
