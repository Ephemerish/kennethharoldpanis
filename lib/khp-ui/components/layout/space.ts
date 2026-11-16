/**
 * The spacing steps every layout primitive shares (KHP §3.3). One table, so
 * "lg" means the same gap in a Stack, a Row and a Grid. Steps widen at `sm`
 * where the site always did.
 */
export const GAP = {
  none: "gap-0",
  "2xs": "gap-1",
  xs: "gap-1.5",
  sm: "gap-2",
  md: "gap-3 sm:gap-4",
  lg: "gap-4 sm:gap-6",
  xl: "gap-6 sm:gap-8",
  "2xl": "gap-8 sm:gap-10",
  "3xl": "gap-12 sm:gap-16",
} as const;

export type Gap = keyof typeof GAP;

export const ALIGN = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
  stretch: "items-stretch",
} as const;

export const JUSTIFY = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

/** Space above a block: the vertical rhythm between parts of a page. */
export const SPACE_TOP = {
  none: "",
  xs: "mt-2",
  sm: "mt-4",
  md: "mt-6 sm:mt-8",
  lg: "mt-8 sm:mt-12",
  xl: "mt-12 sm:mt-16",
  "2xl": "mt-16 sm:mt-20",
} as const;

export type SpaceTop = keyof typeof SPACE_TOP;
