import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ScrollManager } from './components/ScrollManager';
import { startHoverSounds } from './lib/sound';
import { Home } from './pages/Home';
import { Contact } from './pages/Contact';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  // index.html already resolved the theme (saved choice, else the system
  // preference) and set the class before first paint; start from that.
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
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
  }, [theme]);

  // Without a saved choice, follow the system when it changes (e.g. automatic
  // day/night switching).
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      let choice: string | null = null;
      try {
        choice = localStorage.getItem('theme-choice');
      } catch {
        // private mode: treat as no choice
      }
      if (!choice) setTheme(e.matches ? 'dark' : 'light');
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

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
    const next = theme === 'dark' ? 'light' : 'dark';
    // only an explicit toggle is remembered; otherwise the system decides
    try {
      localStorage.setItem('theme-choice', next);
    } catch {
      // private mode: the choice just lasts for this visit
    }
    setTheme(next);
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
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
