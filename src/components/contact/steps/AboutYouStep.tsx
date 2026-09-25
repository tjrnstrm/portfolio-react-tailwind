import type { StepProps } from '../../../lib/brief';
import { TextField } from '../Field';
import { Question } from '../Question';

/** Step 2: who is asking. Name and email are mandatory. */
export function AboutYouStep({
  brief,
  set,
  flagged,
}: StepProps & { flagged: { name: boolean; email: boolean } }) {
  return (
    <Question
      id="q-who"
      title="About you"
      hint="So I know who I am building for, and where to reply. Fields marked * are required."
    >
      <div className="grid gap-x-5 gap-y-[18px] sm:grid-cols-2">
        <TextField
          label="Your name"
          name="name"
          required
          flagged={flagged.name}
          autoComplete="name"
          value={brief.name}
          onChange={(name) => set({ name })}
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          required
          flagged={flagged.email}
          autoComplete="email"
          value={brief.email}
          onChange={(email) => set({ email })}
          placeholder="you@company.se"
        />
        <TextField
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
          value={brief.phone}
          onChange={(phone) => set({ phone })}
        />
        <TextField
          label="Company (optional)"
          autoComplete="organization"
          value={brief.company}
          onChange={(company) => set({ company })}
          placeholder="Your company AB"
        />
        <TextField
          label="What you do"
          value={brief.industry}
          onChange={(industry) => set({ industry })}
          placeholder="Excavation contractor, hair salon..."
        />
        <TextField
          label="Location"
          value={brief.location}
          onChange={(location) => set({ location })}
          placeholder="Stockholm"
        />
        <TextField
          label="Who are your customers?"
          className="sm:col-span-2"
          value={brief.audience}
          onChange={(audience) => set({ audience })}
          placeholder="Construction firms and private homeowners"
        />
      </div>
    </Question>
  );
}
