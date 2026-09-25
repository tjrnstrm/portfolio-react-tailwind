import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ScrollManager } from './components/ScrollManager';
import { startHoverSounds } from './lib/sound';
import { Home } from './pages/Home';
import { Contact } from './pages/Contact';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (localStorage.getItem('theme') as 'dark' | 'light') ?? 'dark',
  );
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setScrolled(false);
  }
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => startHoverSounds(), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keep the first screen exactly one viewport tall by measuring the real
  // navbar height (its unscrolled flow height) into a CSS variable. Re-measured
  // on every page change, because the contact page has a different navbar.
  useLayoutEffect(() => {
    const measure = () => {
      const el = navRef.current;
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
  }, [pathname]);

  const toggleTheme = () => {
    document.documentElement.classList.add('theme-transitioning');
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    setTimeout(
      () => document.documentElement.classList.remove('theme-transitioning'),
      500,
    );
  };

  return (
    <div className="font-display min-h-screen text-zinc-900 dark:text-zinc-100">
      <Navbar ref={navRef} onToggleTheme={toggleTheme} scrolled={scrolled} />
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
