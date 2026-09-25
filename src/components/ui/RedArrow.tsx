/** The red → that marks an action; nudges right when its `group` parent is hovered. */
export function RedArrow({ className = 'text-red-500' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`${className} transition-transform group-hover:translate-x-1 motion-reduce:transition-none`}
    >
      →
    </span>
  );
}
