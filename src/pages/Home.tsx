import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <div
      className="relative px-4 sm:px-8 lg:px-12"
      style={{ height: 'calc(100dvh - var(--nav-h, 74px))' }}
    >
      <Hero />
      {/* Home only: the footer lies over the bottom of the hero, transparent and
          without its separator line, so the page is exactly one screen. */}
      <Footer overlay />
    </div>
  );
}
