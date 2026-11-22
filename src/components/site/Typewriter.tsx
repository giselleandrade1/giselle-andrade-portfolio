import { useEffect, useState } from "react";

/** Types and deletes words in a loop. SSR/first paint shows the first word; reduced motion keeps it static. */
export function Typewriter({ words, className }: { words: readonly string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(words[0] ?? "");
  const [deleting, setDeleting] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;
    const word = words[index % words.length] ?? "";
    let delay = deleting ? 45 : 85;
    if (!deleting && text === word) delay = 1600;
    if (deleting && text === "") delay = 300;
    const t = window.setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
    }, delay);
    return () => window.clearTimeout(t);
  }, [active, deleting, index, text, words]);

  return (
    <span className={className}>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden>
        {text}
        <span className="animate-caret ml-0.5 text-lavender">▍</span>
      </span>
    </span>
  );
}
