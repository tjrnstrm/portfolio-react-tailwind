import { LANGS, STYLES, THEMES } from '../../../data/brief';
import type { FlaggedProps } from '../../../lib/brief';
import { Choices } from '../Choices';
import { TextField } from '../Field';
import { Fold } from '../Fold';
import { Question } from '../Question';

/**
 * Step 4: style, theme, copy language and brand colour. Style, theme and
 * language are mandatory. "Not sure" on style asks for sites they like, the
 * same field as on the last step; "Other" on language asks which one.
 */
export function FeelStep({ brief, set, flagged }: FlaggedProps) {
  return (
    <Question id="q-feel" title="How should it feel?">
      <Choices
        radio
        required
        flagged={flagged.style}
        name="style"
        size="sm"
        label="Style"
        options={STYLES}
        selected={[brief.style]}
        onPick={(style) => set({ style })}
      />
      <Fold open={brief.style === 'unsure'}>
        <TextField
          label="Are there any sites you like?"
          className="max-w-lg"
          value={brief.refs}
          onChange={(refs) => set({ refs })}
          placeholder="apple.com, a competitor..."
        />
      </Fold>
      <div className="flex flex-wrap gap-x-10 gap-y-[22px]">
        <Choices
          radio
          required
          flagged={flagged.theme}
          name="theme"
          size="sm"
          label="Theme"
          options={THEMES}
          selected={[brief.theme]}
          onPick={(theme) => set({ theme })}
        />
        <Choices
          radio
          required
          flagged={flagged.lang}
          name="lang"
          size="sm"
          label="Copy language"
          options={LANGS}
          selected={[brief.lang]}
          onPick={(lang) => set({ lang, langOther: '' })}
        />
      </div>
      <Fold open={brief.lang === 'other'}>
        <TextField
          label="Which language?"
          name="langOther"
          required
          flagged={flagged.langOther}
          className="max-w-lg"
          value={brief.langOther}
          onChange={(langOther) => set({ langOther })}
          placeholder="Norwegian, Arabic, Spanish..."
        />
      </Fold>
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
