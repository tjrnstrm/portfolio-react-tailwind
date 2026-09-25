import type { Ref } from "react";
import { useLocation } from "react-router-dom";
import { FiArrowLeft, FiMoon, FiSun, FiVolume2, FiVolumeX } from "react-icons/fi";
import { CtaPill } from "./CtaPill";
import { TransitionLink } from "./TransitionLink";
import { playSound, setSoundEnabled, useSoundEnabled } from "../lib/sound";

type NavbarProps = {
  onToggleTheme: () => void;
  scrolled: boolean;
  ref?: Ref<HTMLElement>;
};

const iconButton =
  "flex items-center justify-center rounded-md p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 dark:focus-visible:outline-zinc-500";

function ThemeToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      onClick={() => {
        playSound("page", 0.35);
        onToggle();
      }}
      aria-label="Toggle color theme"
      className={`-mr-1 ${iconButton}`}
    >
      <FiSun size={15} className="dark:hidden" />
      <FiMoon size={15} className="hidden dark:inline" />
    </button>
  );
}

function SoundToggle() {
  const on = useSoundEnabled();
  return (
    <button
      onClick={() => {
        setSoundEnabled(!on);
        // a short confirmation when turning sounds back on
        if (!on) playSound("toggle");
      }}
      aria-label={on ? "Mute sounds" : "Turn sounds on"}
      aria-pressed={on}
      className={iconButton}
    >
      {on ? <FiVolume2 size={15} /> : <FiVolumeX size={15} />}
    </button>
  );
}

export function Navbar({ onToggleTheme, scrolled, ref }: NavbarProps) {
  const { pathname } = useLocation();
  const onContactPage = pathname === "/contact";
  const onAboutPage = pathname === "/about";
  // The home page is a single screen and never scrolls, so its bar never turns
  // into a pill; the About page (which scrolls) still does.
  const pill = scrolled && pathname !== "/";

  // Contact page: the same full-width bar as the home page at the top, with a
  // back arrow instead of the menu. Scrolling turns it into a glass pill (same
  // glass as the cards) as wide as the pitch panel below it, i.e. the left
  // column of the page grid. Its footprint in the page flow is the same in both
  // shapes (the pill's mt-4 makes up the height difference), so the content
  // below doesn't shift. Keyed, so switching pages remounts it instead of
  // animating between the home and contact shapes.
  if (onContactPage) {
    return (
      <nav
        key="contact"
        ref={ref}
        style={{
          top: scrolled ? "1.25rem" : "0",
          viewTransitionName: "site-nav",
        }}
        className={`sticky z-50 flex items-center justify-between text-xs text-zinc-900 transition-all duration-1000 ease-in-out dark:text-zinc-100 ${
          scrolled
            ? "glass mt-4 ml-4 w-[calc(100%-2rem)] rounded-[100px] py-3 pr-5 pl-4 sm:ml-8 sm:w-[calc(100%-4rem)] lg:ml-12 lg:w-[calc((100%-7.5rem)*5/12)]"
            : "mt-0 ml-0 w-full rounded-none border border-transparent px-6 py-5 sm:px-8 lg:px-12"
        }`}
      >
        <TransitionLink
          to="/"
          aria-label="Back to home"
          className={iconButton}
          onClick={() => playSound("bloom")}
        >
          <FiArrowLeft size={18} />
        </TransitionLink>

        <div className="flex items-center gap-1">
          <SoundToggle />
          <ThemeToggle onToggle={onToggleTheme} />
        </div>
      </nav>
    );
  }

  return (
    <nav
      key="home"
      ref={ref}
      style={{
        borderRadius: pill ? "100px" : "0",
        maxWidth: pill ? "min(1024px, calc(100% - 1rem))" : "100%",
        top: pill ? "1.25rem" : "0",
        viewTransitionName: "site-nav",
      }}
      className={`sticky z-50 mx-auto flex justify-between items-center border backdrop-blur-md text-zinc-900 dark:text-zinc-100 text-xs transition-all duration-1000 ease-in-out tracking-widest ${
        pill
          ? "py-3.5 px-6 sm:px-8 shadow-xl border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/10 shadow-black/10 dark:shadow-black/50"
          : "py-5 px-6 sm:px-8 lg:px-12 border-transparent bg-transparent"
      }`}
    >
      {/* No wordmark. The About page gets a back arrow, like the contact page. */}
      {onAboutPage && (
        <TransitionLink
          to="/"
          aria-label="Back to home"
          className={iconButton}
          onClick={() => playSound("bloom")}
        >
          <FiArrowLeft size={18} />
        </TransitionLink>
      )}

      <div className="ml-auto flex items-center gap-1 uppercase">
        {!onAboutPage && (
          <TransitionLink
            to="/about"
            className="nav-link font-light tracking-[0.3em]"
            onClick={() => playSound("arrival")}
          >
            About
          </TransitionLink>
        )}
        <div className="mx-1 sm:ml-3">
          <CtaPill to="/contact" quiet>
            <span className="sm:hidden">Contact</span>
            <span className="hidden sm:inline">Start a project</span>
          </CtaPill>
        </div>
        <ThemeToggle onToggle={onToggleTheme} />
      </div>
    </nav>
  );
}
