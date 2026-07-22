import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { $searchIndex, $popular, enableSearch, type SearchItem } from "@/lib/stores/api";
import { TYPE_META, parsePopular, popularItems, latestItems, scoreItem } from "./search/ranking";
import { Highlight } from "./search/Highlight";

export default function Search({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Both stores fetch lazily once enableSearch() flips the gate; the bindings
  // give us data + loading without any per-call fetch/cache bookkeeping.
  const index = useStore($searchIndex);
  const popularStore = useStore($popular);
  const items = index.data ?? [];
  const loading = Boolean(index.loading || popularStore.loading);
  const popular = useMemo(() => parsePopular(popularStore.data), [popularStore.data]);

  // Close when clicking outside.
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Let other parts of the page focus search via a global event.
  useEffect(() => {
    const onOpen = () => {
      enableSearch();
      setOpen(true);
      inputRef.current?.focus();
    };
    window.addEventListener("open-search", onOpen);
    return () => window.removeEventListener("open-search", onOpen);
  }, []);

  const tokens = useMemo(
    () => query.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [query]
  );

  // For an empty query: show analytics "Popular" when there's any, otherwise
  // fall back to "Latest" posts + projects. For a real query: ranked matches.
  const { results, label } = useMemo<{ results: SearchItem[]; label: string }>(() => {
    if (!items.length) return { results: [], label: "" };
    if (tokens.length === 0) {
      const pop = popularItems(items, popular);
      return pop.length
        ? { results: pop, label: "Popular" }
        : { results: latestItems(items), label: "Latest" };
    }
    const matches = items
      .map((it) => ({ it, sc: scoreItem(it, tokens) }))
      .filter((x) => x.sc >= 0)
      .sort((a, b) => b.sc - a.sc)
      .slice(0, 8)
      .map((x) => x.it);
    return { results: matches, label: "" };
  }, [items, tokens, popular]);

  useEffect(() => setActive(0), [query, open]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const el = listRef.current?.querySelector<HTMLAnchorElement>(`[data-idx="${active}"]`);
      el?.click();
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showLoading = open && loading && results.length === 0;
  const showNoMatch =
    open && !loading && tokens.length > 0 && items.length > 0 && results.length === 0;
  const showResults = open && results.length > 0;
  const showPanel = showLoading || showNoMatch || showResults;

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 border border-neutral-200 focus-within:border-brand-300">
        <MagnifyingGlassIcon className="w-4 h-4 text-neutral-400 shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            enableSearch();
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search"
          data-search-input
          className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 outline-none"
          autoComplete="off"
          spellCheck={false}
          aria-label="Search projects, posts, tags, and tech"
        />
      </div>

      {showPanel && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 mt-2 min-w-[16rem] max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto bg-white border border-neutral-200 shadow-lg z-50 py-1"
        >
          {showLoading ? (
            <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-neutral-500">
              <span className="w-4 h-4 border-2 border-neutral-200 border-t-brand-500 rounded-full animate-spin" />
              Loading…
            </div>
          ) : showNoMatch ? (
            <p className="px-3 py-6 text-center text-sm text-neutral-500">
              No results for “{query.trim()}”.
            </p>
          ) : (
            <>
              {label && (
                <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  {label}
                </p>
              )}
              {results.map((item, i) => {
                const meta = TYPE_META[item.type];
                const Ic = meta.Icon;
                return (
                  <a
                    key={`${item.type}-${item.url}`}
                    href={item.url}
                    data-idx={i}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2",
                      i === active ? "bg-brand-50" : "hover:bg-neutral-50"
                    )}
                  >
                    <span className="flex items-center justify-center w-7 h-7 shrink-0 bg-neutral-100 text-neutral-500">
                      {item.imagePath ? (
                        <img src={item.imagePath} alt="" className="w-4 h-4 object-contain" />
                      ) : (
                        <Ic className="w-4 h-4" />
                      )}
                    </span>
                    <span className="flex-1 min-w-0 text-sm text-neutral-900 truncate">
                      <Highlight text={item.title} tokens={tokens} />
                    </span>
                    <span className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                      {meta.label}
                    </span>
                  </a>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
