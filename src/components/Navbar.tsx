import type { Ref } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSun, FiMoon } from "react-icons/fi";
import { CtaPill } from "./CtaPill";

type NavbarProps = {
  onToggleTheme: () => void;
  scrolled: boolean;
  ref?: Ref<HTMLElement>;
};

const links = [
  { label: "Work", to: "/#work" },
  { label: "About", to: "/#about" },
];

export function Navbar({ onToggleTheme, scrolled, ref }: NavbarProps) {
  const onContactPage = useLocation().pathname === "/contact";

  return (
    <nav
      ref={ref}
      style={{
        borderRadius: scrolled ? "100px" : "0",
        maxWidth: scrolled ? "min(1024px, calc(100% - 1rem))" : "100%",
        top: scrolled ? "1.25rem" : "0",
      }}
      className={`sticky z-50 mx-auto flex justify-between items-center border backdrop-blur-md text-zinc-900 dark:text-zinc-100 text-xs transition-all duration-1000 ease-in-out tracking-widest ${
        scrolled
          ? "py-3.5 px-6 sm:px-8 shadow-xl border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/10 shadow-black/10 dark:shadow-black/50"
          : "py-5 px-6 sm:px-8 lg:px-12 border-transparent bg-transparent"
      }`}
    >
      <Link
        to="/"
        aria-label="Tjernström — back to top"
        className="font-heading text-sm font-extralight uppercase tracking-[0.3em] leading-none whitespace-nowrap transition-opacity hover:opacity-70"
      >
        Tjernstrom
      </Link>

      <div className="flex items-center gap-1 uppercase">
        <div className="hidden sm:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="nav-link font-light tracking-[0.3em]">
              {l.label}
            </Link>
          ))}
        </div>
        {!onContactPage && (
          <div className="mx-1 sm:ml-3">
            <CtaPill to="/contact">
              <span className="sm:hidden">Contact</span>
              <span className="hidden sm:inline">Start a project</span>
            </CtaPill>
          </div>
        )}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle color theme"
          className="-mr-1 flex items-center justify-center rounded-md p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 dark:focus-visible:outline-zinc-500"
        >
          <FiSun size={15} className="dark:hidden" />
          <FiMoon size={15} className="hidden dark:inline" />
        </button>
      </div>
    </nav>
  );
}
