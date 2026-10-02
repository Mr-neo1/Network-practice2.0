import { Fragment, ReactNode } from "react";

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`)/g;

/** Render the tiny inline markup used in content: **bold** and `code`. */
export function rich(text: string): ReactNode {
  if (!text.includes("*") && !text.includes("`")) return text;
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) return <code key={i}>{part.slice(1, -1)}</code>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Plain text version (for search and titles). */
export function plain(text: string) {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1");
}
