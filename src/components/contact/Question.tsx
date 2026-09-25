import type { ReactNode } from 'react';

/** One step of the brief: a glass card with a title, an optional hint and its fields. */
export function Question({
  id,
  title,
  hint,
  children,
}: {
  id: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="group"
      aria-labelledby={id}
      className="reveal glass flex min-w-0 flex-col gap-[22px] rounded-[28px] p-5 sm:p-9"
    >
      <h2
        id={id}
        className="font-headline text-[22px] font-light tracking-[-0.01em] sm:text-[26px]"
      >
        {title}
      </h2>
      {hint && (
        <p className="-mt-2.5 text-[15px] leading-normal text-zinc-600 dark:text-zinc-400">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}
