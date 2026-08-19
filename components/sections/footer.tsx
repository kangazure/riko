import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-1 text-[12px] text-[var(--color-text-muted)]">
          <span>&copy; {new Date().getFullYear()}</span>
          <Link
            href="/"
            className="font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            Riko Ardianto
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/about"
            className="text-[12px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="text-[12px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="text-[12px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
          >
            Contact
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
            aria-label="GitHub"
          >
            <Github size={14} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
