import { profile } from "@/data/profile";

/** Circular portrait (official GitHub photo, stored locally) with a slow conic ring. */
export function ProfilePortrait() {
  return (
    <div className="animate-reveal relative mx-auto aspect-square w-full max-w-[15rem] sm:max-w-sm">
      <div aria-hidden className="bg-brand absolute inset-8 rounded-full opacity-40 blur-3xl" />
      <div
        aria-hidden
        className="ring-conic animate-spin-slow absolute inset-0 rounded-full p-[2px] opacity-90"
      >
        <div className="h-full w-full rounded-full bg-background" />
      </div>
      <picture>
        <source media="(max-width: 640px)" srcSet={profile.photoSmallUrl} type="image/webp" />
        <img
          src={profile.photoUrl}
          alt={profile.photoAlt}
          width={460}
          height={460}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-[6px] h-[calc(100%-12px)] w-[calc(100%-12px)] rounded-full object-cover"
        />
      </picture>
      <span
        aria-hidden
        className="glass animate-float absolute -left-2 top-[16%] rounded-full px-3 py-1.5 font-mono text-xs text-lilac sm:-left-6"
      >
        Java
      </span>
      <span
        aria-hidden
        className="glass animate-float absolute -right-1 top-[40%] rounded-full px-3 py-1.5 font-mono text-xs text-lilac sm:-right-8"
        style={{ animationDelay: "-2.5s" }}
      >
        TypeScript
      </span>
      <div
        aria-hidden
        className="glass animate-float absolute -bottom-3 left-1/2 w-max max-w-[calc(100vw-2.5rem)] -translate-x-1/2 rounded-2xl px-4 py-3 font-mono text-xs"
        style={{ animationDelay: "-4s" }}
      >
        <p className="text-muted-foreground">{"// giselle.ts"}</p>
        <p>
          <span className="text-lavender">focus</span>:{" "}
          <span className="text-lilac">"backend"</span>, <span className="text-lavender">open</span>
          : <span className="text-success">true</span>
          <span className="animate-caret text-lavender">▍</span>
        </p>
      </div>
    </div>
  );
}
