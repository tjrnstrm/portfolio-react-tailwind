import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { About } from './components/About';
import { Footer } from './components/Footer'

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (localStorage.getItem('theme') as 'dark' | 'light') ?? 'dark',
  );
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keep the first screen exactly one viewport tall by measuring the real
  // navbar height (its unscrolled flow height) into a CSS variable.
  useLayoutEffect(() => {
    const measure = () => {
      const el = navRef.current;
      if (el) {
        document.documentElement.style.setProperty('--nav-h', `${el.offsetHeight}px`);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }
    return () => window.removeEventListener('resize', measure);
  }, []);

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
      <div
        className="px-4 sm:px-8 lg:px-12"
        style={{ height: 'calc(100dvh - var(--nav-h, 74px))' }}
      >
        <Hero />
      </div>
      <div className="px-4 sm:px-8 lg:px-12">
        <Projects />
        <About />
        <Footer />
      </div>
    </div>
  );
}
