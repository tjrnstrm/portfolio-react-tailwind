import { useLayoutEffect, type RefObject } from 'react';

/**
 * Measures the navbar's footprint in the page flow into `--nav-h`, which keeps
 * the home page exactly one screen tall and offsets the contact page. Measured
 * again on every page change, because the contact page has a different navbar.
 */
export function useNavHeight(ref: RefObject<HTMLElement | null>, pathname: string) {
  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (el) {
        // margin included: the contact pill's margin makes up the height it
        // gives up, so the flow footprint is the same in both shapes
        const h = el.offsetHeight + parseFloat(getComputedStyle(el).marginTop);
        document.documentElement.style.setProperty('--nav-h', `${h}px`);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }
    return () => window.removeEventListener('resize', measure);
  }, [ref, pathname]);
}
