import Image from "next/image";
import type { ReactNode } from "react";
import type { TipTapDoc, TipTapMark, TipTapNode } from "./post-types";
import { isBlobUrl } from "./post-schema";

/**
 * Renders a TipTap/ProseMirror document as React elements.
 *
 * Deliberately not `generateHTML` + dangerouslySetInnerHTML. Going straight to
 * React means there is never an HTML string to sanitize, the node and mark
 * types are whitelisted here rather than filtered after the fact, and images
 * can go through next/image instead of a bare <img>. Anything the editor emits
 * that this file does not know about is dropped rather than rendered.
 *
 * The classes mirror what the old PortableText component map used, so an
 * article looks the same as it did under Sanity.
 */

/** Only protocols that are safe on an anchor. Blocks javascript: and data:. */
function safeHref(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  try {
    const { protocol } = new URL(value, "https://slic.agency");
    if (protocol === "http:" || protocol === "https:" || protocol === "mailto:") {
      return value;
    }
  } catch {
    return null;
  }
  return null;
}

function attrNumber(value: unknown, fallback: number) {
  const parsed = typeof value === "string" ? Number(value) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) && parsed > 0
    ? parsed
    : fallback;
}

function applyMarks(children: ReactNode, marks: TipTapMark[] | undefined, key: string) {
  if (!marks?.length) return children;

  return marks.reduce<ReactNode>((acc, mark, index) => {
    const markKey = `${key}-m${index}`;

    switch (mark.type) {
      case "bold":
        return (
          <strong key={markKey} className="font-semibold text-foreground">
            {acc}
          </strong>
        );
      case "italic":
        return <em key={markKey}>{acc}</em>;
      case "strike":
        return <s key={markKey}>{acc}</s>;
      case "underline":
        return <u key={markKey}>{acc}</u>;
      case "code":
        return (
          <code
            key={markKey}
            className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
          >
            {acc}
          </code>
        );
      case "link": {
        const href = safeHref(mark.attrs?.href);
        // Unrenderable link: keep the text, drop the anchor.
        if (!href) return acc;
        return (
          <a
            key={markKey}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            {acc}
          </a>
        );
      }
      default:
        return acc;
    }
  }, children);
}

function renderNodes(nodes: TipTapNode[] | undefined, keyPrefix: string): ReactNode[] {
  return (nodes ?? []).map((node, index) => renderNode(node, `${keyPrefix}-${index}`));
}

function renderNode(node: TipTapNode, key: string): ReactNode {
  switch (node.type) {
    case "text":
      return applyMarks(node.text ?? "", node.marks, key);

    case "paragraph": {
      // TipTap keeps empty paragraphs as spacing. Rendering an empty <p> with
      // a bottom margin preserves that intent instead of collapsing it.
      const children = renderNodes(node.content, key);
      return (
        <p key={key} className="text-lg leading-8 text-foreground/80 mb-6">
          {children.length ? children : " "}
        </p>
      );
    }

    case "heading": {
      const level = attrNumber(node.attrs?.level, 2);
      const children = renderNodes(node.content, key);
      if (level <= 1) {
        return (
          <h2 key={key} className="text-4xl font-bold mt-12 mb-6">
            {children}
          </h2>
        );
      }
      if (level === 2) {
        return (
          <h2 key={key} className="text-3xl font-semibold mt-10 mb-5">
            {children}
          </h2>
        );
      }
      if (level === 3) {
        return (
          <h3 key={key} className="text-2xl font-semibold mt-8 mb-4">
            {children}
          </h3>
        );
      }
      return (
        <h4 key={key} className="text-xl font-semibold mt-6 mb-3">
          {children}
        </h4>
      );
    }

    case "bulletList":
      return (
        <ul key={key} className="list-disc pl-6 space-y-2 my-6 text-lg">
          {renderNodes(node.content, key)}
        </ul>
      );

    case "orderedList":
      return (
        <ol key={key} className="list-decimal pl-6 space-y-2 my-6 text-lg">
          {renderNodes(node.content, key)}
        </ol>
      );

    case "listItem":
      // List items wrap their text in paragraphs, whose mb-6 would space the
      // bullets far apart. Unwrapping a lone paragraph keeps the list tight.
      return (
        <li key={key} className="text-foreground/80 leading-8">
          {node.content?.length === 1 && node.content[0]?.type === "paragraph"
            ? renderNodes(node.content[0].content, key)
            : renderNodes(node.content, key)}
        </li>
      );

    case "blockquote":
      return (
        <blockquote
          key={key}
          className="border-l-4 border-primary pl-6 italic my-8 text-xl [&>p]:mb-0 [&>p]:text-foreground/90"
        >
          {renderNodes(node.content, key)}
        </blockquote>
      );

    case "codeBlock":
      return (
        <pre
          key={key}
          className="my-8 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-5 text-sm leading-relaxed"
        >
          <code className="font-mono text-foreground/90">
            {renderNodes(node.content, key)}
          </code>
        </pre>
      );

    case "horizontalRule":
      return <hr key={key} className="my-12 border-white/10" />;

    case "hardBreak":
      return <br key={key} />;

    case "image": {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
      // Same gate as post-schema.ts: only our own uploads are renderable, and
      // only they are covered by next.config.mjs remotePatterns.
      if (!isBlobUrl(src)) return null;

      const width = attrNumber(node.attrs?.width, 1200);
      const height = attrNumber(node.attrs?.height, 700);

      return (
        <div key={key} className="my-10">
          {/* The ring gives the image a visible edge. Several of these are dark
              screenshots, and against this page's near-black background an
              unbordered one reads as a gap rather than as an image. */}
          <Image
            src={src}
            alt={typeof node.attrs?.alt === "string" ? node.attrs.alt : ""}
            width={width}
            height={height}
            sizes="(min-width: 1024px) 64rem, 100vw"
            className="rounded-2xl w-full h-auto ring-1 ring-white/10"
          />
        </div>
      );
    }

    default:
      // Unknown node: render whatever children it has rather than losing the
      // text entirely, but emit no wrapper of our own.
      return node.content ? <span key={key}>{renderNodes(node.content, key)}</span> : null;
  }
}

export function TipTapContent({ doc }: { doc: TipTapDoc | null | undefined }) {
  return <>{renderNodes(doc?.content, "n")}</>;
}
