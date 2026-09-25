import { About } from '../components/about/About';
import { ContactCta } from '../components/about/ContactCta';
import { Footer } from '../components/layout/Footer';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function AboutPage() {
  useDocumentTitle('About · Alexander Tjernström');

  return (
    // Pulled up under the navbar, like the contact page.
    <div
      style={{
        marginTop: 'calc(var(--nav-h, 72px) * -1)',
        paddingTop: 'var(--nav-h, 72px)',
      }}
      className="relative isolate overflow-clip px-4 sm:px-8 lg:px-12"
    >
      <About />
      <ContactCta />
      <Footer />
    </div>
  );
}
