/**
 * Experience & education timeline, shown on /bio and indexed by search.json.
 *
 * `href` points search.json at the project or blog post an entry produced;
 * entries with no such artifact (e.g. high school) are left unlinked.
 */
import { BriefcaseIcon, GraduationCapIcon } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

export type TimelineEntry = {
  title: string;
  org: string;
  start: string;
  end: string;
  body: string;
  tech?: string[];
  Icon: Icon;
  href?: string;
};

export const timeline: TimelineEntry[] = [
  {
    title: "Software Engineer",
    org: "Alphaus Inc",
    start: "2024",
    end: "current",
    body: "Focused on the Ripple product, leading the shift to a micro-frontend architecture to modernize its capabilities. Handled full-stack development across UI updates, backend services, and CI/CD pipelines. Managed the testing and delivery workflows to ensure stable, low-risk production releases.",
    tech: ["React", "TypeScript", "Module Federation", "Nx", "Zustand"],
    Icon: BriefcaseIcon,
    href: "/blogs/micro-frontends-experience-ripplev2",
  },
  {
    title: "BS Computer Engineering",
    org: "Bohol Island State University",
    start: "2020",
    end: "2024",
    body: "Undergraduate degree in Computer Engineering. Thesis work built a marine communication network for monitoring small fishing boats.",
    tech: ["Arduino", "LoRa", "IoT", "Flutter", "Firebase", "Raspberry Pi"],
    Icon: GraduationCapIcon,
    href: "/projects/marine-communication-network",
  },
  {
    title: "CSS-ICT",
    org: "Sandingan National High School, Loon, Bohol",
    start: "2018",
    end: "2020",
    body: "Senior high school under the ICT track, Computer Systems Servicing (CSS) strand.",
    Icon: GraduationCapIcon,
  },
];
