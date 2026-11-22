import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
  id?: string;
};

export function SectionHeading({ eyebrow, title, description, as = "h2", className, id }: Props) {
  const Heading = as;
  return (
    <div data-reveal className={cn("max-w-2xl", className)}>
      <p className="eyebrow">
        <span aria-hidden className="text-muted-foreground">
          {"// "}
        </span>
        {eyebrow}
      </p>
      <Heading
        id={id}
        className={cn(
          "mt-3 font-semibold text-foreground",
          as === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="bg-aurora pointer-events-none absolute inset-0" />
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
      <div className="container-page relative pb-12 pt-16 sm:pb-16 sm:pt-24">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} />
      </div>
    </section>
  );
}
