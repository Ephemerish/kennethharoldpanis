import { useEffect, useState } from "react";
import { ListIcon as Bars3Icon, XIcon as XMarkIcon } from "@phosphor-icons/react";
import Search from "@app/features/search/Search";
import { apps } from "@data/apps/apps";
import { isCurrent, navLinks as links, site } from "@data/site";
import { AppsMenu } from "./nav/AppsMenu";
import { MobileMenu } from "./nav/MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

/**
 * The top bar (KHP §2.1). It persists across view transitions, so it reads
 * the URL again on `astro:page-load` to keep the current page marked.
 */
export default function Navbar({ path: initialPath }: { path: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [focusSearch, setFocusSearch] = useState(false);
  const [path, setPath] = useState(initialPath);

  // "Search for something else" asks for search; on a narrow screen the only
  // search lives in the menu, so open it there.
  useEffect(() => {
    const onOpenSearch = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) return;
      setFocusSearch(true);
      setIsMenuOpen(true);
    };
    window.addEventListener("open-search", onOpenSearch);
    return () => window.removeEventListener("open-search", onOpenSearch);
  }, []);

  useEffect(() => {
    const onLoad = () => {
      setPath(window.location.pathname);
      setIsMenuOpen(false);
      setFocusSearch(false);
    };
    document.addEventListener("astro:page-load", onLoad);
    return () => document.removeEventListener("astro:page-load", onLoad);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setIsMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  const linkClass = (href: string) =>
    `px-3 py-2 text-sm font-medium hover:text-brand-700 ${isCurrent(href, path) ? "text-brand-700" : "text-neutral-600"}`;

  const renderLink = (link: (typeof links)[number]) => (
    <a
      key={link.href}
      href={link.href}
      className={linkClass(link.href)}
      aria-current={isCurrent(link.href, path) ? "page" : undefined}
    >
      {link.label}
    </a>
  );

  return (
    <nav className="sticky top-0 z-nav w-full bg-neutral-0 shadow-sm border-b border-neutral-200">
      <div className="absolute inset-0">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-0 border-l border-r border-neutral-200 h-full"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Left: name + nav links */}
          <div className="flex items-center gap-6 min-w-0">
            <a href="/" className="text-xl font-bold text-brand-gradient drop-shadow-sm whitespace-nowrap">
              {site.name}
            </a>
            <div className="hidden lg:flex items-center gap-1">
              {links.slice(0, 4).map(renderLink)}
              <AppsMenu apps={apps} />
              {links.slice(4).map(renderLink)}
            </div>
          </div>

          {/* Right: search, theme, mobile toggle */}
          <div className="flex items-center gap-2">
            <Search className="hidden lg:block w-64" />
            <ThemeToggle className="hidden lg:inline-flex" />
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center p-2 text-neutral-600 hover:text-brand-700"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              onClick={() => {
                setFocusSearch(false);
                setIsMenuOpen((v) => !v);
              }}
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
        <MobileMenu
          links={links}
          apps={apps}
          path={path}
          focusSearch={focusSearch}
          onLinkClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
}
