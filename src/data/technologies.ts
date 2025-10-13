/**
 * Technologies Data
 * 
 * Comprehensive list of all technologies used across projects.
 * This data is used for the tech carousel, project tags, and filtering.
 */

export interface Technology {
  name: string;
  imagePath: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'cloud' | 'mobile' | 'other';
  url?: string;
}

export const technologies: Technology[] = [
  // Frontend Technologies
  {
    name: 'HTML5',
    imagePath: '/images/tech-logos/html5.svg',
    category: 'frontend',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
  },
  {
    name: 'CSS3',
    imagePath: '/images/tech-logos/css3.svg',
    category: 'frontend',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS'
  },
  {
    name: 'JavaScript',
    imagePath: '/images/tech-logos/javascript.svg',
    category: 'frontend',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
  },
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
    name: 'Webpack',
    imagePath: '/images/tech-logos/webpack.png',
    category: 'tools',
    url: 'https://webpack.js.org/'
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
  {
    name: 'Python',
    imagePath: '/images/tech-logos/python.svg',
    category: 'backend',
    url: 'https://www.python.org/'
  },
  {
    name: 'Go',
    imagePath: '/images/tech-logos/go.svg',
    category: 'backend',
    url: 'https://go.dev/'
  },
  {
    name: 'PHP',
    imagePath: '/images/tech-logos/php.svg',
    category: 'backend',
    url: 'https://www.php.net/'
  },
  
  // Databases
  {
    name: 'MySQL',
    imagePath: '/images/tech-logos/mysql.svg',
    category: 'database',
    url: 'https://www.mysql.com/'
  },
  {
    name: 'SQLite',
    imagePath: '/images/tech-logos/sqlite.svg',
    category: 'database',
    url: 'https://www.sqlite.org/'
  },
  {
    name: 'Firebase',
    imagePath: '/images/tech-logos/firebase.svg',
    category: 'database',
    url: 'https://firebase.google.com/'
  },
  {
    name: 'DynamoDB',
    imagePath: '/images/tech-logos/dynamoDB.webp',
    category: 'database',
    url: 'https://aws.amazon.com/dynamodb/'
  },
  {
    name: 'Spanner',
    imagePath: '/images/tech-logos/spanner.png',
    category: 'database',
    url: 'https://cloud.google.com/spanner'
  },
  {
    name: 'Azure SQL',
    imagePath: '/images/tech-logos/azure-databases.png',
    category: 'database',
    url: 'https://azure.microsoft.com/en-us/products/azure-sql/'
  },
  
  // DevOps & Tools
  {
    name: 'Docker',
    imagePath: '/images/tech-logos/docker.svg',
    category: 'devops',
    url: 'https://www.docker.com/'
  },
  {
    name: 'Kubernetes',
    imagePath: '/images/tech-logos/kubernetes.svg',
    category: 'devops',
    url: 'https://kubernetes.io/'
  },
  {
    name: 'Git',
    imagePath: '/images/tech-logos/git.svg',
    category: 'devops',
    url: 'https://git-scm.com/'
  },
  {
    name: 'GitHub',
    imagePath: '/images/tech-logos/github.svg',
    category: 'devops',
    url: 'https://github.com/'
  },
  {
    name: 'GitLab',
    imagePath: '/images/tech-logos/gitlab.svg',
    category: 'devops',
    url: 'https://gitlab.com/'
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
    name: 'npm',
    imagePath: '/images/tech-logos/npm.svg',
    category: 'tools',
    url: 'https://www.npmjs.com/'
  },
  {
    name: 'pnpm',
    imagePath: '/images/tech-logos/pnpm.svg',
    category: 'tools',
    url: 'https://pnpm.io/'
  },
  {
    name: 'Yarn',
    imagePath: '/images/tech-logos/yarn.svg',
    category: 'tools',
    url: 'https://yarnpkg.com/'
  },
  
  // Cloud Platforms
  {
    name: 'AWS',
    imagePath: '/images/tech-logos/aws.svg',
    category: 'cloud',
    url: 'https://aws.amazon.com/'
  },
  {
    name: 'Azure',
    imagePath: '/images/tech-logos/azure.svg',
    category: 'cloud',
    url: 'https://azure.microsoft.com/'
  },
  {
    name: 'Google Cloud Platform',
    imagePath: '/images/tech-logos/gcp.svg',
    category: 'cloud',
    url: 'https://cloud.google.com/'
  },
  {
    name: 'Cloud Run',
    imagePath: '/images/tech-logos/cloud-run.png',
    category: 'cloud',
    url: 'https://cloud.google.com/run'
  },
  {
    name: 'Vercel',
    imagePath: '/images/tech-logos/vercel.svg',
    category: 'cloud',
    url: 'https://vercel.com/'
  },
  
  // Mobile Development
  {
    name: 'Flutter',
    imagePath: '/images/tech-logos/flutter.svg',
    category: 'mobile',
    url: 'https://flutter.dev/'
  },
  {
    name: 'Kotlin',
    imagePath: '/images/tech-logos/kotlin.svg',
    category: 'mobile',
    url: 'https://kotlinlang.org/'
  },
  {
    name: 'Java',
    imagePath: '/images/tech-logos/java.svg',
    category: 'mobile',
    url: 'https://www.java.com/'
  },
  {
    name: 'Android',
    imagePath: '/images/tech-logos/android.svg',
    category: 'mobile',
    url: 'https://www.android.com/'
  },
  {
    name: 'Jetpack Compose',
    imagePath: '/images/tech-logos/jetpack-compose.png',
    category: 'mobile',
    url: 'https://developer.android.com/jetpack/compose'
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
];

// Helper functions
export const getTechByCategory = (category: Technology['category']) => {
  return technologies.filter(tech => tech.category === category);
};

export const getTechByName = (name: string) => {
  return technologies.find(tech => tech.name.toLowerCase() === name.toLowerCase());
};

export const getAllCategories = () => {
  return Array.from(new Set(technologies.map(tech => tech.category)));
};

export const getAllTechNames = () => {
  return technologies.map(tech => tech.name);
};
