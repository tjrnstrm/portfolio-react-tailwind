import { About } from '../components/about/About';
import { ContactCta } from '../components/about/ContactCta';
import { Footer } from '../components/layout/Footer';
import { CodeRain } from '../components/ui/CodeRain';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function AboutPage() {
  useDocumentTitle('About · Alexander Tjernström');

  return (
    // Pulled up under the navbar so the rain runs to the top edge, like the
    // contact page. There is no glass here, so the rain is quieter (strength 1).
    <div
      style={{
        marginTop: 'calc(var(--nav-h, 72px) * -1)',
        paddingTop: 'var(--nav-h, 72px)',
      }}
      className="relative isolate overflow-clip px-4 sm:px-8 lg:px-12"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <CodeRain variant="page" strength={1} />
      </div>
      <About />
      <ContactCta />
      <Footer />
    </div>
  );
}
