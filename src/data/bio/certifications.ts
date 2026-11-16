/**
 * Certifications, shown on /bio, in the home hero and in search, in this
 * order everywhere. Each is `Listed` (src/data/model.ts): `image` is the
 * issuer's badge, and `tech` is what the exam covers.
 */
import type { Listed } from "../model";

export interface Certification extends Listed {
  /** A short name for tight spots, such as the home page. */
  shortTitle: string;
  issuer: string;
  issuedDate?: string;
  /** The issuer's public record; "Verify credential" opens it. */
  credentialUrl: string;
  image: string;
}

export const certifications: Certification[] = [
  {
    slug: "finops-certified-practitioner",
    image: "/images/badges/finops-foundation.png",
    title: "FinOps Certified Practitioner",
    shortTitle: "FinOps Practitioner",
    issuer: "FinOps Foundation",
    credentialUrl: "https://verify.skilljar.com/c/rv4ja8e75rpz",
    description:
      "Practitioner-level certification covering the principles, personas, and lifecycle of FinOps, bringing engineering, finance, and product together to drive accountable cloud spend and business value.",
    tags: [],
    tech: ["FinOps", "FOCUS"],
  },
  {
    slug: "google-associate-cloud-engineer",
    image: "/images/badges/google-associate-cloud-engineer.png",
    title: "Google Associate Cloud Engineer",
    shortTitle: "Google Cloud Engineer",
    issuer: "Google Cloud",
    credentialUrl: "https://www.credly.com/badges/5b8c7b0c-3f73-4e4f-997d-2db33c08977c/public_url",
    description:
      "Associate-level certification validating the ability to deploy applications, monitor operations, and manage enterprise solutions on Google Cloud Platform.",
    tags: [],
    tech: [
      "Google Cloud",
      "Compute Engine", "Google Kubernetes Engine", "App Engine", "Cloud Run", "Cloud Functions",
      "Cloud Storage", "Cloud SQL", "Spanner", "Bigtable", "BigQuery", "Pub/Sub",
      "Google Cloud IAM", "Google Cloud VPC", "Cloud Load Balancing", "Cloud Monitoring", "Cloud Logging",
    ],
  },
  {
    slug: "aws-solutions-architect-associate",
    image: "/images/badges/aws-solutions-architect-associate.png",
    title: "AWS Certified Solutions Architect - Associate",
    shortTitle: "AWS Solutions Architect",
    issuer: "Amazon Web Services",
    credentialUrl: "https://www.credly.com/badges/0bda64cd-5be1-4411-b8fc-096555c39d50/public_url",
    description:
      "Associate-level certification validating the ability to design secure, resilient, high-performing, and cost-optimized architectures on AWS.",
    tags: [],
    tech: [
      "AWS", "AWS Well-Architected",
      "Amazon EC2", "AWS Lambda", "Elastic Load Balancing", "Amazon API Gateway",
      "Amazon S3", "Amazon RDS", "Amazon Aurora", "Amazon DynamoDB",
      "Amazon VPC", "Amazon CloudFront", "Amazon Route 53",
      "AWS IAM", "AWS KMS", "Amazon SQS", "Amazon SNS", "Amazon CloudWatch", "AWS CloudFormation",
    ],
  },
];
