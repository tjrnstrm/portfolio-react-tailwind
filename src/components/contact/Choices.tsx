import type { CSSProperties } from 'react';
import type { Choice } from '../../data/brief';
import { Chip, type ChipSize } from './Chip';
import { FIELD_LABEL } from './Field';

type ChoicesProps = {
  name: string;
  options: Choice[];
  selected: string[];
  onPick: (id: string) => void;
  size: ChipSize;
  radio?: boolean;
  label?: string;
  /** Fan the chips in one after another when their fold opens. */
  stagger?: boolean;
};

/** A labelled row of chips: checkboxes by default, radios with `radio`. */
export function Choices({
  name,
  options,
  selected,
  onPick,
  size,
  radio,
  label,
  stagger,
}: ChoicesProps) {
  const labelId = `${name}-label`;
  return (
    <div className="flex flex-col gap-2.5">
      {label && (
        <span id={labelId} className={FIELD_LABEL}>
          {label}
        </span>
      )}
      <div
        role={label ? (radio ? 'radiogroup' : 'group') : undefined}
        aria-labelledby={label ? labelId : undefined}
        className={`flex flex-wrap ${size === 'md' ? 'gap-2.5' : 'gap-2'}`}
      >
        {options.map((o, i) => {
          const chip = (
            <Chip
              key={o.id}
              type={radio ? 'radio' : 'checkbox'}
              name={name}
              size={size}
              label={o.label}
              checked={selected.includes(o.id)}
              onChange={() => onPick(o.id)}
            />
          );
          return stagger ? (
            <span
              key={o.id}
              className="fold-item"
              style={{ '--i': i } as CSSProperties}
            >
              {chip}
            </span>
          ) : (
            chip
          );
        })}
      </div>
    </div>
  );
}
