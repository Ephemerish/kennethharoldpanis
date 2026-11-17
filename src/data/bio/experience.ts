/**
 * Roles and schools, one timeline, newest first: shown on /bio, listed on the
 * tag and tech pages they name, indexed by search.json. Each is `Listed`
 * (src/data/model.ts): `image` is the organisation's logo.
 */
import type { Listed } from "../model";

export interface TimelineEntry extends Listed {
  org: string;
  /** The year it started. */
  startDate: string;
  /** The year it ended; absent while it's still going, as for a project. */
  endDate?: string;
  /** The project or post it produced: its tech counts as tech used here. */
  href?: string;
}

export const timeline: TimelineEntry[] = [
  {
    slug: "alphaus",
    image: "/images/orgs/alphaus.svg",
    title: "Software Engineer",
    org: "Alphaus Inc",
    startDate: "2024",
    description: "Focused on the Ripple product, leading the shift to a micro-frontend architecture to modernize its capabilities. Handled full-stack development across UI updates, backend services, and CI/CD pipelines. Managed the testing and delivery workflows to ensure stable, low-risk production releases.",
    tags: ["web-app", "architecture"],
    // From the owner's commits: the Ripple micro-frontends (alupi, ripple-ui),
    // the Go billing and pricing services and their deploys (ouchan), the
    // Azure pricing API (his first work there, July 2024), and Ebb.
    tech: [
      "React", "TypeScript", "Vue", "Vite", "Tailwind CSS", "Module Federation", "single-spa", "Nx", "Zustand",
      "TanStack Query", "Radix UI", "shadcn", "i18next",
      "Go", "gRPC",
      "Spanner", "Amazon DynamoDB", "Redis", "Drizzle ORM",
      "Cypress", "Playwright", "Vitest", "Jest",
      "Docker", "Kubernetes", "Google Kubernetes Engine", "CircleCI", "nginx",
      "Google Cloud", "AWS", "Azure", "FinOps", "FOCUS",
    ],
    href: "/blogs/micro-frontends-experience-ripplev2",
  },
  {
    slug: "bohol-island-state-university",
    image: "/images/orgs/bohol-island-state-university.png",
    title: "BS Computer Engineering",
    org: "Bohol Island State University",
    startDate: "2020",
    endDate: "2024",
    description: "Undergraduate degree in Computer Engineering. Thesis work built a marine communication network for monitoring small fishing boats.",
    tags: ["education", "thesis", "hardware"],
    // The BS Computer Engineering curriculum (programming, data structures,
    // databases, networks, operating systems, embedded systems, assembly
    // language), mobile apps in class (C#, Kotlin and Jetpack Compose,
    // Flutter and Dart), the web development he did in class, and the thesis
    // hardware.
    tech: [
      "C", "C++", "Assembly", "C#", "Java", "Kotlin", "Jetpack Compose", "Dart", "Python", "JavaScript",
      "HTML", "CSS", "React", "MySQL", "Git", "Linux", "Cisco Packet Tracer",
      "Arduino", "Raspberry Pi", "LoRa", "IoT", "Flutter", "Firebase",
    ],
    href: "/projects/marine-communication-network",
  },
  {
    slug: "sandingan-national-high-school",
    title: "CSS-ICT",
    org: "Sandingan National High School, Loon, Bohol",
    startDate: "2018",
    endDate: "2020",
    description: "Senior high school under the ICT track, Computer Systems Servicing (CSS) strand. Assembled and disassembled PCs and their parts, and set up computer networks.",
    tags: ["education", "hardware"],
    // The Computer Systems Servicing NC II strand: install and configure
    // computers, set up networks and servers; plus HTML and CSS.
    tech: ["Windows", "Windows Server", "Cisco Packet Tracer", "HTML", "CSS"],
  },
];

/** A role still held: it has no end date. */
export const isCurrent = (entry: TimelineEntry) => !entry.endDate;

/** The role held now, if any. The hero, contact card and descriptions read it. */
export const currentRole = timeline.find(isCurrent);

/** "2024 – Current", "2020 – 2024". */
export const yearsLabel = (entry: TimelineEntry) =>
  `${entry.startDate} – ${entry.endDate ?? "Current"}`;
