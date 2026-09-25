/**
 * `overlay` (the home page): laid over the bottom of the hero instead of
 * following the content, transparent, with no separator line.
 */
export function Footer({ overlay }: { overlay?: boolean }) {
  return (
    <footer
      className={`flex flex-col xs:flex-row justify-between gap-2 font-mono text-[10px] tracking-[0.15em] uppercase text-zinc-500 dark:text-zinc-500 ${
        overlay
          ? 'absolute inset-x-4 bottom-0 z-10 py-6 sm:inset-x-8 sm:py-8 lg:inset-x-12'
          : 'border-t border-zinc-300 dark:border-zinc-200/10 py-10'
      }`}
    >
      <p>© 2026 Alexander Tjernström</p>
      <p>Built with React + Tailwind</p>
    </footer>
  );
}
