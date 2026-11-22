import { useEffect } from "react";

/**
 * Pointer-driven effects for fine pointers (mouse/trackpad):
 * - cursor glow position (--cx/--cy on <html>)
 * - spotlight + 3D tilt on `.card-interactive` (--mx/--my/--rx/--ry)
 * - magnetic pull on `[data-magnetic]` (--tx/--ty)
 * Only inline CSS variables are written, after hydration, so SSR markup is untouched.
 */
export function useInteractiveEffects() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    let raf = 0;
    let last: PointerEvent | null = null;
    let card: HTMLElement | null = null;
    let magnet: HTMLElement | null = null;

    const resetCard = (el: HTMLElement) => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    const resetMagnet = (el: HTMLElement) => {
      el.style.setProperty("--tx", "0px");
      el.style.setProperty("--ty", "0px");
    };

    const apply = () => {
      raf = 0;
      const e = last;
      if (!e) return;
      root.style.setProperty("--cx", `${e.clientX}px`);
      root.style.setProperty("--cy", `${e.clientY}px`);
      const target = e.target instanceof Element ? e.target : null;

      const nextCard = target?.closest<HTMLElement>(".card-interactive") ?? null;
      if (card && card !== nextCard) resetCard(card);
      card = nextCard;
      if (card) {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
        if (!reduce) {
          card.style.setProperty("--rx", `${(px - 0.5) * 7}deg`);
          card.style.setProperty("--ry", `${(0.5 - py) * 7}deg`);
        }
      }

      const nextMagnet = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (magnet && magnet !== nextMagnet) resetMagnet(magnet);
      magnet = nextMagnet;
      if (magnet && !reduce) {
        const r = magnet.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        magnet.style.setProperty("--tx", `${dx * 0.22}px`);
        magnet.style.setProperty("--ty", `${dy * 0.3}px`);
      }
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      root.style.setProperty("--cx", "-999px");
      root.style.setProperty("--cy", "-999px");
      if (card) resetCard(card);
      if (magnet) resetMagnet(magnet);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);
}
