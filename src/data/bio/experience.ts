/**
 * Experience and education timeline, shown on /bio, listed on the tag and
 * tech pages it names, and indexed by search.json.
 *
 * `slug` is the card's anchor on /bio. `href` points at the project or post
 * an entry produced; entries with no such artifact (high school) have none.
 * `tags` and `tech` come from the registries; a typo fails the type check.
 */
import { BriefcaseIcon, GraduationCapIcon } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { TagSlug } from "../taxonomy/tags";
import type { TechName } from "../taxonomy/technologies";

export type TimelineEntry = {
  slug: string;
  title: string;
  org: string;
  start: string;
  end: string;
  body: string;
  tags: TagSlug[];
  tech?: TechName[];
  Icon: Icon;
  /** The organisation's logo, under public/ (checked by check-assets.mjs). */
  logo?: string;
  /** The project or post this role produced: its tech counts as tech used here. */
  href?: string;
};

export const timeline: TimelineEntry[] = [
  {
    slug: "alphaus",
    logo: "/images/orgs/alphaus.svg",
    title: "Software Engineer",
    org: "Alphaus Inc",
    start: "2024",
    end: "current",
    body: "Focused on the Ripple product, leading the shift to a micro-frontend architecture to modernize its capabilities. Handled full-stack development across UI updates, backend services, and CI/CD pipelines. Managed the testing and delivery workflows to ensure stable, low-risk production releases.",
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
    Icon: BriefcaseIcon,
    href: "/blogs/micro-frontends-experience-ripplev2",
  },
  {
    slug: "bohol-island-state-university",
    logo: "/images/orgs/bohol-island-state-university.png",
    title: "BS Computer Engineering",
    org: "Bohol Island State University",
    start: "2020",
    end: "2024",
    body: "Undergraduate degree in Computer Engineering. Thesis work built a marine communication network for monitoring small fishing boats.",
    tags: ["education", "thesis", "hardware"],
    // The BS Computer Engineering curriculum (programming, data structures,
    // databases, networks, operating systems, embedded systems), the web
    // development he did in class, and the thesis hardware.
    tech: [
      "C", "C++", "Java", "Python", "JavaScript",
      "HTML", "CSS", "React", "MySQL", "Git", "Linux", "Cisco Packet Tracer",
      "Arduino", "Raspberry Pi", "LoRa", "IoT", "Flutter", "Firebase",
    ],
    Icon: GraduationCapIcon,
    href: "/projects/marine-communication-network",
  },
  {
    slug: "sandingan-national-high-school",
    title: "CSS-ICT",
    org: "Sandingan National High School, Loon, Bohol",
    start: "2018",
    end: "2020",
    body: "Senior high school under the ICT track, Computer Systems Servicing (CSS) strand.",
    tags: ["education", "hardware"],
    // The Computer Systems Servicing NC II strand: install and configure
    // computers, set up networks and servers; plus HTML and CSS.
    tech: ["Windows", "Windows Server", "Cisco Packet Tracer", "HTML", "CSS"],
    Icon: GraduationCapIcon,
  },
];

/** A role still held: its `end` reads "current". */
export const isCurrent = (entry: TimelineEntry) => entry.end.toLowerCase() === "current";

/** The role held now, if any. The hero, contact card and descriptions read it. */
export const currentRole = timeline.find(isCurrent);

/** "2024 – Current", "2020 – 2024". */
export const yearsLabel = (entry: TimelineEntry) =>
  `${entry.start} – ${isCurrent(entry) ? "Current" : entry.end}`;
