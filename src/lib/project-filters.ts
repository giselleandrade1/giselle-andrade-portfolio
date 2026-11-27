import { techKey, type Project, type ProjectCategory } from "@/data/projects";

export type ProjectFilters = {
  category: ProjectCategory | "Todos";
  tech: string | null;
  query: string;
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

/** Applies category, technology and free-text filters (accent and case insensitive). */
export function filterProjects(list: Project[], { category, tech, query }: ProjectFilters) {
  const q = normalize(query);
  return list.filter((p) => {
    if (category !== "Todos" && !p.categories.includes(category)) return false;
    if (tech && !p.stack.some((s) => techKey(s) === tech)) return false;
    if (!q) return true;
    const haystack = normalize([p.name, p.tagline, ...p.stack, ...p.categories].join(" "));
    return haystack.includes(q);
  });
}
