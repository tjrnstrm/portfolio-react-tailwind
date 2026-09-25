import { DOMAIN, MAIL, WHEN } from '../../../data/brief';
import type { StepProps } from '../../../lib/brief';
import { Choices } from '../Choices';
import { TextField } from '../Field';
import { Fold } from '../Fold';
import { Question } from '../Question';

/** Step 5: domain, business email and timeline. */
export function PracticalStep({ brief, set }: StepProps) {
  const wantsDomain = brief.domain === 'want';
  const wantsMail = brief.mail === 'want';

  return (
    <Question
      id="q-practical"
      title="The practical bits"
      hint="A domain is the address people type to find you, like yourcompany.se."
    >
      <Choices
        radio
        name="domain"
        size="md"
        label="Do you have a domain?"
        options={DOMAIN}
        selected={[brief.domain]}
        onPick={(domain) => set({ domain, domainValue: '' })}
      />
      <Fold open={brief.domain === 'have' || wantsDomain}>
        <TextField
          className="max-w-lg"
          label={wantsDomain ? 'Any names in mind?' : 'Which domain?'}
          value={brief.domainValue}
          onChange={(domainValue) => set({ domainValue })}
          placeholder={wantsDomain ? 'yourcompany.se, yourcompany.com' : 'yourcompany.se'}
        />
      </Fold>
      <Choices
        radio
        name="mail"
        size="md"
        label="Email on your own domain, like hello@yourcompany.se?"
        options={MAIL}
        selected={[brief.mail]}
        onPick={(mail) => set({ mail, mailValue: '' })}
      />
      <Fold open={brief.mail === 'have' || wantsMail}>
        <TextField
          className="max-w-lg"
          label={wantsMail ? 'Which addresses do you need?' : 'Which provider?'}
          value={brief.mailValue}
          onChange={(mailValue) => set({ mailValue })}
          placeholder={
            wantsMail
              ? 'hello@, info@, one per person...'
              : 'Google Workspace, Outlook, One.com...'
          }
        />
      </Fold>
      <Choices
        radio
        name="when"
        size="sm"
        label="When do you need it?"
        options={WHEN.map((w) => ({ id: w, label: w }))}
        selected={[brief.when]}
        onPick={(when) => set({ when })}
      />
    </Question>
  );
}
