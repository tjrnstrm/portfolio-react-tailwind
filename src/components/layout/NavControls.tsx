import { FiArrowLeft, FiMoon, FiSun, FiVolume2, FiVolumeX } from "react-icons/fi";
import { playSound, setSoundEnabled, useSoundEnabled } from "../../lib/sound";
import { TransitionLink } from "../ui/TransitionLink";

/**
 * Icon-only navbar button: no box, the icon brightens on hover. The ::after
 * makes the touch target taller (about 44px) without changing the layout.
 */
const iconButton =
  "relative flex items-center after:absolute after:-inset-y-2.5 after:-inset-x-0.5 after:content-[''] justify-center rounded-md p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 dark:focus-visible:outline-zinc-500";

/**
 * `className` trims the right edge (-mr-1) so the icon lines up with the bar's
 * right padding on the home page; the contact bar passes "" so its icons sit
 * the same distance from the page edge as the back arrow does on the left.
 */
export function ThemeToggle({
  onToggle,
  className = "-mr-1",
}: {
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={() => {
        playSound("page", 0.35);
        onToggle();
      }}
      aria-label="Toggle color theme"
      className={`${className} ${iconButton}`}
    >
      <FiSun size={15} className="dark:hidden" />
      <FiMoon size={15} className="hidden dark:inline" />
    </button>
  );
}

export function SoundToggle() {
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

/** The back arrow on the About and contact pages. */
export function BackLink() {
  return (
    <TransitionLink
      to="/"
      aria-label="Back to home"
      className={iconButton}
      onClick={() => playSound("bloom")}
    >
      <FiArrowLeft size={18} />
    </TransitionLink>
  );
}
