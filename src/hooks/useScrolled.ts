import { useEffect, useState } from 'react';

/**
 * Whether the page is scrolled past `threshold`. Resets in the same render as a
 * page change, so the new page's navbar never mounts in its scrolled shape.
 */
export function useScrolled(pathname: string, threshold = 50) {
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setScrolled(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
