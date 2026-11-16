/** @param {string} image */
export function coverBackdrop(image) {
  return `/images/cover-backdrops/${image.replace(/[^a-zA-Z0-9]+/g, "-")}.webp`;
}
