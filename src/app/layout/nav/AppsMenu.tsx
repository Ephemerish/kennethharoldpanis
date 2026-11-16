import { useEffect, useRef, useState } from "react";
import { ArrowSquareOutIcon, CaretDownIcon } from "@phosphor-icons/react";
import type { App } from "@data/apps/apps";

/** The Apps dropdown in the top bar: each live app, opening in a new tab. */
export function AppsMenu({ apps }: { apps: App[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    const handleFocus = (event: FocusEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("focusin", handleFocus);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("focusin", handleFocus);
    };
  }, [isOpen]);

  if (apps.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls="apps-menu"
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-600 hover:text-brand-700"
      >
        Apps
        <CaretDownIcon className={`w-3 h-3 ${isOpen ? "rotate-180" : ""}`} weight="bold" aria-hidden="true" />
      </button>
      {isOpen && (
        <div id="apps-menu" className="absolute left-0 top-full mt-1.5 w-64 border border-neutral-200 bg-neutral-0 shadow-elegant z-dropdown">
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
                      <ArrowSquareOutIcon className="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
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
