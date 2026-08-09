import { useState } from "react";
import { ListIcon as Bars3Icon, XIcon as XMarkIcon } from "@phosphor-icons/react";
import Search from "./Search";
import { AppsDropdown } from "./nav/AppsDropdown";
import { MobileMenu } from "./nav/MobileMenu";
import { apps } from "@/data/apps";

const links = [
  { label: "Home", href: "/" },
  { label: "Bio", href: "/bio" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-neutral-200">
      <div className="absolute inset-0">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-0 border-l border-r border-neutral-200 h-full"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Left: name + nav links */}
          <div className="flex items-center gap-6 min-w-0">
            <a
              href="/"
              className="text-xl font-bold text-brand-gradient drop-shadow-sm whitespace-nowrap"
            >
              Kenneth Harold Panis
            </a>
            <div className="hidden lg:flex items-center gap-1">
              {links.slice(0, 4).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-brand-600"
                >
                  {link.label}
                </a>
              ))}
              <AppsDropdown apps={apps} />
              {links.slice(4).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-brand-600"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: search + mobile toggle */}
          <div className="flex items-center gap-2">
            <Search className="hidden lg:block w-64" />
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center p-2 text-neutral-600 hover:text-brand-600"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen((v) => !v)}
            >
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <MobileMenu links={links} apps={apps} onLinkClick={() => setIsMenuOpen(false)} />
      )}
    </nav>
  );
}
