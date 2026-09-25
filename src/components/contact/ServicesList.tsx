import { SERVICES } from '../../data/brief';
import { Eyebrow } from '../ui/Eyebrow';

/** "What I build": service and a one-line description, as a ruled list. */
export function ServicesList() {
  return (
    <div className="flex flex-col gap-4">
      <Eyebrow>What I build</Eyebrow>
      <dl>
        {SERVICES.map(([k, v], i) => (
          <div
            key={k}
            className={`grid gap-1 border-t border-zinc-900/10 py-3.5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4 dark:border-white/10 ${
              i === SERVICES.length - 1 ? 'border-b' : ''
            }`}
          >
            <dt className="text-[14px] font-medium">{k}</dt>
            <dd className="text-sm leading-normal text-zinc-600 dark:text-zinc-400">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
