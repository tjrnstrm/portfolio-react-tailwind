import type { ReactNode } from 'react';
import { EYEBROW } from '../../lib/type';

/** Small mono label above a block, like "What I build" or "Skills". */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={className ? `${EYEBROW} ${className}` : EYEBROW}>{children}</p>;
}
