import { describe, expect, it } from "vitest";

import { courses, education } from "@/data/education";
import { languages } from "@/data/profile";
import { projects } from "@/data/projects";
import { buildMailtoUrl, buildWhatsAppUrl, contactSchema, isLikelySpam } from "@/lib/contact";

describe("portfolio content rules", () => {
  it("shows a Live Demo only for projects verified online", () => {
    const easy = projects.find((p) => p.slug === "easy-schedule");
    const noctora = projects.find((p) => p.slug === "noctora-vault");
    expect(easy?.demo.status).toBe("offline");
    expect(noctora?.demo.status).toBe("offline");
    expect(projects.find((p) => p.slug === "control-consultoria")?.demo.status).toBe("online");
  });

  it("does not embed LembraFácil, whose site forbids framing", () => {
    const lembra = projects.find((p) => p.slug === "lembrafacil");
    expect(lembra?.demo.status === "online" && lembra.demo.embeddable).toBe(false);
  });

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
