import { Hero } from '../components/Hero';
import { Projects } from '../components/Projects';
import { About } from '../components/About';
import { ContactCta } from '../components/ContactCta';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <>
      <div
        className="px-4 sm:px-8 lg:px-12"
        style={{ height: 'calc(100dvh - var(--nav-h, 74px))' }}
      >
        <Hero />
      </div>
      <div className="px-4 sm:px-8 lg:px-12">
        <Projects />
        <About />
        <ContactCta />
        <Footer />
      </div>
    </>
  );
}
