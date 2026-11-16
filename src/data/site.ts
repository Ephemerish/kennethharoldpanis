/**
 * The site's own facts, each written once (KHP §1.3): name, address, email,
 * social links and the navigation. The top bar, footer, contact page, head
 * tags and sitemap read them from here.
 */

export const site = {
  name: "Kenneth Harold Panis",
  url: "https://kennethharoldpanis.com",
  description:
    "Kenneth Harold Panis, software engineer. Projects, posts and certifications across web, cloud and embedded systems.",
  email: "kennethpanis24@gmail.com",
  location: "Philippines",
  image: "/images/me/me.jpg",
} as const;

export const socials = {
  github: "https://github.com/Ephemerish",
  linkedin: "https://www.linkedin.com/in/kenneth-harold-panis/",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

/** Top-bar links in order; the Apps menu sits before the last one. */
export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Bio", href: "/bio" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

/** True when `path` is the link's page or one of its sub-pages. */
export function isCurrent(href: string, path: string): boolean {
  const clean = path.replace(/\/+$/, "") || "/";
  return href === "/" ? clean === "/" : clean === href || clean.startsWith(`${href}/`);
}
