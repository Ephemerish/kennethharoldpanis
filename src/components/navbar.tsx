import type React from "react";
import { useState } from "react";
import {
  ListIcon as Bars3Icon,
  XIcon as XMarkIcon,
  CaretDownIcon,
  UserCircleIcon,
  CertificateIcon,
  BriefcaseIcon,
  FileTextIcon,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "../lib/utils";

type BioSubLink = {
  title: string;
  href: string;
  description: string;
  Icon: Icon;
};

const bioLinks: BioSubLink[] = [
  {
    title: "About",
    href: "/bio",
    description: "Who I am, what I'm into, and what I'm building.",
    Icon: UserCircleIcon,
  },
  {
    title: "Certifications",
    href: "/bio/certifications",
    description: "FinOps, Google Cloud, and ongoing cloud learning.",
    Icon: CertificateIcon,
  },
  {
    title: "Experience",
    href: "/bio/experience",
    description: "Roles, internships, and project work over time.",
    Icon: BriefcaseIcon,
  },
  {
    title: "Resume / CV",
    href: "/bio/resume",
    description: "Downloadable resume and a quick on-page summary.",
    Icon: FileTextIcon,
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBioOpenMobile, setIsBioOpenMobile] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsBioOpenMobile(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-neutral-200 relative">
      <div className="absolute inset-0">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-0 border-l border-r border-neutral-200 h-full"></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="shrink-0">
            <a
              href="/"
              className="text-xl font-bold text-brand-gradient drop-shadow-sm"
            >
              Kenneth Harold Panis
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/"
                    className={navigationMenuTriggerStyle()}
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/projects"
                    className={navigationMenuTriggerStyle()}
                  >
                    Projects
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/blogs"
                    className={navigationMenuTriggerStyle()}
                  >
                    Blogs
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Bio</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[420px] gap-2 p-3 sm:w-[520px] sm:grid-cols-2">
                      {bioLinks.map((link) => (
                        <BioListItem key={link.href} {...link} />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/contact"
                    className={navigationMenuTriggerStyle()}
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-neutral-600 hover:text-brand-600 transition-colors duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-neutral-200" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <MobileNavLink to="/" onClick={closeMenu}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/projects" onClick={closeMenu}>
              Projects
            </MobileNavLink>
            <MobileNavLink to="/blogs" onClick={closeMenu}>
              Blogs
            </MobileNavLink>

            <button
              type="button"
              className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-neutral-600 hover:text-brand-600 transition-colors duration-200"
              aria-expanded={isBioOpenMobile}
              onClick={() => setIsBioOpenMobile((v) => !v)}
            >
              <span>Bio</span>
              <CaretDownIcon
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isBioOpenMobile && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>
            {isBioOpenMobile && (
              <div className="pl-3 border-l-2 border-brand-200 ml-3 space-y-1">
                {bioLinks.map((link) => (
                  <MobileSubLink
                    key={link.href}
                    to={link.href}
                    onClick={closeMenu}
                    Icon={link.Icon}
                  >
                    {link.title}
                  </MobileSubLink>
                ))}
              </div>
            )}

            <MobileNavLink to="/contact" onClick={closeMenu}>
              Contact
            </MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

function BioListItem({ title, href, description, Icon }: BioSubLink) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          href={href}
          className="group block select-none space-y-1 p-3 leading-none no-underline outline-none transition-colors hover:bg-brand-50/60 focus:bg-brand-50/60"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 group-hover:text-brand-700">
            <Icon className="h-4 w-4" />
            {title}
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-neutral-600">
            {description}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

function MobileNavLink({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={to}
      className="block px-3 py-2 text-base font-medium text-neutral-600 hover:text-brand-600 transition-colors duration-200"
      onClick={onClick}
    >
      {children}
    </a>
  );
}

function MobileSubLink({
  to,
  onClick,
  Icon,
  children,
}: {
  to: string;
  onClick: () => void;
  Icon: Icon;
  children: React.ReactNode;
}) {
  return (
    <a
      href={to}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-600 hover:text-brand-600 transition-colors duration-200"
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {children}
    </a>
  );
}
