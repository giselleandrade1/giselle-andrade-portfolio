export type SocialPlatform = "github" | "linkedin" | "email";

export interface SocialLink {
  readonly platform: SocialPlatform;
  readonly label: string;
  readonly href: string;
  readonly handle: string;
  readonly external: boolean;
}

export interface NavItem {
  readonly label: string;
  readonly href: `#${string}`;
}

export interface Profile {
  readonly name: string;
  readonly givenName: string;
  readonly brand: string;
  readonly role: string;
  readonly headline: string;
  readonly headlineLead: string;
  readonly headlineAccent: string;
  readonly headlineTail: string;
  readonly summary: string;
  readonly bio: string;
  readonly location: string;
  readonly email: string;
  readonly avatar: string;
  readonly avatarAlt: string;
  readonly resumeUrl: string;
  readonly availability: string;
  readonly focus: readonly string[];
  readonly socialLinks: readonly SocialLink[];
}

export type ProjectCategory = "Full Stack" | "Frontend" | "Backend" | "Java";
export type ProjectFilter = "All" | ProjectCategory;
export type ProjectStatus = "Live";

export interface ProjectCaseStudy {
  readonly challenge: string;
  readonly solution: string;
  readonly keyDecisions: readonly string[];
  readonly result: string;
}

export interface Project {
  readonly slug: string;
  readonly name: string;
  readonly category: ProjectCategory;
  readonly categories: readonly ProjectCategory[];
  readonly description: string;
  readonly preview: `/projects/${string}.webp`;
  readonly previewAlt: string;
  readonly demoUrl: string;
  readonly repositoryUrl: string;
  readonly technologies: readonly string[];
  readonly status: ProjectStatus;
  readonly featured: boolean;
  readonly caseStudy?: ProjectCaseStudy;
}

export type SkillCategory =
  | "Languages"
  | "Frontend"
  | "Backend"
  | "Databases"
  | "Cloud & DevOps"
  | "Tools";

export interface Technology {
  readonly name: string;
  readonly slug: string;
}

export interface SkillGroup {
  readonly category: SkillCategory;
  readonly technologies: readonly Technology[];
}

export type ServiceIcon = "code" | "server" | "layout" | "palette" | "globe" | "cloud";

export interface Service {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: ServiceIcon;
}

export type ProcessIcon = "spark" | "layers" | "palette" | "code" | "check" | "cloud";

export interface ProcessStep {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: ProcessIcon;
}

export type ExperienceKind = "milestone" | "education" | "work";

export interface Experience {
  readonly id: string;
  readonly period: string;
  readonly title: string;
  readonly context: string;
  readonly description: string;
  readonly technologies?: readonly string[];
  readonly kind: ExperienceKind;
}
