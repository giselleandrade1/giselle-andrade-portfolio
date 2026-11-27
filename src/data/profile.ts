import photo from "@/assets/profile/giselle-andrade-github.webp";
import photoSmall from "@/assets/profile/giselle-andrade-github-240.webp";

/**
 * Single source of truth for personal/professional facts.
 * Sources: LinkedIn export (Profile.pdf) and résumé (CV - Giselle Andrade Lourenço.pdf).
 * Never add facts here that are not in those documents or confirmed by Giselle.
 */
export const profile = {
  name: "Giselle Andrade",
  fullName: "Giselle Andrade Lourenço",
  role: "Desenvolvedora Full Stack Júnior",
  /** Professional positioning shown in the hero (chosen by Giselle). */
  headline: ["Full Stack Developer", "Backend Focus", "Java & TypeScript"],
  /** Degrees in progress (see education.ts). */
  academic: "Ciência da Computação · Análise e Desenvolvimento de Sistemas",
  headlineStack: ["JavaScript", "Node.js", "Java", "SQL"],
  location: "São Paulo, SP",
  workModes: "Remoto, híbrido ou presencial",
  availability: "Disponível para estágio e vagas júnior",
  intro:
    "Sou estudante de Ciência da Computação e Análise e Desenvolvimento de Sistemas, com experiência prática no desenvolvimento de aplicações web e soluções digitais. Tenho interesse em desenvolvimento Full Stack, backend, arquitetura de sistemas e resolução de problemas por meio da tecnologia.",
  email: "giselleandradelourenco@gmail.com",
  /** WhatsApp in international format, digits only (public on the CV and LinkedIn). */
  whatsapp: "5511925145167",
  github: "https://github.com/giselleandrade1",
  githubHandle: "giselleandrade1",
  linkedin: "https://www.linkedin.com/in/giselleandrades2/",
  linkedinHandle: "giselleandrades2",
  /** Résumé PDF stored in the repository (public/assets/docs). */
  cvUrl: "/assets/docs/curriculo-giselle-andrade.pdf",
  cvFileName: "curriculo-giselle-andrade.pdf",
  /** Online résumé published by Giselle on GitHub Pages. */
  cvWebUrl: "https://giselleandrade1.github.io/curriculum-web/",
  /** Official GitHub profile photo, stored locally (src/assets/profile). */
  photoUrl: photo,
  photoSmallUrl: photoSmall,
  photoAlt: "Foto de perfil de Giselle Andrade, desenvolvedora Full Stack",
  /** Public address of the published portfolio (used for sitemap and structured data). */
  siteUrl: "https://giselleandrade1-dev.vercel.app",
  lookingFor: [
    "Estágio em Tecnologia da Informação",
    "Desenvolvedora Full Stack Júnior",
    "Desenvolvedora Back-end Júnior",
    "Desenvolvedora Front-end Júnior",
    "Analista de Sistemas Júnior",
  ],
} as const;

export type Language = { name: string; level: string };

export const languages: Language[] = [
  { name: "Português", level: "Nativo" },
  { name: "Inglês", level: "Profissional" },
  { name: "Espanhol", level: "Iniciante" },
];
