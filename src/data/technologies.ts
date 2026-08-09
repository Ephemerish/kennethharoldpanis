/**
 * Technologies Data
 * 
 * Comprehensive list of all technologies used across projects.
 * This data is used for the tech carousel, project tags, and filtering.
 */

export interface Technology {
  name: string;
  imagePath?: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'cloud' | 'mobile' | 'other';
  url?: string;
}

export const technologies: Technology[] = [
  // Frontend Technologies
  {
    name: 'TypeScript',
    imagePath: '/images/tech-logos/typescript.svg',
    category: 'frontend',
    url: 'https://www.typescriptlang.org/'
  },
  {
    name: 'React',
    imagePath: '/images/tech-logos/react.svg',
    category: 'frontend',
    url: 'https://react.dev/'
  },
  {
    name: 'Astro',
    imagePath: '/images/tech-logos/astro.svg',
    category: 'frontend',
    url: 'https://astro.build/'
  },
  {
    name: 'Tailwind CSS',
    imagePath: '/images/tech-logos/tailwindcss.svg',
    category: 'frontend',
    url: 'https://tailwindcss.com/'
  },
  {
    name: 'Vite',
    imagePath: '/images/tech-logos/vite.svg',
    category: 'frontend',
    url: 'https://vitejs.dev/'
  },
  {
    name: 'Module Federation',
    imagePath: '/images/tech-logos/module-federation.png',
    category: 'frontend',
    url: 'https://webpack.js.org/concepts/module-federation/'
  },
  {
    name: 'Zustand',
    imagePath: '/images/tech-logos/zustand.jpeg',
    category: 'frontend',
    url: 'https://zustand-demo.pmnd.rs/'
  },
  
  // Backend Technologies
  {
    name: 'Node.js',
    imagePath: '/images/tech-logos/nodejs.svg',
    category: 'backend',
    url: 'https://nodejs.org/'
  },

  // Databases
  {
    name: 'Firebase',
    imagePath: '/images/tech-logos/firebase.svg',
    category: 'database',
    url: 'https://firebase.google.com/'
  },

  // DevOps & Tools
  {
    name: 'Docker',
    imagePath: '/images/tech-logos/docker.svg',
    category: 'devops',
    url: 'https://www.docker.com/'
  },
  // {
  //   name: 'CircleCI',
  //   imagePath: '/images/tech-logos/circleci.svg',
  //   category: 'devops',
  //   url: 'https://circleci.com/'
  // },
  // {
  //   name: 'Cypress',
  //   imagePath: '/images/tech-logos/cypress.svg',
  //   category: 'tools',
  //   url: 'https://www.cypress.io/'
  // },
  {
    name: 'ESLint',
    imagePath: '/images/tech-logos/eslint.svg',
    category: 'tools',
    url: 'https://eslint.org/'
  },
  {
    name: 'Prettier',
    imagePath: '/images/tech-logos/prettier.svg',
    category: 'tools',
    url: 'https://prettier.io/'
  },
  {
    name: 'pnpm',
    imagePath: '/images/tech-logos/pnpm.svg',
    category: 'tools',
    url: 'https://pnpm.io/'
  },

  // Cloud Platforms
  {
    name: 'Cloud Run',
    imagePath: '/images/tech-logos/cloud-run.png',
    category: 'cloud',
    url: 'https://cloud.google.com/run'
  },

  // Mobile Development
  {
    name: 'Flutter',
    imagePath: '/images/tech-logos/flutter.svg',
    category: 'mobile',
    url: 'https://flutter.dev/'
  },

  // IoT & Hardware
  {
    name: 'Raspberry Pi',
    imagePath: '/images/tech-logos/raspberry-pi.svg',
    category: 'other',
    url: 'https://www.raspberrypi.org/'
  },
  {
    name: 'Arduino',
    imagePath: '/images/tech-logos/arduino.svg',
    category: 'other',
    url: 'https://www.arduino.cc/'
  },
  {
    name: 'IoT',
    imagePath: '/images/tech-logos/iot.png',
    category: 'other',
    url: 'https://en.wikipedia.org/wiki/Internet_of_things'
  },
  {
    name: 'LoRa',
    imagePath: '/images/tech-logos/lora.png',
    category: 'other',
    url: 'https://lora-alliance.org/'
  },
  // Pundo stack
  {
    name: 'Svelte 5',
    imagePath: '/images/tech-logos/svelte.svg',
    category: 'frontend',
    url: 'https://svelte.dev/'
  },
  {
    name: 'Drizzle ORM',
    imagePath: '/images/tech-logos/drizzle-orm.svg',
    category: 'backend',
    url: 'https://orm.drizzle.team/'
  },
  {
    name: 'Neon',
    imagePath: '/images/tech-logos/neon.svg',
    category: 'database',
    url: 'https://neon.tech/'
  },
  {
    name: 'PostgreSQL',
    imagePath: '/images/tech-logos/postgresql.svg',
    category: 'database',
    url: 'https://www.postgresql.org/'
  },
  {
    name: 'better-auth',
    imagePath: '/images/tech-logos/better-auth.svg',
    category: 'backend',
    url: 'https://www.better-auth.com/'
  },
  {
    name: 'Paraglide',
    imagePath: '/images/tech-logos/paraglide.jpg',
    category: 'tools',
    url: 'https://inlang.com/m/gerre34r/library-inlang-paraglideJs'
  },
  {
    name: 'shadcn',
    imagePath: '/images/tech-logos/shadcn-ui.svg',
    category: 'frontend',
    url: 'https://ui.shadcn.com/'
  },
  {
    name: 'Lottie',
    imagePath: '/images/tech-logos/lottie.svg',
    category: 'frontend',
    url: 'https://lottiefiles.com/'
  },

  // Tooling / automation
  {
    name: 'n8n',
    imagePath: '/images/tech-logos/n8n.svg',
    category: 'tools',
    url: 'https://n8n.io/'
  },
  {
    name: 'Nx',
    imagePath: '/images/tech-logos/nx.svg',
    category: 'tools',
    url: 'https://nx.dev/'
  },
  {
    name: 'pretext.js',
    imagePath: '/images/tech-logos/pretext-js.png',
    category: 'tools',
    url: 'https://pretextjs.dev/'
  },
];

// Stable URL slug for a tech name, e.g. "Tailwind CSS" -> "tailwind-css".
export const techSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Helper functions
export const getTechByCategory = (category: Technology['category']) => {
  return technologies.filter(tech => tech.category === category);
};

export const getTechByName = (name: string) => {
  return technologies.find(tech => tech.name.toLowerCase() === name.toLowerCase());
};

export const getTechBySlug = (slug: string) => {
  return technologies.find(tech => techSlug(tech.name) === slug);
};

export const getAllCategories = () => {
  return Array.from(new Set(technologies.map(tech => tech.category)));
};

export const getAllTechNames = () => {
  return technologies.map(tech => tech.name);
};

export const getAllTechSlugs = () => {
  return technologies.map(tech => techSlug(tech.name));
};
