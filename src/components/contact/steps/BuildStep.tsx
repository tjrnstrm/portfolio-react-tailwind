import { CATEGORIES } from '../../../data/brief';
import { toggle, type StepProps } from '../../../lib/brief';
import { Choices } from '../Choices';
import { TextField } from '../Field';
import { Fold } from '../Fold';
import { Question } from '../Question';

/** Step 1: what kind of project, with a "what kind?" follow-up per category. */
export function BuildStep({ brief, set }: StepProps) {
  return (
    <Question
      id="q-build"
      title="What are we building?"
      hint="Pick everything that applies. Not sure is a perfectly good answer."
    >
      <Choices
        name="category"
        size="md"
        options={CATEGORIES}
        selected={brief.cats}
        onPick={(id) => set({ cats: toggle(brief.cats, id) })}
      />
      {CATEGORIES.filter((c) => c.types.length).map((c) => (
        <Fold key={c.id} open={brief.cats.includes(c.id)}>
          <Choices
            stagger
            name={`type-${c.id}`}
            size="sm"
            label={`${c.label}: what kind?`}
            options={c.types.map((t) => ({ id: `${c.id}:${t}`, label: t }))}
            selected={brief.types}
            onPick={(id) => set({ types: toggle(brief.types, id) })}
          />
        </Fold>
      ))}
      <Fold open={brief.cats.includes('other')}>
        <TextField
          label="Something else: describe it"
          value={brief.other}
          onChange={(other) => set({ other })}
          placeholder="A digital menu for a restaurant, an event page, a members club..."
        />
      </Fold>
    </Question>
  );
}
