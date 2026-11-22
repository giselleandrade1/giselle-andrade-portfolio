import type { ReactNode } from "react";

export type TimelineItem = {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  badge?: ReactNode;
  body?: ReactNode;
  current?: boolean;
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative space-y-6 border-l border-border pl-6 sm:pl-8">
      <span
        aria-hidden
        className="timeline-fill bg-brand pointer-events-none absolute -left-px top-0 h-full w-0.5 shadow-glow"
      />
      {items.map((item) => (
        <li key={item.id} data-reveal className="relative">
          <span
            aria-hidden
            className={`absolute -left-[31px] top-6 grid size-3.5 place-items-center rounded-full border sm:-left-[39px] ${
              item.current ? "border-lavender bg-primary shadow-glow" : "border-border bg-surface"
            }`}
          />
          <div className="glass rounded-2xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="font-mono text-xs text-lavender">{item.period}</p>
              {item.badge}
            </div>
            <h3 className="mt-2 text-lg font-semibold sm:text-xl">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.subtitle}</p>
            {item.body ? (
              <div className="mt-4 text-sm text-muted-foreground">{item.body}</div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
