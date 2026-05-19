/**
 * rehype-figure
 *
 * Turns any standalone image into a captioned <figure>:
 *
 *   ![A short caption](/images/pundo/01-hero.png)
 *
 * becomes
 *
 *   <figure>
 *     <img src="/images/pundo/01-hero.png" alt="A short caption" />
 *     <figcaption>A short caption</figcaption>
 *   </figure>
 *
 * A paragraph that contains only an image (ignoring whitespace) is treated as
 * a "pic". If the image has alt text, it doubles as the visible caption.
 * Inline images inside a sentence are left untouched.
 *
 * Zero dependencies on purpose so it works in every blog and project entry
 * without adding anything to the toolchain.
 */
export default function rehypeFigure() {
  const isBlank = (node) =>
    node.type === "text" && /^\s*$/.test(node.value);

  const transform = (node) => {
    if (!node || !Array.isArray(node.children)) return;

    node.children = node.children.map((child) => {
      if (child.type === "element" && child.tagName === "p") {
        const meaningful = child.children.filter((c) => !isBlank(c));

        if (
          meaningful.length === 1 &&
          meaningful[0].type === "element" &&
          meaningful[0].tagName === "img"
        ) {
          const img = meaningful[0];
          const alt = String(img.properties?.alt ?? "").trim();

          const figure = {
            type: "element",
            tagName: "figure",
            properties: {},
            children: [img],
          };

          if (alt) {
            figure.children.push({
              type: "element",
              tagName: "figcaption",
              properties: {},
              children: [{ type: "text", value: alt }],
            });
          }

          return figure;
        }
      }
      return child;
    });

    for (const child of node.children) transform(child);
  };

  return (tree) => transform(tree);
}
