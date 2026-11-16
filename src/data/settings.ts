/**
 * Every tunable number on the site, in one place (KHP §1.3). Change a value
 * here and every page, endpoint and test that uses it follows.
 */

/** How many entries each list shows. */
export const lists = {
  /** Projects on the home page, the featured one included. */
  homeProjects: 3,
  /** Posts on the home page under the latest one. */
  homePosts: 6,
  /** Posts per page on /blogs. */
  postsPerPage: 6,
  /** Rows of drifting tech tiles on the home page. */
  homeTechRows: 3,
} as const;

/** What the contact endpoint accepts. */
export const contactLimits = {
  name: 120,
  email: 254,
  message: 5000,
} as const;

/**
 * The bar every page and interaction must clear (KHP §7.7), measured by
 * `pnpm test:perf` in Chrome with the CPU slowed 4x, like a mid-range phone.
 * Page-load thresholds are Google's "good" Core Web Vitals; the rest keep
 * scrolling smooth and clicks instant.
 */
export const performanceBudget = {
  /** Largest Contentful Paint, ms. */
  lcp: 2500,
  /** Cumulative Layout Shift, unitless. */
  cls: 0.1,
  /** Total Blocking Time while the page loads, ms (sum of long-task excess over 50ms). */
  tbt: 200,
  /** Slowest response from input to the next paint, ms (Interaction to Next Paint). */
  inp: 200,
  /** Scrolling the whole page: at most this share of frames may take longer than 50ms. */
  scrollJankShare: 0.05,
  /** Scrolling the whole page: 95th-percentile frame time, ms. */
  scrollFrameP95: 34,
  /** JavaScript a page loads before anyone touches it, KB (compressed on the wire). */
  initialJsKb: 200,
  /** The HTML of any one page, KB. */
  htmlKb: 150,
} as const;
