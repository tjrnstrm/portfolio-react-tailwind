import { useState, type Ref } from 'react';
import { EMAIL } from '../../data/site';
import { briefText, type BriefRows } from '../../lib/brief';
import { playSound } from '../../lib/sound';
import { EYEBROW, PAGE_HEADING, PILL_FOCUS } from '../../lib/type';

type BriefSentProps = {
  rows: BriefRows;
  /** The mailto: link with the brief filled in. */
  href: string;
  onEdit: () => void;
  headingRef: Ref<HTMLHeadingElement>;
};

const pillButton = `glass-pill min-h-12 rounded-full px-6 ${PILL_FOCUS}`;

/** Shown after Send: a summary of the brief and ways to actually get it to me. */
export function BriefSent({ rows, href, onEdit, headingRef }: BriefSentProps) {
  const [copied, setCopied] = useState(false);

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(briefText(rows));
      playSound('success');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="glass flex flex-col gap-7 rounded-[28px] p-6 sm:p-10">
      <p className="font-mono text-xs tracking-[0.03em] text-green-700 dark:text-green-500">
        One step left
      </p>
      <h2 ref={headingRef} tabIndex={-1} className={`${PAGE_HEADING} outline-none`}>
        Hit send.
      </h2>
      <p className="max-w-[52ch] leading-relaxed text-zinc-600 dark:text-zinc-400">
        Your mail app should have opened with the brief filled in. Send it from
        there and I will reply by email. Nothing opened? Copy the brief and send
        it to{' '}
        <a
          href={`mailto:${EMAIL}`}
          className="underline transition-colors hover:text-zinc-950 dark:hover:text-zinc-200"
        >
          {EMAIL}
        </a>
        .
      </p>
      <dl className="max-w-2xl">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="grid gap-1 border-t border-zinc-900/10 py-3.5 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-6 dark:border-white/10"
          >
            <dt className={`${EYEBROW} sm:text-[11px]`}>{k}</dt>
            <dd className="text-[15px] wrap-break-word whitespace-pre-wrap">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap items-center gap-3 text-[15px] font-medium">
        <a href={href} className={`${pillButton} flex items-center`}>
          Open mail app
        </a>
        <button type="button" onClick={copyBrief} className={pillButton}>
          {copied ? 'Copied' : 'Copy brief'}
        </button>
        <button type="button" onClick={onEdit} className={pillButton}>
          Edit brief
        </button>
        <span role="status" className="sr-only">
          {copied ? 'Brief copied to clipboard' : ''}
        </span>
      </div>
    </div>
  );
}
