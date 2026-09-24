import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * The router doesn't move the scroll position on navigation. Jump to the
 * #anchor when there is one, otherwise to the top of a freshly opened page.
 * Back/forward (POP) is left to the browser so it can restore its position.
 */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else if (navType !== 'POP') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash, key, navType]);

  return null;
}
