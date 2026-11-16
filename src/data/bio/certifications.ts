/**
 * Certifications, shown on /bio, in the home hero and in search, in this
 * order everywhere.
 *
 * `credentialUrl` is the public verification link (Skilljar/Credly); the
 * card's "Verify credential" opens it. `badge` is the issuer's own image.
 */
import type { TagSlug } from "../taxonomy/tags";
import type { TechName } from "../taxonomy/technologies";

export type Certification = {
  /** The card's anchor on /bio. */
  slug: string;
  title: string;
  /** A short name for tight spots, such as the home page. */
  shortTitle: string;
  issuer: string;
  issuedDate?: string;
  credentialUrl: string;
  /** Under public/images/; scripts/check-assets.mjs fails when it's missing. */
  badge: string;
  summary: string;
  /** From the registries; a typo fails the type check. The tech the exam
   *  covers, so each one's page lists the certification. */
  tags?: TagSlug[];
  tech: TechName[];
};

export const certifications: Certification[] = [
  {
    slug: "finops-certified-practitioner",
    badge: "badges/finops-foundation.png",
    title: "FinOps Certified Practitioner",
    shortTitle: "FinOps Practitioner",
    issuer: "FinOps Foundation",
    credentialUrl: "https://verify.skilljar.com/c/rv4ja8e75rpz",
    summary:
      "Practitioner-level certification covering the principles, personas, and lifecycle of FinOps, bringing engineering, finance, and product together to drive accountable cloud spend and business value.",
    tech: ["FinOps", "FOCUS"],
  },
  {
    slug: "google-associate-cloud-engineer",
    badge: "badges/google-associate-cloud-engineer.png",
    title: "Google Associate Cloud Engineer",
    shortTitle: "Google Cloud Engineer",
    issuer: "Google Cloud",
    credentialUrl: "https://www.credly.com/badges/5b8c7b0c-3f73-4e4f-997d-2db33c08977c/public_url",
    summary:
      "Associate-level certification validating the ability to deploy applications, monitor operations, and manage enterprise solutions on Google Cloud Platform.",
    tech: [
      "Google Cloud",
      "Compute Engine", "Google Kubernetes Engine", "App Engine", "Cloud Run", "Cloud Functions",
      "Cloud Storage", "Cloud SQL", "Spanner", "Bigtable", "BigQuery", "Pub/Sub",
      "Google Cloud IAM", "Google Cloud VPC", "Cloud Load Balancing", "Cloud Monitoring", "Cloud Logging",
    ],
  },
  {
    slug: "aws-solutions-architect-associate",
    badge: "badges/aws-solutions-architect-associate.png",
    title: "AWS Certified Solutions Architect - Associate",
    shortTitle: "AWS Solutions Architect",
    issuer: "Amazon Web Services",
    credentialUrl: "https://www.credly.com/badges/0bda64cd-5be1-4411-b8fc-096555c39d50/public_url",
    summary:
      "Associate-level certification validating the ability to design secure, resilient, high-performing, and cost-optimized architectures on AWS.",
    tech: [
      "AWS", "AWS Well-Architected",
      "Amazon EC2", "AWS Lambda", "Elastic Load Balancing", "Amazon API Gateway",
      "Amazon S3", "Amazon RDS", "Amazon Aurora", "Amazon DynamoDB",
      "Amazon VPC", "Amazon CloudFront", "Amazon Route 53",
      "AWS IAM", "AWS KMS", "Amazon SQS", "Amazon SNS", "Amazon CloudWatch", "AWS CloudFormation",
    ],
  },
];
