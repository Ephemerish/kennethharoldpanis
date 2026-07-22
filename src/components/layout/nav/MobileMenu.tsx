import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import Search from "../Search";
import type { apps as AppsList } from "@/data/apps";

interface NavLink {
  label: string;
  href: string;
}

interface Props {
  links: NavLink[];
  apps: typeof AppsList;
  onLinkClick: () => void;
}

export function MobileMenu({ links, apps, onLinkClick }: Props) {
  return (
    <div className="lg:hidden border-t border-neutral-200 relative" id="mobile-menu">
      <div className="space-y-1 px-4 py-3">
        <div className="mb-3">
          <Search />
        </div>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
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
  );
}
