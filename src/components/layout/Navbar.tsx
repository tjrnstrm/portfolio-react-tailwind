import type { Ref } from "react";
import { useLocation } from "react-router-dom";
import { playSound } from "../../lib/sound";
import { CtaPill } from "../ui/CtaPill";
import { TransitionLink } from "../ui/TransitionLink";
import { BackLink, SoundToggle, ThemeToggle } from "./NavControls";

type NavbarProps = {
  onToggleTheme: () => void;
  scrolled: boolean;
  ref?: Ref<HTMLElement>;
};

/** Picks the navbar for the current page. */
export function Navbar(props: NavbarProps) {
  const { pathname } = useLocation();
  return pathname === "/contact" ? (
    <ContactNav key="contact" {...props} />
  ) : (
    <SiteNav key="site" pathname={pathname} {...props} />
  );
}

/**
 * Contact page: the same full-width bar as the home page at the top, with a
 * back arrow instead of the menu. Scrolling turns it into a glass pill (same
 * glass as the cards) as wide as the pitch panel below it, i.e. the left
 * column of the page grid. Its footprint in the page flow is the same in both
 * shapes (the pill's mt-4 makes up the height difference), so the content
 * below doesn't shift. Keyed in Navbar, so switching pages remounts it instead
 * of animating between the home and contact shapes.
 */
function ContactNav({ onToggleTheme, scrolled, ref }: NavbarProps) {
  return (
    <nav
      ref={ref}
      style={{
        top: scrolled ? "1.25rem" : "0",
        viewTransitionName: "site-nav",
      }}
      className={`sticky z-50 flex items-center justify-between text-xs text-zinc-900 transition-all duration-1000 ease-in-out dark:text-zinc-100 ${
        scrolled
          ? "glass mt-4 ml-4 w-[calc(100%-2rem)] rounded-[100px] px-4 py-3 sm:ml-8 sm:w-[calc(100%-4rem)] lg:ml-12 lg:w-[calc((100%-7.5rem)*5/12)]"
          : "mt-0 ml-0 w-full rounded-none border border-transparent px-6 py-5 sm:px-8 lg:px-12"
      }`}
    >
      <BackLink />

      <div className="flex items-center gap-1">
        <SoundToggle />
        <ThemeToggle onToggle={onToggleTheme} className="" />
      </div>
    </nav>
  );
}

/** Home and About: About link and "Start a project" on the left, sound and theme toggles on the right. */
function SiteNav({
  onToggleTheme,
  scrolled,
  ref,
  pathname,
}: NavbarProps & { pathname: string }) {
  const onAboutPage = pathname === "/about";
  // The home page is a single screen and never scrolls, so its bar never turns
  // into a pill; the About page (which scrolls) still does.
  const pill = scrolled && pathname !== "/";

  return (
    <nav
      ref={ref}
      style={{
        borderRadius: pill ? "100px" : "0",
        maxWidth: pill ? "min(1024px, calc(100% - 1rem))" : "100%",
        top: pill ? "1.25rem" : "0",
        viewTransitionName: "site-nav",
      }}
      className={`sticky z-50 mx-auto flex justify-between items-center border backdrop-blur-md text-zinc-900 dark:text-zinc-100 text-xs transition-all duration-1000 ease-in-out ${
        pill
          ? "py-3.5 px-6 sm:px-8 shadow-xl border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/10 shadow-black/10 dark:shadow-black/50"
          : "py-5 px-6 sm:px-8 lg:px-12 border-transparent bg-transparent"
      }`}
    >
      {/* No wordmark. About and "Start a project" sit on the left at every width
          (the About page has its back arrow first, and no About link); the
          sound and theme toggles are on the right. */}
      <div className="flex items-center gap-1">
        {onAboutPage ? (
          <BackLink />
        ) : (
          <TransitionLink
            to="/about"
            className="nav-link -ml-3 font-heading text-[13px] font-normal"
            onClick={() => playSound("scan")}
          >
            About
          </TransitionLink>
        )}
        <div className="mx-1 sm:ml-3">
          <CtaPill to="/contact" quiet>
            Start a project
          </CtaPill>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <SoundToggle />
        <ThemeToggle onToggle={onToggleTheme} />
      </div>
    </nav>
  );
}
