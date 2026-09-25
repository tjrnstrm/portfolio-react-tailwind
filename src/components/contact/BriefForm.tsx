import type { FormEvent } from 'react';
import type { StepProps } from '../../lib/brief';
import { AboutYouStep } from './steps/AboutYouStep';
import { AnythingElseStep } from './steps/AnythingElseStep';
import { BuildStep } from './steps/BuildStep';
import { FeelStep } from './steps/FeelStep';
import { PracticalStep } from './steps/PracticalStep';
import { SectionsStep } from './steps/SectionsStep';

type BriefFormProps = StepProps & {
  /** Mandatory fields to mark as missing (after a send attempt). */
  flagged: { name: boolean; email: boolean };
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

/** The six steps of the brief. Validation is done in `onSubmit`, not by the browser. */
export function BriefForm({ brief, set, flagged, onSubmit }: BriefFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <BuildStep brief={brief} set={set} />
      <AboutYouStep brief={brief} set={set} flagged={flagged} />
      <SectionsStep brief={brief} set={set} />
      <FeelStep brief={brief} set={set} />
      <PracticalStep brief={brief} set={set} />
      <AnythingElseStep brief={brief} set={set} />
    </form>
  );
}
