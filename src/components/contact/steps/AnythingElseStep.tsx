import type { StepProps } from '../../../lib/brief';
import { PILL_FOCUS } from '../../../lib/type';
import { RedArrow } from '../../ui/RedArrow';
import { TextField } from '../Field';
import { Question } from '../Question';

/** Step 6: references and free text, and the send button. */
export function AnythingElseStep({ brief, set }: StepProps) {
  return (
    <Question id="q-else" title="Anything else?">
      <TextField
        label="Sites you like"
        value={brief.refs}
        onChange={(refs) => set({ refs })}
        placeholder="apple.com, a competitor..."
      />
      <TextField
        label="The idea, in your own words"
        rows={5}
        value={brief.idea}
        onChange={(idea) => set({ idea })}
        placeholder="What it should do, who it is for, anything I should know..."
      />
      <button
        type="submit"
        className={`glass-pill group mt-1 inline-flex min-h-14 items-center gap-5 self-start rounded-full px-7 text-left text-[15px] font-medium ${PILL_FOCUS}`}
      >
        <span>Send brief · book free consultation</span>
        <RedArrow className="text-red-500 dark:text-red-400" />
      </button>
    </Question>
  );
}
