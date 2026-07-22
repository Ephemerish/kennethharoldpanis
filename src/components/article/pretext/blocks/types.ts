export type Seg = { text: string; href?: string };
export type Block =
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  | { kind: "rich"; segments: Seg[] }
  | { kind: "quote"; text: string; source?: { label: string; href: string } };
