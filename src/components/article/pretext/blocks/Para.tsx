import { DropLetter } from "./DropLetter";

export function Para({
  text,
  dropcap,
  reduce,
}: {
  text: string;
  dropcap?: boolean;
  reduce: boolean;
}) {
  if (!dropcap || !text) return <p className="mb-4">{text}</p>;
  return (
    <p className="mb-4" style={{ overflow: "hidden", minHeight: 64 }}>
      <DropLetter ch={text.slice(0, 1)} reduce={reduce} />
      {text.slice(1)}
    </p>
  );
}
