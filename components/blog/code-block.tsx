"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard tidak tersedia (http non-secure) — abaikan
    }
  }, [code]);

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
          {language || "bash"}
        </span>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
          aria-label="Salin kode"
        >
          {copied ? (
            <>
              <Check size={12} className="text-[var(--color-accent)]" />
              Tersalin
            </>
          ) : (
            <>
              <Copy size={12} />
              Salin
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
          {code.trim()}
        </code>
      </pre>
    </div>
  );
}
