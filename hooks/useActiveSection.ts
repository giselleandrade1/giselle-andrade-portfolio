"use client";

import { useEffect, useState } from "react";

export function useActiveSection(
  sectionIds: readonly string[],
  sectionAliases: Readonly<Record<string, string>> = {},
): string {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "hero");

  useEffect(() => {
    const observedIds = [...sectionIds, ...Object.keys(sectionAliases)];
    const sections = observedIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const visibleSections = new Set<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;
          if (entry.isIntersecting) visibleSections.add(section);
          else visibleSections.delete(section);
        });

        const activationLine = window.innerHeight * 0.3;
        const visible = [...visibleSections].sort((first, second) => {
          const firstDistance = Math.abs(first.getBoundingClientRect().top - activationLine);
          const secondDistance = Math.abs(second.getBoundingClientRect().top - activationLine);
          return firstDistance - secondDistance;
        });

        if (visible[0]?.id) {
          const visibleId = visible[0].id;
          setActiveSection(sectionAliases[visibleId] ?? visibleId);
        }
      },
      {
        rootMargin: "-30% 0px -69%",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionAliases, sectionIds]);

  return activeSection;
}
