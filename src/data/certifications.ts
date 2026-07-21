/**
 * Certifications, shown on /bio and indexed by search.json.
 *
 * `credentialUrl` is the public verification link (Skilljar/Credly); each
 * card links out to it, so it's required for a cert to be clickable/indexed.
 */
import { ChartLineUpIcon, CloudIcon } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

export type Certification = {
  title: string;
  issuer: string;
  issuedDate?: string;
  credentialUrl?: string;
  badge?: string;
  summary: string;
  focusAreas: string[];
  tech?: string[];
  Icon: Icon;
  accent: "brand" | "dark";
  chipVariant: "brand" | "neutral";
  highlighted?: boolean;
};

export const certifications: Certification[] = [
  {
    title: "FinOps Certified Practitioner",
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
    Icon: ChartLineUpIcon,
    accent: "brand",
    chipVariant: "brand",
    highlighted: true,
  },
  {
    title: "Google Associate Cloud Engineer",
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
    tech: ["Cloud Run"],
    Icon: CloudIcon,
    accent: "dark",
    chipVariant: "neutral",
  },
];
