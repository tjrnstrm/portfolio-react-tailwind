import type { ReactNode } from 'react';

export const FIELD_LABEL = 'text-[13px] font-medium text-zinc-600 dark:text-zinc-400';

type FieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
  /** Adds a * after the label. */
  required?: boolean;
  /** Turns the * red: a mandatory field left empty. */
  flagged?: boolean;
};

/** A label above any control. */
export function Field({ label, children, className = '', required, flagged }: FieldProps) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className={FIELD_LABEL}>
        {label}
        {required && (
          <span
            aria-hidden="true"
            className={`ml-1 transition-colors duration-200 ${
              flagged ? 'text-red-500' : 'text-zinc-400 dark:text-zinc-500'
            }`}
          >
            *
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

type TextFieldProps = Omit<FieldProps, 'children'> & {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel';
  name?: string;
  autoComplete?: string;
  /** A textarea with this many rows instead of a one-line input. */
  rows?: number;
};

/** A labelled glass text input (or textarea with `rows`). */
export function TextField({
  value,
  onChange,
  placeholder,
  type = 'text',
  name,
  autoComplete,
  rows,
  ...field
}: TextFieldProps) {
  return (
    <Field {...field}>
      {rows ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="glass-field"
        />
      ) : (
        <input
          type={type}
          name={name}
          required={field.required}
          aria-invalid={field.required ? field.flagged : undefined}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="glass-field"
        />
      )}
    </Field>
  );
}
