import type { ReactNode } from 'react';

/**
 * Follow-up questions open and close with a height and fade animation instead
 * of popping in (styles: .fold in index.css). Closed content stays mounted but
 * inert, so it is out of the tab order and hidden from screen readers.
 */
export function Fold({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div className={`fold${open ? ' open' : ''}`} inert={!open}>
      <div className="fold-in">{children}</div>
    </div>
  );
}
