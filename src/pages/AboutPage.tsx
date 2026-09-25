import { About } from '../components/about/About';
import { ContactCta } from '../components/about/ContactCta';
import { Footer } from '../components/layout/Footer';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function AboutPage() {
  useDocumentTitle('About · Alexander Tjernström');

  return (
    <div className="px-4 sm:px-8 lg:px-12">
      <About />
      <ContactCta />
      <Footer />
    </div>
  );
}
