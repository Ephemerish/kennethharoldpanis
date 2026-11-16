# Where the downloaded images came from

Each official logo or badge, its source, and what was changed. Logos are the
owners' marks, used to name the tool, school, employer or credential. Kept
with the images so a replacement starts from the same place. `pnpm
check:assets` checks that every technology logo is visible in both themes.

## Certification badges (`badges/`)

| File | Source | Changes |
| ---- | ------ | ------- |
| `aws-solutions-architect-associate.png` | Credly badge image (images.credly.com), AWS Certified Solutions Architect - Associate | Resized to 320px |
| `google-associate-cloud-engineer.png` | Credly badge image (images.credly.com), Google Cloud Certified Associate Cloud Engineer | Resized to 320px |
| `finops-foundation.png` | The FinOps Foundation logo (finops.org) | Cropped to the cube mark |

## Organisations (`orgs/`)

| File | Source | Changes |
| ---- | ------ | ------- |
| `alphaus.svg` | Alphaus logo (alphaus.cloud) | `viewBox` cropped to the mark |
| `bohol-island-state-university.png` | BISU seal (bisu.edu.ph) | None |

Sandingan National High School has no published logo; its role shows an icon.

## Technology logos made for the dark theme (`tech-logos/`)

| File | Source | Changes |
| ---- | ------ | ------- |
| `nx-dark.svg`, `shadcn-ui-dark.svg`, `drizzle-orm-dark.svg` | Simple Icons (simpleicons.org) | Filled white |
| `aws-dark.svg` | `aws.svg` | The dark wordmark (`#252F3E`) made white |
| `better-auth-dark.svg` | `better-auth.svg` | Black and white swapped |
| `lora-dark.png` | `lora.png` | Dark pixels lightened |
| `finops.png` | The FinOps Foundation logo (finops.org) | Cropped to the cube mark |
| `paraglide.png`, `zustand.png` | The earlier JPEGs of the same logos | White background made transparent |

## Technology logos added November 16, 2026 (`tech-logos/`)

| Files | Source | Changes |
| ----- | ------ | ------- |
| `amazon-*.svg`, `aws-iam.svg`, `aws-kms.svg`, `aws-lambda.svg`, `aws-cloudformation.svg`, `elastic-load-balancing.svg`, `amazon-dynamodb.svg`, `playwright.svg`, `grpc.svg`, `nginx.svg`, `vue.svg`, `tanstack-query.svg`, `c.svg`, `cpp.svg`, `linux.svg`, `windows.svg` | The svgporn logos set, via `@iconify-json/logos` 1.2.4 | Wrapped as standalone SVG files |
| `aws-well-architected.svg` | AWS Architecture Icons, via the `aws-icons` 3.3.0 package | None |
| `compute-engine.svg`, `google-kubernetes-engine.svg`, `app-engine.svg`, `cloud-*.svg`, `spanner.svg`, `bigtable.svg`, `bigquery.svg`, `pub-sub.svg`, `google-cloud-iam.svg`, `google-cloud-vpc.svg` | Google Cloud's official product icons (cloud.google.com/icons) | Renamed |
| `i18next.svg`, `radix-ui.svg`, `radix-ui-dark.svg`, `cisco-packet-tracer.svg` | Simple Icons 13.21.0 | Filled with the brand colour; Radix's dark variant white; Packet Tracer uses Cisco's mark |
| `single-spa.svg` | single-spa.js.org | None |
| `focus.svg` | focus.finops.org | Cropped to the mark, wordmark removed |

`dynamodb.svg`, `playwright.svg` and `zustand.svg` were empty files; the first two were replaced and `zustand.svg` removed (Zustand uses `zustand.png`).
