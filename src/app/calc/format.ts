/** Dates and reading time, formatted one way across the site (KHP §6.5). */

const LONG = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
const MONTH = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", timeZone: "UTC" });

/** "March 29, 2026". Content dates are calendar days, so they read in UTC. */
export function formatDate(date: Date): string {
  return LONG.format(new Date(date));
}

/** "Mar 2026", for spans of months such as a project's timeline. */
export function formatMonth(date: Date): string {
  return MONTH.format(new Date(date));
}

/** ISO calendar day for a `<time datetime>`. */
export function isoDay(date: Date): string {
  return new Date(date).toISOString().slice(0, 10);
}

const WORDS_PER_MINUTE = 200;

/** "6 min read". */
export function readTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min read`;
}
