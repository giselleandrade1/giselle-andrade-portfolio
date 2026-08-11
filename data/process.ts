import type { ProcessStep } from "@/data/types";

export const processSteps = [
  {
    id: "discover",
    title: "Discover",
    description: "Clarify the goal, the people using the product, its constraints, and what success means.",
    icon: "spark",
  },
  {
    id: "plan",
    title: "Plan",
    description: "Turn requirements into scope, flows, data, priorities, and deliberate technical decisions.",
    icon: "layers",
  },
  {
    id: "design",
    title: "Design",
    description: "Shape hierarchy, responsive behavior, accessible interactions, and clear system feedback.",
    icon: "palette",
  },
  {
    id: "develop",
    title: "Develop",
    description: "Build maintainable interfaces, APIs, business rules, and the connections between them.",
    icon: "code",
  },
  {
    id: "test",
    title: "Test",
    description: "Validate behavior, accessibility, performance, edge cases, and real device constraints.",
    icon: "check",
  },
  {
    id: "deploy",
    title: "Deploy",
    description: "Ship carefully, verify production behavior, and document decisions and limitations.",
    icon: "cloud",
  },
] as const satisfies readonly ProcessStep[];
