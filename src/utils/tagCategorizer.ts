// Tag categorization utility
export interface TechCategory {
  title: string;
  icon: string;
  skills: string[];
}

// Define technology categories and their associated tags
const categoryMapping: Record<string, string[]> = {
  "Frontend Development": [
    "React", "TypeScript", "Next.js", "Astro", "Tailwind CSS", "Framer Motion", 
    "HTML", "CSS", "JavaScript", "Vue", "Angular", "Svelte", "frontend", "UI/UX"
  ],
  "Backend & Database": [
    "Node.js", "Python", "PostgreSQL", "MongoDB", "Redis", "Firebase", 
    "API", "Database", "Server", "Express", "FastAPI", "GraphQL", "REST",
    "Firebase Realtime Database"
  ],
  "Hardware & Embedded": [
    "Arduino", "Raspberry Pi", "Microcontrollers", "PCB Design", "IoT Systems", 
    "Circuit Analysis", "ESP32", "LoRa", "GPS", "Hardware", "IoT", 
    "Microcontroller", "Sensors", "Embedded", "ESP32 NodeMCU-32S", 
    "LoRa SX1278 433MHz", "GPS NEO-M8N", "GPS Tracking"
  ],
  "Mobile Development": [
    "Mobile App", "Flutter", "React Native", "iOS", "Android", "Cross-platform",
    "Flutter Mobile App"
  ],
  "Programming Languages": [
    "C/C++", "Python", "JavaScript", "TypeScript", "C", "C++", "Arduino",
    "C/C++ Arduino"
  ],
  "Architecture & Tools": [
    "micro-frontends", "architecture", "module-federation", "nx", "Git", "Linux", 
    "AWS", "Vercel", "Figma", "Jest", "Docker", "CI/CD", "DevOps"
  ],
  "Security & Communication": [
    "Encryption", "XOR Encryption", "Serial Communication", "Communication",
    "Networking", "Security", "Real-time"
  ],
  "Specialized Domains": [
    "Maritime Safety", "Emergency Response", "Thesis", "Research"
  ]
};

// Icons for each category
const categoryIcons: Record<string, string> = {
  "Frontend Development": "🎨",
  "Backend & Database": "🗄️",
  "Hardware & Embedded": "🔧",
  "Mobile Development": "📱",
  "Programming Languages": "💻",
  "Architecture & Tools": "🏗️",
  "Security & Communication": "🔒",
  "Specialized Domains": "🎯"
};

export function categorizeTags(allTags: string[]): TechCategory[] {
  const categories: TechCategory[] = [];
  
  // Create a set of unique tags
  const uniqueTags = Array.from(new Set(allTags.filter(tag => tag && tag.trim())));
  
  // For each category, find matching tags
  Object.entries(categoryMapping).forEach(([categoryName, categoryTags]) => {
    const matchingTags: string[] = [];
    
    // Check each tag from projects/blogs against category keywords
    uniqueTags.forEach(tag => {
      const normalizedTag = tag.toLowerCase().trim();
      
      // Check if any category keyword matches this tag
      categoryTags.forEach(categoryTag => {
        const normalizedCategoryTag = categoryTag.toLowerCase();
        
        // Exact match or partial match
        if (normalizedTag === normalizedCategoryTag || 
            normalizedTag.includes(normalizedCategoryTag) || 
            normalizedCategoryTag.includes(normalizedTag)) {
          
          if (!matchingTags.includes(tag)) {
            matchingTags.push(tag);
          }
        }
      });
    });
    
    // Add some common technologies if not already present
    if (categoryName === "Frontend Development") {
      const commonFrontend = ["React", "TypeScript", "Astro"];
      commonFrontend.forEach(tech => {
        if (!matchingTags.some(tag => tag.toLowerCase().includes(tech.toLowerCase()))) {
          matchingTags.push(tech);
        }
      });
    }
    
    if (categoryName === "Programming Languages") {
      const commonLangs = ["JavaScript", "Python"];
      commonLangs.forEach(lang => {
        if (!matchingTags.some(tag => tag.toLowerCase().includes(lang.toLowerCase()))) {
          matchingTags.push(lang);
        }
      });
    }
    
    // Only include categories that have matching tags
    if (matchingTags.length > 0) {
      categories.push({
        title: categoryName,
        icon: categoryIcons[categoryName] || "🔹",
        skills: matchingTags.sort()
      });
    }
  });
  
  return categories;
}

export function getAllTagsFromContent(
  projects: any[], 
  blogs: any[]
): string[] {
  const allTags: string[] = [];
  
  // Extract tags from projects
  projects.forEach(project => {
    if (project.data.tags) {
      allTags.push(...project.data.tags);
    }
    if (project.data.technologies) {
      allTags.push(...project.data.technologies);
    }
  });
  
  // Extract tags from blogs
  blogs.forEach(blog => {
    if (blog.data.tags) {
      allTags.push(...blog.data.tags);
    }
  });
  
  return allTags;
}
