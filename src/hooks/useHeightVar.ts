import { useEffect, useRef } from 'react';

/**
 * Keeps an element's height in a CSS variable on the element itself, for CSS
 * that needs it (the contact page's sticky panel pins by its bottom edge).
 */
export function useHeightVar<T extends HTMLElement>(name: string) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => el.style.setProperty(name, `${el.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [name]);
  return ref;
}
