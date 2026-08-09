import { useEffect, useRef, useState } from "react";
import { ArrowSquareOutIcon, CaretDownIcon } from "@phosphor-icons/react";
import type { apps as AppsList } from "@/data/apps";

export function AppsDropdown({ apps }: { apps: typeof AppsList }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (apps.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-600 hover:text-brand-600"
      >
        Apps
        <CaretDownIcon
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          weight="bold"
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-64 border border-neutral-200 bg-white shadow-elegant z-20">
          <ul className="p-2">
            {apps.map((app) => (
              <li key={app.url}>
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
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
  );
}
