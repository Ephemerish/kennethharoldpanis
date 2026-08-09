/** Plain section heading. */
export function Heading({ text }: { text: string }) {
  return (
    <h2 className="mt-8 mb-4 text-lg sm:text-xl font-semibold tracking-tight text-neutral-900 pb-2 border-b-2 border-brand-500">
      {text}
    </h2>
  );
}
