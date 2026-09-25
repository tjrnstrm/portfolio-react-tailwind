import { MdArrowOutward } from "react-icons/md";
import type { TimelineItem } from "../../data/about";
import { Eyebrow } from "../ui/Eyebrow";

/** A labelled list of roles or schools: title, period and an optional note. */
export function Timeline({ label, items }: { label: string; items: TimelineItem[] }) {
  return (
    <div className="space-y-4">
      <Eyebrow>{label}</Eyebrow>
      <div className="space-y-6">
        {items.map((item) => (
          <TimelineEntry key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}

function TimelineEntry({ item }: { item: TimelineItem }) {
  return (
    <div>
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {item.title}
      </p>
      <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
        {item.period}
      </p>
      {item.description && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
          {item.description}
          {item.link && (
            <>
              {" "}
              <a
                href={item.link.href}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-zinc-950 dark:hover:text-zinc-300 transition-colors"
              >
                <span className="inline-flex items-center gap-1">
                  {item.link.label} <MdArrowOutward size={11} />
                </span>
              </a>
            </>
          )}
        </p>
      )}
    </div>
  );
}
