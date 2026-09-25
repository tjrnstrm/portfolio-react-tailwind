import { useEffect } from 'react';

/** Sets the browser tab title while the page is shown, and restores it after. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
