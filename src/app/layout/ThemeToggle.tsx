import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { cn } from "@ui/utils/cn";

/**
 * Switches the site between light (the default) and dark, and remembers the
 * choice (KHP §5.2). ThemeScript applies it on every page.
 */
export function ThemeToggle({ className = "", withLabel = false }: { className?: string; withLabel?: boolean }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const read = () => setDark(document.documentElement.classList.contains("dark"));
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Private mode: the choice lasts for this page only.
    }
  };

  const label = dark ? "Switch to light theme" : "Switch to dark theme";
  const Icon = dark ? SunIcon : MoonIcon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={withLabel ? undefined : label}
      title={withLabel ? undefined : label}
      className={cn("inline-flex items-center gap-2 text-neutral-600 hover:text-brand-700", withLabel ? "px-3 py-2 text-base font-medium" : "p-2", className)}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {withLabel && label}
    </button>
  );
}
