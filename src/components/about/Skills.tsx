import { STACK } from "../../data/about";
import { Eyebrow } from "../ui/Eyebrow";

export function Skills() {
  return (
    <div className="space-y-4">
      <Eyebrow>Skills</Eyebrow>
      <div className="flex flex-wrap gap-2">
        {STACK.map((item) => (
          <span
            key={item}
            className="font-mono text-[11px] border border-zinc-300 dark:border-white/10 rounded-full px-3.5 py-1.5 text-zinc-700 dark:text-zinc-400"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
