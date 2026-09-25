import { LANGS, STYLES, THEMES } from '../../../data/brief';
import type { StepProps } from '../../../lib/brief';
import { Choices } from '../Choices';
import { TextField } from '../Field';
import { Question } from '../Question';

/** Step 4: style, theme, copy language and brand colour. */
export function FeelStep({ brief, set }: StepProps) {
  return (
    <Question id="q-feel" title="How should it feel?">
      <Choices
        radio
        name="style"
        size="sm"
        label="Style"
        options={STYLES}
        selected={[brief.style]}
        onPick={(style) => set({ style })}
      />
      <div className="grid gap-x-5 gap-y-[22px] sm:grid-cols-2">
        <Choices
          radio
          name="theme"
          size="sm"
          label="Theme"
          options={THEMES}
          selected={[brief.theme]}
          onPick={(theme) => set({ theme })}
        />
        <Choices
          radio
          name="lang"
          size="sm"
          label="Copy language"
          options={LANGS}
          selected={[brief.lang]}
          onPick={(lang) => set({ lang })}
        />
      </div>
      <TextField
        label="Brand colour"
        className="max-w-lg"
        value={brief.color}
        onChange={(color) => set({ color })}
        placeholder="Deep green #1f5f4a, or match your logo"
      />
    </Question>
  );
}
