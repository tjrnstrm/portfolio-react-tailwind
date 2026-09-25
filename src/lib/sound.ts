import { useSyncExternalStore } from 'react';
import { play, setEnabled, setVolume, type SoundName } from 'cuelume';

/**
 * Feedback sounds (Cuelume, synthesized live, no audio files) with a mute
 * switch. Cuelume doesn't remember the preference, so it is kept here in
 * localStorage. Sounds are on by default; the mute button is in the contact
 * page's navbar.
 */
const KEY = 'sound';

const read = () => {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
};

let enabled = read();
setEnabled(enabled);
setVolume(0.6);

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export function setSoundEnabled(next: boolean) {
  enabled = next;
  setEnabled(next);
  try {
    localStorage.setItem(KEY, next ? 'on' : 'off');
  } catch {
    // private mode: the choice just lasts for this visit
  }
  listeners.forEach((l) => l());
}

export function useSoundEnabled() {
  return useSyncExternalStore(subscribe, () => enabled, () => true);
}

export function playSound(name: SoundName, volume?: number) {
  void play(name, volume === undefined ? undefined : { volume });
}

// What counts as a "button" for the hover tick: real buttons, the glass pills
// (which include the CTA links), the selection chips and the navbar links.
const HOVERABLE = 'button:not(:disabled), .glass-pill, .chip, nav a';
const HOVER_VOLUME = 0.1;

/**
 * A quiet `tick` when the mouse enters a button. Cuelume's own hover binding
 * (data-cuelume-hover) can't set a per-element volume, so this is a single
 * delegated listener. Mouse only (not touch or pen). There is deliberately no
 * cooldown: sweeping across a row of chips ticks once per chip. Returns the
 * cleanup function.
 */
export function startHoverSounds() {
  const onOver = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !(e.target instanceof Element)) return;
    const el = e.target.closest(HOVERABLE);
    // ignore moves between children of the same button
    if (!el || (e.relatedTarget instanceof Node && el.contains(e.relatedTarget))) return;
    void play('tick', { volume: HOVER_VOLUME });
  };
  document.addEventListener('pointerover', onOver);
  return () => document.removeEventListener('pointerover', onOver);
}
