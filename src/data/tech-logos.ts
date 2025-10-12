/**
 * Tech Logo Configuration
 * 
 * Add your technology logos here. Place the logo files in:
 * public/images/tech-logos/
 * 
 * Then add entries below following the pattern.
 */

export interface TechLogo {
  name: string;
  imagePath: string;
  category?: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'cloud' | 'mobile' | 'other';
  url?: string; // Optional link to technology website
}

export const techLogos: TechLogo[] = [
  // Frontend Technologies
  {
    name: 'React',
    imagePath: '/images/tech-logos/react.svg',
    category: 'frontend',
    url: 'https://react.dev/'
  },
  {
    name: 'TypeScript',
    imagePath: '/images/tech-logos/typescript.svg',
    category: 'frontend',
    url: 'https://www.typescriptlang.org/'
  },
  {
    name: 'JavaScript',
    imagePath: '/images/tech-logos/javascript.svg',
    category: 'frontend',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
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
    name: 'HTML5',
    imagePath: '/images/tech-logos/html5.svg',
    category: 'frontend',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
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
  // {
  //   name: 'Micro Frontends',
  //   imagePath: '/images/tech-logos/microfrontend.svg',
  //   category: 'frontend',
  //   url: 'https://micro-frontends.org/'
  // },
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
    name: 'Spanner',
    imagePath: '/images/tech-logos/spanner.png',
    category: 'database',
    url: 'https://cloud.google.com/spanner'
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
    name: 'Kubernetes',
    imagePath: '/images/tech-logos/kubernetes.svg',
    category: 'devops',
    url: 'https://kubernetes.io/'
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
  
  // Add more technologies as needed...
  // Just follow the pattern above:
  // {
  //   name: 'Technology Name',
  //   imagePath: '/images/tech-logos/filename.svg',
  //   category: 'appropriate-category',
  //   url: 'https://technology-website.com/'
  // },
];

// Helper function to filter by category
export const getTechByCategory = (category: TechLogo['category']) => {
  return techLogos.filter(tech => tech.category === category);
};

// Helper function to get all categories
export const getAllCategories = () => {
  return Array.from(new Set(techLogos.map(tech => tech.category).filter(Boolean)));
};
