import { SECTIONS } from '../../../data/brief';
import { toggle, type FlaggedProps } from '../../../lib/brief';
import { Choices } from '../Choices';
import { TextField } from '../Field';
import { Question } from '../Question';

/** Step 3: the sections of the first version, and what visitors should do. */
export function SectionsStep({ brief, set, flagged }: FlaggedProps) {
  return (
    <Question
      id="q-sections"
      title="What goes on it?"
      hint="Sections for the first version. Skip this if it is an API or you are not sure."
    >
      <Choices
        name="section"
        size="sm"
        options={SECTIONS}
        selected={brief.secs}
        onPick={(id) => set({ secs: toggle(brief.secs, id) })}
      />
      <TextField
        label="What should visitors do?"
        name="cta"
        required
        flagged={flagged.cta}
        className="max-w-lg"
        value={brief.cta}
        onChange={(cta) => set({ cta })}
        placeholder="Request a quote, book a time..."
      />
    </Question>
  );
}
