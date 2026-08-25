import { Fragment } from "react";
import { CodeBlock } from "@/components/blog/code-block";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface Heading {
  level: 2 | 3 | 4;
  text: string;
  id: string;
}

/** Collect h2-h4 headings from raw markdown — used for the in-page TOC. */
export function getHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  for (const line of content.split("\n")) {
    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (match) {
      const level = match[1].length as 2 | 3 | 4;
      headings.push({ level, text: match[2].trim(), id: slugify(match[2]) });
    }
  }
  return headings;
}

const INLINE_TOKEN =
  /(\*\*[^*]+\*\*|`[^`\n]+`|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let key = 0;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  INLINE_TOKEN.lastIndex = 0;
  while ((match = INLINE_TOKEN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(
        <strong key={key++} className="font-semibold text-[var(--color-text-primary)]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code
          key={key++}
          className="rounded-md bg-[var(--color-surface-elevated)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--color-accent)]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[")) {
      const label = token.slice(1, token.indexOf("]"));
      const url = token.slice(token.indexOf("(") + 1, -1);
      nodes.push(
        <a
          key={key++}
          href={url}
          target={url.startsWith("http") ? "_blank" : undefined}
          rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
          className="text-[var(--color-accent)] underline decoration-[var(--color-accent)]/30 underline-offset-2 transition-colors hover:decoration-[var(--color-accent)]"
        >
          {label}
        </a>
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) {
    nodes.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }
  return nodes;
}

function isTableStart(lines: string[], i: number): boolean {
  if (!lines[i].trim().startsWith("|")) return false;
  const next = lines[i + 1];
  if (!next || !next.trim().startsWith("|")) return false;
  return splitTableRow(next).every((cell) => /^:?-{2,}:?$/.test(cell));
}

function isListLine(line: string): boolean {
  return line.startsWith("- ") || line.startsWith("+ ");
}

function isOrderedLine(line: string): boolean {
  return /^\d+\.\s/.test(line);
}

function isQuoteLine(line: string): boolean {
  return line.startsWith("> ");
}

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let key = 0;
  let i = 0;

  const pushTable = (start: number): number => {
    let j = start;
    const rows: string[][] = [];
    while (j < lines.length && lines[j].trim().startsWith("|")) {
      rows.push(splitTableRow(lines[j]));
      j++;
    }
    const header = rows[0];
    const body = rows.slice(2);
    nodes.push(
      <div key={key++} className="my-6 overflow-x-auto rounded-lg border border-[var(--color-border)]">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
              {header.map((cell, idx) => (
                <th
                  key={idx}
                  className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-text-muted)]"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ridx) => (
              <tr
                key={ridx}
                className="border-b border-[var(--color-border)] last:border-0 bg-[var(--color-surface-elevated)]"
              >
                {row.map((cell, cidx) => (
                  <td key={cidx} className="px-4 py-2.5 text-[var(--color-text-secondary)]">
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    return j;
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      i++;
      continue;
    }

    // Fenced code block
    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim() || undefined;
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++; // closing fence
      nodes.push(<CodeBlock key={key++} code={buf.join("\n")} language={language} />);
      continue;
    }

    // Headings
    if (/^#{2,4}\s/.test(line)) {
      const level = line.match(/^(#{2,4})\s/)![1].length;
      const text = line.replace(/^#{2,4}\s/, "").trim();
      const id = slugify(text);
      if (level === 2) {
        nodes.push(
          <h2 key={key++} id={id} className="mb-4 mt-12 scroll-mt-24 text-[22px] font-semibold tracking-tight text-[var(--color-text-primary)]">
            {text}
          </h2>
        );
      } else if (level === 3) {
        nodes.push(
          <h3 key={key++} id={id} className="mb-3 mt-8 scroll-mt-24 text-[17px] font-semibold tracking-tight text-[var(--color-text-primary)]">
            {text}
          </h3>
        );
      } else {
        nodes.push(
          <h4 key={key++} id={id} className="mb-2 mt-6 scroll-mt-24 text-[15px] font-semibold text-[var(--color-text-primary)]">
            {text}
          </h4>
        );
      }
      i++;
      continue;
    }

    // Table
    if (isTableStart(lines, i)) {
      i = pushTable(i);
      continue;
    }

    // Blockquote
    if (isQuoteLine(line)) {
      const buf: string[] = [];
      while (i < lines.length && isQuoteLine(lines[i])) {
        buf.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <blockquote
          key={key++}
          className="my-6 rounded-r-lg border-l-2 py-1 pl-5 text-[15px] leading-relaxed text-[var(--color-text-secondary)]"
          style={{ borderColor: "var(--color-accent)" }}
        >
          {buf.map((q, idx) => (
            <Fragment key={idx}>
              {renderInline(q)}
              {idx < buf.length - 1 && <br />}
            </Fragment>
          ))}
        </blockquote>
      );
      continue;
    }

    // Unordered list
    if (isListLine(line)) {
      const items: string[] = [];
      while (i < lines.length && isListLine(lines[i])) {
        items.push(lines[i].replace(/^[-+]\s/, ""));
        i++;
      }
      nodes.push(
        <ul key={key++} className="mb-5 space-y-2 pl-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-3 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
              <span
                className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--color-accent)" }}
              />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (isOrderedLine(line)) {
      const items: string[] = [];
      while (i < lines.length && isOrderedLine(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      nodes.push(
        <ol key={key++} className="mb-5 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--color-text-secondary)] marker:text-[var(--color-accent)]">
          {items.map((item, idx) => (
            <li key={idx} className="pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Horizontal rule
    if (/^-{3,}$/.test(trimmed)) {
      nodes.push(<hr key={key++} className="my-10 border-[var(--color-border)]" />);
      i++;
      continue;
    }

    // Paragraph (greedy: consecutive plain lines)
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !/^#{2,4}\s/.test(lines[i]) &&
      !lines[i].trim().startsWith("|") &&
      !isQuoteLine(lines[i]) &&
      !isListLine(lines[i]) &&
      !isOrderedLine(lines[i]) &&
      !/^-{3,}$/.test(lines[i].trim())
    ) {
      buf.push(lines[i]);
      i++;
    }
    nodes.push(
      <p key={key++} className="mb-5 text-[15px] leading-[1.8] text-[var(--color-text-secondary)]">
        {renderInline(buf.join(" "))}
      </p>
    );
  }

  return <div>{nodes}</div>;
}
