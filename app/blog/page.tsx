import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on cybersecurity, networking, Linux, and technology — written from real experience.",
};

const categoryColors: Record<string, string> = {
  cybersecurity: "text-emerald-400",
  networking: "text-blue-400",
  linux: "text-orange-400",
  tech: "text-purple-400",
};

export default function BlogPage() {
  const categories = [...new Set(blogPosts.map((p) => p.category))];

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
          Blog
        </h1>
        <p className="mb-12 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          Notes and write-ups on cybersecurity, networking, and tech. No fluff.
        </p>

        {/* Category tabs */}
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`inline-flex items-center rounded-md bg-[var(--color-surface)] px-3 py-1.5 text-[12px] capitalize ${categoryColors[cat] || "text-[var(--color-text-secondary)]"
                }`}
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="space-y-4">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-colors hover:border-[var(--color-border-strong)]"
            >
              <div className="mb-2 flex items-center gap-3">
                <span
                  className={`text-[11px] capitalize uppercase tracking-[0.15em] ${categoryColors[post.category] || "text-[var(--color-text-muted)]"
                    }`}
                >
                  {post.category}
                </span>
                <span className="text-[11px] text-[var(--color-text-muted)]">
                  {post.readingTime}
                </span>
                <span className="text-[11px] text-[var(--color-text-muted)]">{post.date}</span>
              </div>
              <h2 className="mb-1.5 text-[16px] font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                {post.title}
              </h2>
              <p className="text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
                {post.description}
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-[12px] text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100">
                Read article <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
