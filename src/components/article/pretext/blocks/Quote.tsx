export function Quote({
  block,
}: {
  block: { kind: "quote"; text: string; source?: { label: string; href: string } };
}) {
  return (
    <blockquote className="my-6 border-l-2 border-brand-300 pl-4 italic text-neutral-600">
      <p className="mb-1 text-base sm:text-lg">{block.text}</p>
      {block.source && (
        <a
          href={block.source.href}
          target="_blank"
          rel="noopener noreferrer"
          className="not-italic text-sm font-medium text-brand-700 underline decoration-2 decoration-brand-400 underline-offset-2 hover:text-brand-800"
        >
          {block.source.label}
        </a>
      )}
    </blockquote>
  );
}
