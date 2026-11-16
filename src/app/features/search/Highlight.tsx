import { escapeRegExp } from "./ranking";

export function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
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
