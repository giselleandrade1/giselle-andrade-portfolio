"use client";

import { useState } from "react";

import { projectFilters } from "@/data/projects";
import type { ProjectFilter } from "@/data/types";

import styles from "./sections.module.css";

export function ProjectFilters({ totalProjects }: { totalProjects: number }) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("All");
  const [visibleProjects, setVisibleProjects] = useState(totalProjects);

  function applyFilter(filter: ProjectFilter) {
    const projectList = document.getElementById("project-list");
    const projectCards = Array.from(
      projectList?.querySelectorAll<HTMLElement>("[data-project-card]") ?? [],
    );
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const categories = card.dataset.categories?.split("|") ?? [];
      const isVisible = filter === "All" || categories.includes(filter);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    setActiveFilter(filter);
    setVisibleProjects(visibleCount);
  }

  return (
    <>
      <div aria-label="Filter projects by category" className={styles.filterBar} role="group">
        {projectFilters.map((filter) => (
          <button
            aria-controls="project-list"
            aria-pressed={activeFilter === filter}
            className={styles.filterButton}
            key={filter}
            onClick={() => applyFilter(filter)}
            type="button"
          >
            {filter}
          </button>
        ))}
      </div>
      <p aria-live="polite" className={styles.filterStatus} role="status">
        Showing {visibleProjects} {visibleProjects === 1 ? "project" : "projects"}
        {activeFilter === "All" ? "." : ` in ${activeFilter}.`}
      </p>
    </>
  );
}
