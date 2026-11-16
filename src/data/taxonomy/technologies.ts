/**
 * Technologies: every tool named on the site (docs/systems/content-registries.md).
 *
 * Projects, posts, experience and certifications name tech from this list:
 * content through the schema, the data files through the `TechName` type, so
 * a typo fails the check. scripts/check-taxonomy.mjs fails the build on a
 * technology nothing uses. Every one gets a /tech page and a home-page tile.
 */

export interface Technology {
  name: string;
  imagePath?: string;
  /**
   * The logo for dark mode, when the main one is dark ink that would vanish on
   * a dark tile. scripts/check-assets.mjs measures every logo on both themes
   * and fails when one can't be seen.
   */
  imagePathDark?: string;
  url?: string;
}


export const technologies = [
  // Frontend Technologies
  {
    name: 'TypeScript',
    imagePath: '/images/tech-logos/typescript.svg',
    url: 'https://www.typescriptlang.org/'
  },
  {
    name: 'React',
    imagePath: '/images/tech-logos/react.svg',
    url: 'https://react.dev/'
  },
  {
    name: 'Astro',
    imagePath: '/images/tech-logos/astro.svg',
    url: 'https://astro.build/'
  },
  {
    name: 'Tailwind CSS',
    imagePath: '/images/tech-logos/tailwindcss.svg',
    url: 'https://tailwindcss.com/'
  },
  {
    name: 'Vite',
    imagePath: '/images/tech-logos/vite.svg',
    url: 'https://vitejs.dev/'
  },
  {
    name: 'Module Federation',
    imagePath: '/images/tech-logos/module-federation.png',
    url: 'https://webpack.js.org/concepts/module-federation/'
  },
  {
    name: 'Zustand',
    imagePath: '/images/tech-logos/zustand.png',
    url: 'https://zustand-demo.pmnd.rs/'
  },
  
  // Backend Technologies
  {
    name: 'Node.js',
    imagePath: '/images/tech-logos/nodejs.svg',
    url: 'https://nodejs.org/'
  },

  // Databases
  {
    name: 'Firebase',
    imagePath: '/images/tech-logos/firebase.svg',
    url: 'https://firebase.google.com/'
  },

  // DevOps & Tools
  {
    name: 'Docker',
    imagePath: '/images/tech-logos/docker.svg',
    url: 'https://www.docker.com/'
  },
  {
    name: 'CircleCI',
    imagePath: '/images/tech-logos/circleci.svg',
    url: 'https://circleci.com/'
  },
  {
    name: 'Cypress',
    imagePath: '/images/tech-logos/cypress.svg',
    url: 'https://www.cypress.io/'
  },
  {
    name: 'ESLint',
    imagePath: '/images/tech-logos/eslint.svg',
    url: 'https://eslint.org/'
  },
  {
    name: 'Prettier',
    imagePath: '/images/tech-logos/prettier.svg',
    url: 'https://prettier.io/'
  },
  {
    name: 'pnpm',
    imagePath: '/images/tech-logos/pnpm.svg',
    url: 'https://pnpm.io/'
  },

  // Cloud Platforms
  {
    name: 'Cloud Run',
    imagePath: '/images/tech-logos/cloud-run.png',
    url: 'https://cloud.google.com/run'
  },

  // Mobile Development
  {
    name: 'Flutter',
    imagePath: '/images/tech-logos/flutter.svg',
    url: 'https://flutter.dev/'
  },

  // IoT & Hardware
  {
    name: 'Raspberry Pi',
    imagePath: '/images/tech-logos/raspberry-pi.svg',
    url: 'https://www.raspberrypi.org/'
  },
  {
    name: 'Arduino',
    imagePath: '/images/tech-logos/arduino.svg',
    url: 'https://www.arduino.cc/'
  },
  {
    name: 'IoT',
    imagePath: '/images/tech-logos/iot.png',
    url: 'https://en.wikipedia.org/wiki/Internet_of_things'
  },
  {
    name: 'LoRa',
    imagePath: '/images/tech-logos/lora.png',
    imagePathDark: '/images/tech-logos/lora-dark.png',
    url: 'https://lora-alliance.org/'
  },
  // Pundo stack
  {
    name: 'Svelte 5',
    imagePath: '/images/tech-logos/svelte.svg',
    url: 'https://svelte.dev/'
  },
  {
    name: 'Drizzle ORM',
    imagePath: '/images/tech-logos/drizzle-orm.svg',
    imagePathDark: '/images/tech-logos/drizzle-orm-dark.svg',
    url: 'https://orm.drizzle.team/'
  },
  {
    name: 'Neon',
    imagePath: '/images/tech-logos/neon.svg',
    url: 'https://neon.tech/'
  },
  {
    name: 'PostgreSQL',
    imagePath: '/images/tech-logos/postgresql.svg',
    url: 'https://www.postgresql.org/'
  },
  {
    name: 'better-auth',
    imagePath: '/images/tech-logos/better-auth.svg',
    imagePathDark: '/images/tech-logos/better-auth-dark.svg',
    url: 'https://www.better-auth.com/'
  },
  {
    name: 'Paraglide',
    imagePath: '/images/tech-logos/paraglide.png',
    url: 'https://inlang.com/m/gerre34r/library-inlang-paraglideJs'
  },
  {
    name: 'shadcn',
    imagePath: '/images/tech-logos/shadcn-ui.svg',
    imagePathDark: '/images/tech-logos/shadcn-ui-dark.svg',
    url: 'https://ui.shadcn.com/'
  },
  {
    name: 'Lottie',
    imagePath: '/images/tech-logos/lottie.svg',
    url: 'https://lottiefiles.com/'
  },

  // Tooling / automation
  {
    name: 'n8n',
    imagePath: '/images/tech-logos/n8n.svg',
    url: 'https://n8n.io/'
  },
  {
    name: 'Nx',
    imagePath: '/images/tech-logos/nx.svg',
    imagePathDark: '/images/tech-logos/nx-dark.svg',
    url: 'https://nx.dev/'
  },
  {
    name: 'pretext.js',
    imagePath: '/images/tech-logos/pretext-js.png',
    url: 'https://pretextjs.dev/'
  },
  {
    name: 'AWS',
    imagePath: '/images/tech-logos/aws.svg',
    imagePathDark: '/images/tech-logos/aws-dark.svg',
    url: 'https://aws.amazon.com/'
  },
  {
    name: 'FinOps',
    imagePath: '/images/tech-logos/finops.png',
    url: 'https://www.finops.org/'
  },
  {
    name: 'Google Cloud',
    imagePath: '/images/tech-logos/gcp.svg',
    url: 'https://cloud.google.com/'
  },

  // Web basics, from school
  { name: 'HTML', imagePath: '/images/tech-logos/html5.svg', url: 'https://developer.mozilla.org/docs/Web/HTML' },
  { name: 'CSS', imagePath: '/images/tech-logos/css3.svg', url: 'https://developer.mozilla.org/docs/Web/CSS' },
  { name: 'JavaScript', imagePath: '/images/tech-logos/javascript.svg', url: 'https://developer.mozilla.org/docs/Web/JavaScript' },

  // Alphaus: the micro-frontends, the services behind them, and how they ship
  { name: 'Vue', imagePath: '/images/tech-logos/vue.svg', url: 'https://vuejs.org/' },
  { name: 'single-spa', imagePath: '/images/tech-logos/single-spa.svg', url: 'https://single-spa.js.org/' },
  { name: 'TanStack Query', imagePath: '/images/tech-logos/tanstack-query.svg', url: 'https://tanstack.com/query' },
  { name: 'Radix UI', imagePath: '/images/tech-logos/radix-ui.svg', imagePathDark: '/images/tech-logos/radix-ui-dark.svg', url: 'https://www.radix-ui.com/' },
  { name: 'i18next', imagePath: '/images/tech-logos/i18next.svg', url: 'https://www.i18next.com/' },
  { name: 'Go', imagePath: '/images/tech-logos/go.svg', url: 'https://go.dev/' },
  { name: 'gRPC', imagePath: '/images/tech-logos/grpc.svg', url: 'https://grpc.io/' },
  { name: 'Redis', imagePath: '/images/tech-logos/redis.svg', url: 'https://redis.io/' },
  { name: 'Vitest', imagePath: '/images/tech-logos/vitest.svg', url: 'https://vitest.dev/' },
  { name: 'Jest', imagePath: '/images/tech-logos/jest.svg', url: 'https://jestjs.io/' },
  { name: 'Playwright', imagePath: '/images/tech-logos/playwright.svg', url: 'https://playwright.dev/' },
  { name: 'Kubernetes', imagePath: '/images/tech-logos/kubernetes.svg', url: 'https://kubernetes.io/' },
  { name: 'nginx', imagePath: '/images/tech-logos/nginx.svg', url: 'https://nginx.org/' },
  { name: 'FOCUS', imagePath: '/images/tech-logos/focus.svg', url: 'https://focus.finops.org/' },

  // AWS services: the Solutions Architect exam, and DynamoDB at Alphaus
  { name: 'Amazon EC2', imagePath: '/images/tech-logos/amazon-ec2.svg', url: 'https://aws.amazon.com/ec2/' },
  { name: 'Amazon S3', imagePath: '/images/tech-logos/amazon-s3.svg', url: 'https://aws.amazon.com/s3/' },
  { name: 'Amazon VPC', imagePath: '/images/tech-logos/amazon-vpc.svg', url: 'https://aws.amazon.com/vpc/' },
  { name: 'AWS IAM', imagePath: '/images/tech-logos/aws-iam.svg', url: 'https://aws.amazon.com/iam/' },
  { name: 'Elastic Load Balancing', imagePath: '/images/tech-logos/elastic-load-balancing.svg', url: 'https://aws.amazon.com/elasticloadbalancing/' },
  { name: 'Amazon CloudFront', imagePath: '/images/tech-logos/amazon-cloudfront.svg', url: 'https://aws.amazon.com/cloudfront/' },
  { name: 'Amazon Route 53', imagePath: '/images/tech-logos/amazon-route-53.svg', url: 'https://aws.amazon.com/route53/' },
  { name: 'AWS Lambda', imagePath: '/images/tech-logos/aws-lambda.svg', url: 'https://aws.amazon.com/lambda/' },
  { name: 'Amazon API Gateway', imagePath: '/images/tech-logos/amazon-api-gateway.svg', url: 'https://aws.amazon.com/api-gateway/' },
  { name: 'Amazon RDS', imagePath: '/images/tech-logos/amazon-rds.svg', url: 'https://aws.amazon.com/rds/' },
  { name: 'Amazon Aurora', imagePath: '/images/tech-logos/amazon-aurora.svg', url: 'https://aws.amazon.com/rds/aurora/' },
  { name: 'Amazon DynamoDB', imagePath: '/images/tech-logos/amazon-dynamodb.svg', url: 'https://aws.amazon.com/dynamodb/' },
  { name: 'Amazon SQS', imagePath: '/images/tech-logos/amazon-sqs.svg', url: 'https://aws.amazon.com/sqs/' },
  { name: 'Amazon SNS', imagePath: '/images/tech-logos/amazon-sns.svg', url: 'https://aws.amazon.com/sns/' },
  { name: 'Amazon CloudWatch', imagePath: '/images/tech-logos/amazon-cloudwatch.svg', url: 'https://aws.amazon.com/cloudwatch/' },
  { name: 'AWS KMS', imagePath: '/images/tech-logos/aws-kms.svg', url: 'https://aws.amazon.com/kms/' },
  { name: 'AWS CloudFormation', imagePath: '/images/tech-logos/aws-cloudformation.svg', url: 'https://aws.amazon.com/cloudformation/' },

  // Google Cloud services: the Associate Cloud Engineer exam, and Spanner and GKE at Alphaus
  { name: 'Compute Engine', imagePath: '/images/tech-logos/compute-engine.svg', url: 'https://cloud.google.com/products/compute' },
  { name: 'Google Kubernetes Engine', imagePath: '/images/tech-logos/google-kubernetes-engine.svg', url: 'https://cloud.google.com/kubernetes-engine' },
  { name: 'App Engine', imagePath: '/images/tech-logos/app-engine.svg', url: 'https://cloud.google.com/appengine' },
  { name: 'Cloud Functions', imagePath: '/images/tech-logos/cloud-functions.svg', url: 'https://cloud.google.com/functions' },
  { name: 'Cloud Storage', imagePath: '/images/tech-logos/cloud-storage.svg', url: 'https://cloud.google.com/storage' },
  { name: 'Cloud SQL', imagePath: '/images/tech-logos/cloud-sql.svg', url: 'https://cloud.google.com/sql' },
  { name: 'Spanner', imagePath: '/images/tech-logos/spanner.svg', url: 'https://cloud.google.com/spanner' },
  { name: 'Bigtable', imagePath: '/images/tech-logos/bigtable.svg', url: 'https://cloud.google.com/bigtable' },
  { name: 'BigQuery', imagePath: '/images/tech-logos/bigquery.svg', url: 'https://cloud.google.com/bigquery' },
  { name: 'Pub/Sub', imagePath: '/images/tech-logos/pub-sub.svg', url: 'https://cloud.google.com/pubsub' },
  { name: 'Google Cloud IAM', imagePath: '/images/tech-logos/google-cloud-iam.svg', url: 'https://cloud.google.com/iam' },
  { name: 'Google Cloud VPC', imagePath: '/images/tech-logos/google-cloud-vpc.svg', url: 'https://cloud.google.com/vpc' },
  { name: 'Cloud Load Balancing', imagePath: '/images/tech-logos/cloud-load-balancing.svg', url: 'https://cloud.google.com/load-balancing' },
  { name: 'Cloud Monitoring', imagePath: '/images/tech-logos/cloud-monitoring.svg', url: 'https://cloud.google.com/monitoring' },
  { name: 'Cloud Logging', imagePath: '/images/tech-logos/cloud-logging.svg', url: 'https://cloud.google.com/logging' },

  // School: Computer Systems Servicing (senior high) and Computer Engineering (college)
  { name: 'C', imagePath: '/images/tech-logos/c.svg', url: 'https://en.cppreference.com/w/c' },
  { name: 'C++', imagePath: '/images/tech-logos/cpp.svg', url: 'https://isocpp.org/' },
  { name: 'Java', imagePath: '/images/tech-logos/java.svg', url: 'https://dev.java/' },
  { name: 'Python', imagePath: '/images/tech-logos/python.svg', url: 'https://www.python.org/' },
  { name: 'MySQL', imagePath: '/images/tech-logos/mysql.svg', url: 'https://www.mysql.com/' },
  { name: 'Git', imagePath: '/images/tech-logos/git.svg', url: 'https://git-scm.com/' },
  { name: 'Cisco Packet Tracer', imagePath: '/images/tech-logos/cisco-packet-tracer.svg', url: 'https://www.netacad.com/cisco-packet-tracer' },
  { name: 'Windows', imagePath: '/images/tech-logos/windows.svg', url: 'https://www.microsoft.com/windows' },
  { name: 'Windows Server', imagePath: '/images/tech-logos/windows.svg', url: 'https://www.microsoft.com/windows-server' },
  { name: 'Linux', imagePath: '/images/tech-logos/linux.svg', url: 'https://www.kernel.org/' },

  // Alphaus: the first work there priced Azure
  { name: 'Azure', imagePath: '/images/tech-logos/azure.svg', url: 'https://azure.microsoft.com/' },
  { name: 'AWS Well-Architected', imagePath: '/images/tech-logos/aws-well-architected.svg', url: 'https://aws.amazon.com/architecture/well-architected/' },
] as const satisfies readonly Technology[];

/** A registered technology's exact name. */
export type TechName = (typeof technologies)[number]['name'];

/** Stable URL slug for a tech name: "Tailwind CSS" becomes "tailwind-css". */
export const techSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const byName = new Map<string, Technology>(technologies.map((tech) => [tech.name.toLowerCase(), tech]));
const bySlug = new Map<string, Technology>(technologies.map((tech) => [techSlug(tech.name), tech]));

/** A technology by name, ignoring case (content may write "react"). */
export const getTechByName = (name: string): Technology | undefined => byName.get(name.toLowerCase());

export const getTechBySlug = (slug: string): Technology | undefined => bySlug.get(slug);

export const getAllTechNames = (): string[] => technologies.map((tech) => tech.name);
