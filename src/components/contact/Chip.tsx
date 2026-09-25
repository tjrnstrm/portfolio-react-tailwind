import { playSound } from '../../lib/sound';

const CHIP_SIZE = {
  sm: 'min-h-11 text-sm',
  md: 'min-h-12 text-[15px]',
};

export type ChipSize = keyof typeof CHIP_SIZE;

type ChipProps = {
  type: 'checkbox' | 'radio';
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  size: ChipSize;
};

/** A real checkbox/radio dressed as a glass chip (styles: .chip in index.css). */
export function Chip({ type, name, label, checked, onChange, size }: ChipProps) {
  return (
    <label className={`chip ${CHIP_SIZE[size]}`}>
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={() => {
          playSound('toggle');
          onChange();
        }}
        className="sr-only"
      />
      <span className="chip-tick" aria-hidden="true">
        <svg
          width="14"
          height="14"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 6.2l2.3 2.3 4.7-5" />
        </svg>
      </span>
      {label}
    </label>
  );
}
