import { useEffect, useMemo, useRef, useState } from "react";
import {
  MagnifyingGlassIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  TagIcon,
  CpuIcon,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { cn } from "../lib/utils";

type ItemType = "project" | "blog" | "tag" | "tech";

interface SearchItem {
  type: ItemType;
  title: string;
  url: string;
  description?: string;
  keywords?: string[];
  count?: number;
  imagePath?: string;
}

const TYPE_META: Record<ItemType, { label: string; Icon: Icon }> = {
  project: { label: "Project", Icon: RocketLaunchIcon },
  blog: { label: "Post", Icon: BookOpenIcon },
  tag: { label: "Tag", Icon: TagIcon },
  tech: { label: "Tech", Icon: CpuIcon },
};

// Fetched once per session and reused across instances / SPA navigations.
let cache: SearchItem[] | null = null;
let inflight: Promise<SearchItem[]> | null = null;

async function loadIndex(): Promise<SearchItem[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch("/search.json")
      .then((r) => r.json())
      .then((data: SearchItem[]) => (cache = data))
      .catch(() => (cache = []));
  }
  return inflight;
}

// Analytics-driven popularity from /api/popular, flattened across every
// content type into one list ranked by visit count. Cached like the index;
// falls back to static usage counts.
type PopularEntry = { type: ItemType; slug: string; count: number };

// Maps an /api/popular section key to its search item type.
const POPULAR_TYPES: Record<string, ItemType> = {
  tech: "tech",
  tags: "tag",
  projects: "project",
  blogs: "blog",
};

let popularCache: PopularEntry[] | null = null;
let popularInflight: Promise<PopularEntry[]> | null = null;

// /api/popular passes the edge function through verbatim: each section is a
// { segment, count }[]. Flatten all sections and sort by count, descending.
function parsePopular(data: unknown): PopularEntry[] {
  const out: PopularEntry[] = [];
  if (data && typeof data === "object") {
    for (const [key, type] of Object.entries(POPULAR_TYPES)) {
      const list = (data as Record<string, unknown>)[key];
      if (!Array.isArray(list)) continue;
      for (const e of list) {
        const slug = e && typeof e === "object" ? (e as { segment?: unknown }).segment : e;
        const count = e && typeof e === "object" ? (e as { count?: unknown }).count : 0;
        if (typeof slug === "string" && slug) {
          out.push({ type, slug, count: typeof count === "number" ? count : 0 });
        }
      }
    }
  }
  return out.sort((a, b) => b.count - a.count);
}

async function loadPopular(): Promise<PopularEntry[]> {
  if (popularCache) return popularCache;
  if (!popularInflight) {
    popularInflight = fetch("/api/popular")
      .then((r) => r.json())
      .then((d): PopularEntry[] => (popularCache = parsePopular(d)))
      .catch(() => (popularCache = []));
  }
  return popularInflight;
}

// Items to show for an empty query: most-visited first across all types, then
// topped up with static usage counts so the list is never empty before traffic.
function buildPopular(items: SearchItem[], popular: PopularEntry[], max = 6): SearchItem[] {
  const picked: SearchItem[] = [];
  const seen = new Set<string>();
  const add = (it?: SearchItem) => {
    if (it && !seen.has(it.url)) {
      seen.add(it.url);
      picked.push(it);
    }
  };
  const find = (type: ItemType, slug: string) =>
    items.find((i) => i.type === type && i.url.endsWith(`/${slug}`));

  for (const { type, slug } of popular) {
    if (picked.length >= max) break;
    add(find(type, slug));
  }
  if (picked.length < max) {
    [...items]
      .filter((i) => i.type === "tag" || i.type === "tech")
      .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
      .forEach(add);
  }
  return picked.slice(0, max);
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function scoreItem(item: SearchItem, tokens: string[]): number {
  const title = item.title.toLowerCase();
  const keywords = (item.keywords ?? []).join(" ").toLowerCase();
  const desc = (item.description ?? "").toLowerCase();
  let total = 0;
  for (const tok of tokens) {
    let s = 0;
    if (title === tok) s = 100;
    else if (title.startsWith(tok)) s = 60;
    else if (new RegExp(`\\b${escapeRegExp(tok)}`).test(title)) s = 45;
    else if (title.includes(tok)) s = 30;
    else if (keywords.includes(tok)) s = 18;
    else if (desc.includes(tok)) s = 8;
    else return -1; // every token must match somewhere
    total += s;
  }
  return total;
}

function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (tokens.length === 0) return <>{text}</>;
  const re = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "ig");
  const set = new Set(tokens);
  return (
    <>
      {text
        .split(re)
        .filter((p) => p !== "")
        .map((part, i) =>
          set.has(part.toLowerCase()) ? (
            <mark key={i} className="bg-brand-100 text-brand-800">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
    </>
  );
}

export default function Search({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [popular, setPopular] = useState<PopularEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const ensureLoaded = () => {
    if (!cache) loadIndex().then(setItems);
    else if (!items.length) setItems(cache);
    if (!popularCache) loadPopular().then(setPopular);
    else setPopular(popularCache);
  };

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
      ensureLoaded();
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

  const results = useMemo<SearchItem[]>(() => {
    if (!items.length) return [];
    if (tokens.length === 0) {
      return buildPopular(items, popular);
    }
    return items
      .map((it) => ({ it, sc: scoreItem(it, tokens) }))
      .filter((x) => x.sc >= 0)
      .sort((a, b) => b.sc - a.sc)
      .slice(0, 8)
      .map((x) => x.it);
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

  const showEmpty = open && tokens.length > 0 && items.length > 0 && results.length === 0;
  const showResults = open && results.length > 0;

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
            ensureLoaded();
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

      {(showResults || showEmpty) && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 mt-2 min-w-[16rem] max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto bg-white border border-neutral-200 shadow-lg z-50 py-1"
        >
          {showEmpty ? (
            <p className="px-3 py-6 text-center text-sm text-neutral-500">
              No results for “{query.trim()}”.
            </p>
          ) : (
            <>
              {tokens.length === 0 && (
                <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Popular
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
