"use client";

import { useState } from "react";

import { projectFilters } from "@/data/projects";
import type { ProjectFilter } from "@/data/types";
import { formatMessage, type Messages } from "@/i18n";

import styles from "./sections.module.css";

type ProjectFiltersProps = {
  totalProjects: number;
  messages: Messages["projects"];
};

export function ProjectFilters({ totalProjects, messages }: ProjectFiltersProps) {
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

  const statusTemplate =
    activeFilter === "All"
      ? visibleProjects === 1
        ? messages.status.allOne
        : messages.status.allMany
      : visibleProjects === 1
        ? messages.status.filteredOne
        : messages.status.filteredMany;
  const statusMessage = formatMessage(statusTemplate, {
    count: visibleProjects,
    filter: messages.filters[activeFilter],
  });

  return (
    <>
      <div aria-label={messages.filterLabel} className={styles.filterBar} role="group">
        {projectFilters.map((filter) => (
          <button
            aria-controls="project-list"
            aria-pressed={activeFilter === filter}
            className={styles.filterButton}
            key={filter}
            onClick={() => applyFilter(filter)}
            type="button"
          >
            {messages.filters[filter]}
          </button>
        ))}
      </div>
      <p aria-live="polite" className={styles.filterStatus} role="status">
        {statusMessage}
      </p>
    </>
  );
}
