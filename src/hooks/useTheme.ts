import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

/**
 * The colour theme. index.html resolves it before first paint (the saved choice,
 * else the system preference) and sets the class; this starts from that class,
 * follows the system while there is no saved choice, and only saves a choice
 * when the visitor uses the toggle.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  );

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

  return { theme, toggleTheme };
}
