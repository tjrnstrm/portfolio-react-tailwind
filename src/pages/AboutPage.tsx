import { useEffect } from 'react';
import { About } from '../components/About';
import { ContactCta } from '../components/ContactCta';
import { Footer } from '../components/Footer';

export function AboutPage() {
  useEffect(() => {
    const previous = document.title;
    document.title = 'About · Alexander Tjernström';
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="px-4 sm:px-8 lg:px-12">
      <About />
      <ContactCta />
      <Footer />
    </div>
  );
}
