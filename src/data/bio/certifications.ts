/**
 * Certifications, shown on /bio and indexed by search.json.
 *
 * `credentialUrl` is the public verification link (Skilljar/Credly); the
 * card's "Verify credential" opens it.
 */
import { ChartLineUpIcon, CloudIcon } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { TagSlug } from "./tags";
import type { TechName } from "./technologies";

export type Certification = {
  /** The card's anchor on /bio. */
  slug: string;
  title: string;
  /** A short name for tight spots, such as the home page. */
  shortTitle: string;
  issuer: string;
  issuedDate?: string;
  credentialUrl?: string;
  badge?: string;
  summary: string;
  focusAreas: string[];
  /** From the registries; a typo fails the type check. */
  tags: TagSlug[];
  tech?: TechName[];
  Icon: Icon;
  accent: "brand" | "dark";
  chipVariant: "brand" | "neutral";
  highlighted?: boolean;
  /** Set for certs that aren't earned yet, e.g. { label: "In progress", variant: "warning", Icon: HourglassIcon }. */
  status?: { label: string; variant: "warning" | "success"; Icon: Icon };
};

export const certifications: Certification[] = [
  {
    slug: "finops-certified-practitioner",
    title: "FinOps Certified Practitioner",
    shortTitle: "FinOps Practitioner",
    issuer: "FinOps Foundation",
    credentialUrl: "https://verify.skilljar.com/c/rv4ja8e75rpz",
    summary:
      "Practitioner-level certification covering the principles, personas, and lifecycle of FinOps, bringing engineering, finance, and product together to drive accountable cloud spend and business value.",
    focusAreas: [
      "FinOps Framework & Principles",
      "Cloud Cost Allocation & Showback",
      "Rate & Usage Optimization",
      "Forecasting & Budgeting",
      "Unit Economics",
    ],
    tags: ["finops", "cloud"],
    Icon: ChartLineUpIcon,
    accent: "brand",
    chipVariant: "brand",
  },
  {
    slug: "google-associate-cloud-engineer",
    title: "Google Associate Cloud Engineer",
    shortTitle: "Google Cloud Engineer",
    issuer: "Google Cloud",
    credentialUrl: "https://www.credly.com/badges/5b8c7b0c-3f73-4e4f-997d-2db33c08977c/public_url",
    summary:
      "Associate-level certification validating the ability to deploy applications, monitor operations, and manage enterprise solutions on Google Cloud Platform.",
    focusAreas: [
      "Compute Engine & GKE",
      "Cloud Storage & Databases",
      "IAM & Networking",
      "Monitoring & Logging",
      "Deployment & Operations",
    ],
    tags: ["cloud"],
    tech: ["Google Cloud", "Cloud Run"],
    Icon: CloudIcon,
    accent: "dark",
    chipVariant: "neutral",
    highlighted: true,
  },
  {
    slug: "aws-solutions-architect-associate",
    title: "AWS Certified Solutions Architect - Associate",
    shortTitle: "AWS Solutions Architect",
    issuer: "Amazon Web Services",
    credentialUrl: "https://www.credly.com/badges/0bda64cd-5be1-4411-b8fc-096555c39d50/public_url",
    summary:
      "Associate-level certification validating the ability to design secure, resilient, high-performing, and cost-optimized architectures on AWS.",
    focusAreas: ["EC2", "S3", "VPC", "Lambda", "RDS", "Well-Architected"],
    tags: ["cloud"],
    tech: ["AWS"],
    Icon: CloudIcon,
    accent: "dark",
    chipVariant: "neutral",
    highlighted: true,
  },
];
