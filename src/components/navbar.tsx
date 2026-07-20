import { useEffect, useRef, useState } from "react";
import {
  ListIcon as Bars3Icon,
  XIcon as XMarkIcon,
  ArrowSquareOutIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import Search from "./Search";
import { apps } from "../data/apps";

const links = [
  { label: "Home", href: "/" },
  { label: "Bio", href: "/bio" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const [isAppsOpen, setIsAppsOpen] = useState(false);
  const appsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAppsOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (appsRef.current && !appsRef.current.contains(event.target as Node)) {
        setIsAppsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsAppsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isAppsOpen]);

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
              {apps.length > 0 && (
                <div className="relative" ref={appsRef}>
                  <button
                    type="button"
                    onClick={() => setIsAppsOpen((v) => !v)}
                    aria-expanded={isAppsOpen}
                    aria-haspopup="true"
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-600 hover:text-brand-600"
                  >
                    Apps
                    <CaretDownIcon
                      className={`w-3 h-3 transition-transform ${isAppsOpen ? "rotate-180" : ""}`}
                      weight="bold"
                    />
                  </button>
                  {isAppsOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-64 border border-neutral-200 bg-white shadow-elegant z-20">
                      <ul className="p-2">
                        {apps.map((app) => (
                          <li key={app.url}>
                            <a
                              href={app.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsAppsOpen(false)}
                              className="flex items-center gap-3 p-2.5 hover:bg-brand-50"
                            >
                              <img src={app.logoPath} alt="" className="w-8 h-8 shrink-0" width="32" height="32" />
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
                                  {app.name}
                                  <ArrowSquareOutIcon className="w-3.5 h-3.5 text-neutral-400" />
                                </span>
                                <span className="block text-xs text-neutral-500">{app.tagline}</span>
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 relative" id="mobile-menu">
          <div className="space-y-1 px-4 py-3">
            <div className="mb-3">
              <Search />
            </div>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="block px-3 py-2 text-base font-medium text-neutral-600 hover:text-brand-600"
              >
                {link.label}
              </a>
            ))}
            {apps.length > 0 && (
              <div className="pt-2 mt-2 border-t border-neutral-200">
                <span className="block px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  Apps
                </span>
                {apps.map((app) => (
                  <a
                    key={app.url}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-brand-50"
                  >
                    <img src={app.logoPath} alt="" className="w-7 h-7 shrink-0" width="28" height="28" />
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-base font-medium text-neutral-900">
                        {app.name}
                        <ArrowSquareOutIcon className="w-3.5 h-3.5 text-neutral-400" />
                      </span>
                      <span className="block text-xs text-neutral-500">{app.tagline}</span>
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
