import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { courses, education } from "@/data/education";
import { languages, profile } from "@/data/profile";
import { demoUrl, findProject, projects } from "@/data/projects";
import { buildMailtoUrl, buildWhatsAppUrl, contactSchema, isLikelySpam } from "@/lib/contact";
import { filterProjects } from "@/lib/project-filters";

const root = resolve(__dirname, "../..");

describe("project demo links", () => {
  it("points Easy Schedule Java to the official fly.dev demo", () => {
    const easy = projects.find((p) => p.slug === "easy-schedule-java");
    expect(easy && demoUrl(easy.demo)).toBe("https://easy-schedule-java.fly.dev/login");
  });

  it("points Noctora Vault Challenge to the official vercel demo", () => {
    const noctora = projects.find((p) => p.slug === "noctora-vault-challenge");
    expect(noctora && demoUrl(noctora.demo)).toBe("https://noctora-vault-challenge.vercel.app");
  });

  it("keeps the demo link separate from the source repository", () => {
    const noctora = projects.find((p) => p.slug === "noctora-vault-challenge");
    expect(noctora?.repo).toBe("https://github.com/giselleandrade1/noctora-vault-challenge");
    expect(projects.find((p) => p.slug === "easy-schedule-java")?.repo).toBeNull();
  });

  it("still opens projects through their previous addresses", () => {
    expect(findProject("easy-schedule")?.slug).toBe("easy-schedule-java");
    expect(findProject("noctora-vault")?.slug).toBe("noctora-vault-challenge");
  });

  it("keeps all eight projects", () => {
    expect(projects).toHaveLength(8);
  });

  it("does not embed LembraFácil, whose site forbids framing", () => {
    const lembra = projects.find((p) => p.slug === "lembrafacil");
    expect(lembra?.demo.status === "online" && lembra.demo.embeddable).toBe(false);
  });
});

describe("project filters", () => {
  it("finds Java projects regardless of version suffix", () => {
    const names = filterProjects(projects, { category: "Todos", tech: "Java", query: "" }).map(
      (p) => p.slug,
    );
    expect(names).toEqual(["easy-schedule-java", "lembrafacil"]);
  });

  it("searches ignoring accents and case", () => {
    const found = filterProjects(projects, { category: "Todos", tech: null, query: "lembrafacil" });
    expect(found.map((p) => p.slug)).toEqual(["lembrafacil"]);
  });
});

describe("local assets and removed files", () => {
  it("serves the résumé PDF from the repository", () => {
    const pdf = resolve(root, "public", profile.cvUrl.replace(/^\//, ""));
    expect(readFileSync(pdf).subarray(0, 4).toString()).toBe("%PDF");
  });

  it("stores the GitHub profile photo inside the project", () => {
    const photo = resolve(root, "src/assets/profile/giselle-andrade-github.webp");
    expect(statSync(photo).size).toBeGreaterThan(10_000);
    expect(profile.photoUrl.startsWith("http")).toBe(false);
  });

  it("has no README.md or AGENTS.md / agentes.md at the project root", () => {
    for (const name of ["README.md", "readme.md", "AGENTS.md", "agents.md", "agentes.md"]) {
      expect(existsSync(resolve(root, name))).toBe(false);
    }
  });
});

describe("portfolio content rules", () => {
  it("keeps the Google data analytics course in progress", () => {
    expect(courses.find((c) => c.id === "google-data")?.status).toBe("Em andamento");
  });

  it("dates IFRS courses in 2025", () => {
    const ifrs = courses.filter((c) => c.institution === "IFRS");
    expect(ifrs.length).toBe(4);
    expect(ifrs.every((c) => c.year === "2025")).toBe(true);
  });

  it("marks only the ETEC technical course as concluded", () => {
    expect(education.filter((e) => e.status === "Concluído").map((e) => e.id)).toEqual([
      "etec-adm",
    ]);
  });

  it("shows English at professional level", () => {
    expect(languages.find((l) => l.name === "Inglês")?.level).toBe("Profissional");
  });
});

describe("contact form", () => {
  const valid = {
    name: "Ana Souza",
    email: "ana@empresa.com",
    subject: "",
    message: "Olá! Gostaria de conversar sobre uma vaga.",
  };

  it("rejects messages shorter than 20 characters", () => {
    expect(contactSchema.safeParse({ ...valid, message: "Oi" }).success).toBe(false);
  });

  it("rejects an invalid e-mail", () => {
    expect(contactSchema.safeParse({ ...valid, email: "ana@" }).success).toBe(false);
  });

  it("treats a filled honeypot or a submit under 3 seconds as spam", () => {
    expect(isLikelySpam({ honeypot: "x", startedAt: 0, now: 10_000 })).toBe(true);
    expect(isLikelySpam({ honeypot: "", startedAt: 0, now: 2_000 })).toBe(true);
    expect(isLikelySpam({ honeypot: "", startedAt: 0, now: 5_000 })).toBe(false);
  });

  it("builds e-mail and WhatsApp links to Giselle", () => {
    expect(buildMailtoUrl("giselleandradelourenco@gmail.com", valid)).toMatch(
      /^mailto:giselleandradelourenco@gmail\.com\?/,
    );
    expect(buildWhatsAppUrl("5511925145167", valid)).toMatch(
      /^https:\/\/wa\.me\/5511925145167\?text=/,
    );
  });
});
