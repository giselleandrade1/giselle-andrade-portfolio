import { profile } from "@/data/profile";

/** Circular portrait with a slow conic ring and floating stack chips. */
export function ProfilePortrait() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[16rem] sm:max-w-sm">
      <div aria-hidden className="bg-brand absolute inset-6 rounded-full opacity-50 blur-3xl" />
      <div
        aria-hidden
        className="ring-conic animate-spin-slow absolute inset-0 rounded-full p-[2px] opacity-90"
      >
        <div className="h-full w-full rounded-full bg-background" />
      </div>
      <img
        src={profile.photoUrl}
        alt="Foto de Giselle Andrade"
        width={460}
        height={460}
        fetchPriority="high"
        className="absolute inset-[6px] h-[calc(100%-12px)] w-[calc(100%-12px)] rounded-full object-cover"
      />
      <span className="glass animate-float absolute -left-2 top-[18%] rounded-full px-3 py-1.5 font-mono text-xs text-lilac sm:-left-6">
        Java
      </span>
      <span
        className="glass animate-float absolute -right-1 top-[38%] rounded-full px-3 py-1.5 font-mono text-xs text-lilac sm:-right-6"
        style={{ animationDelay: "-2.5s" }}
      >
        Node.js
      </span>
      <div
        className="glass animate-float absolute -bottom-3 left-1/2 w-max -translate-x-1/2 rounded-2xl px-4 py-3 font-mono text-xs"
        style={{ animationDelay: "-4s" }}
      >
        <p className="text-muted-foreground">{"// giselle.ts"}</p>
        <p>
          <span className="text-lavender">focus</span>:{" "}
          <span className="text-lilac">"full stack"</span>,{" "}
          <span className="text-lavender">open</span>: <span className="text-success">true</span>
          <span className="animate-caret text-lavender">▍</span>
        </p>
      </div>
    </div>
  );
}
