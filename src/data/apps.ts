/**
 * Apps Data
 *
 * Live apps and products, shown in the footer's "Apps" section so a visitor
 * always has a place to find them and click through to the real site.
 */

export interface App {
  name: string;
  tagline: string;
  logoPath: string;
  url: string;
}

export const apps: App[] = [
  {
    name: "Pidada",
    tagline: "Shared focus and planning app",
    logoPath: "/images/pidada/logo.svg",
    url: "https://pidada.kennethharoldpanis.com/",
  },
  {
    name: "Pundo",
    tagline: "Personal budgeting app",
    logoPath: "/images/pundo/logo.svg",
    url: "https://pundo.kennethharoldpanis.com/",
  },
];
