import { ArrowUp } from "lucide-react";

export function BackToTop() {
  return (
    <button
      type="button"
      aria-label="Voltar ao topo"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="back-to-top glass fixed bottom-5 right-5 z-40 grid size-11 place-items-center rounded-full text-lilac shadow-glow transition-colors hover:text-foreground"
    >
      <ArrowUp className="size-5" aria-hidden />
    </button>
  );
}
