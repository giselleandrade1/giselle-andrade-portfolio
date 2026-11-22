import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const tones = {
  default: "border-border bg-surface/60 text-lilac",
  strong: "border-lavender/40 bg-imperial/40 text-foreground",
  muted: "border-border bg-transparent text-muted-foreground",
  success: "border-success/30 bg-success/10 text-success",
} as const;

export function Tag({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.72rem] leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
