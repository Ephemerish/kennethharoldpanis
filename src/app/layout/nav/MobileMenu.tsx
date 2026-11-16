import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import Search from "@app/features/search/Search";
import { isCurrent, type NavLink } from "@data/site";
import type { App } from "@data/apps/apps";
import { ThemeToggle } from "../ThemeToggle";

interface Props {
  links: NavLink[];
  apps: App[];
  path: string;
  /** Open with the search field focused. */
  focusSearch?: boolean;
  onLinkClick: () => void;
}

/** The menu under the top bar on narrow screens. */
export function MobileMenu({ links, apps, path, focusSearch = false, onLinkClick }: Props) {
  return (
    <div className="lg:hidden border-t border-neutral-200 relative" id="mobile-menu">
      <div className="space-y-1 px-4 py-3">
        <div className="mb-3">
          <Search autoFocus={focusSearch} />
        </div>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            aria-current={isCurrent(link.href, path) ? "page" : undefined}
            className={`block px-3 py-2 text-base font-medium hover:text-brand-700 ${isCurrent(link.href, path) ? "text-brand-700" : "text-neutral-600"}`}
          >
            {link.label}
          </a>
        ))}
        {apps.length > 0 && (
          <div className="pt-2 mt-2 border-t border-neutral-200">
            <span className="block px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
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
                    <ArrowSquareOutIcon className="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </span>
                  <span className="block text-xs text-neutral-500">{app.tagline}</span>
                </span>
              </a>
            ))}
          </div>
        )}
        <div className="pt-2 mt-2 border-t border-neutral-200">
          <ThemeToggle withLabel />
        </div>
      </div>
    </div>
  );
}
