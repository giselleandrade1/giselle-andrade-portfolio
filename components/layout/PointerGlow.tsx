"use client";

import { useEffect, useRef } from "react";

export function PointerGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!glow || !pointerQuery.matches || motionQuery.matches) {
      return;
    }

    let frame = 0;
    let pointerX = -1000;
    let pointerY = -1000;

    const render = () => {
      glow.style.setProperty("--pointer-x", `${pointerX}px`);
      glow.style.setProperty("--pointer-y", `${pointerY}px`);
      glow.dataset.active = "true";
      frame = 0;
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (frame === 0) {
        frame = window.requestAnimationFrame(render);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={glowRef} className="pointerGlow" aria-hidden="true" />;
}
