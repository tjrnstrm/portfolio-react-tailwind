import { FiArrowLeft, FiMoon, FiSun, FiVolume2, FiVolumeX } from "react-icons/fi";
import { playSound, setSoundEnabled, useSoundEnabled } from "../../lib/sound";
import { TransitionLink } from "../ui/TransitionLink";

/** Icon-only navbar button: no box, the icon brightens on hover. */
const iconButton =
  "flex items-center justify-center rounded-md p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 dark:focus-visible:outline-zinc-500";

export function ThemeToggle({ onToggle }: { onToggle: () => void }) {
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
