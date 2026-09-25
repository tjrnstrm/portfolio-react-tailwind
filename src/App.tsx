import { useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { ScrollManager } from './components/layout/ScrollManager';
import { CodeRain } from './components/ui/CodeRain';
import { useNavHeight } from './hooks/useNavHeight';
import { useScrolled } from './hooks/useScrolled';
import { useTheme } from './hooks/useTheme';
import { startHoverSounds } from './lib/sound';
import { Home } from './pages/Home';
import { Contact } from './pages/Contact';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  const { pathname } = useLocation();
  const { toggleTheme } = useTheme();
  const scrolled = useScrolled(pathname);
  const navRef = useRef<HTMLElement | null>(null);
  useNavHeight(navRef, pathname);

  useEffect(() => startHoverSounds(), []);

  return (
    <div className="font-display min-h-screen text-zinc-900 dark:text-zinc-100">
      {/* One rain for the whole site, so it keeps falling across page changes.
          The contact page's is brighter: it sits behind blurred glass. */}
      <CodeRain
        mode={pathname === '/' ? 'hero' : 'page'}
        strength={pathname === '/contact' ? 2.4 : 1}
      />
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
