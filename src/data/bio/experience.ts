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
    tech: ["React", "TypeScript", "Module Federation", "Nx", "Zustand", "FinOps"],
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
    tech: ["Arduino", "LoRa", "IoT", "Flutter", "Firebase", "Raspberry Pi"],
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
