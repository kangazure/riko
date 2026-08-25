"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";
import type { BlogPost } from "@/data/blog";
import { categoryMeta, formatDate } from "@/data/blog";

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  const featured = posts.filter((p) => p.featured);
  const rest = posts.filter((p) => !p.featured).slice(0, 3);

  return (
    <section id="blog" className="relative px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionReveal>
          <div className="mb-14">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Tulisan
            </span>
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-tight text-[var(--color-text-primary)]">
              Catatan seputar security
              <br />
              dan networking.
            </h2>
          </div>
        </SectionReveal>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Featured post */}
          <SectionReveal delay={0.05}>
            <div className="space-y-3">
              <Link
                href={`/blog/${featured[0]?.slug || "#"}`}
                className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:border-[var(--color-border-strong)]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-[var(--color-accent)]">
                    {featured[0] ? categoryMeta[featured[0].category].label : ""}
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    {featured[0]?.readingTime}
                  </span>
                </div>
                <h3 className="mb-2 text-[18px] font-semibold leading-snug text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                  {featured[0]?.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
                  {featured[0]?.description}
                </p>
                <div className="mt-4 flex items-center gap-3 text-[12px] text-[var(--color-text-muted)]">
                  <span>{featured[0] ? formatDate(featured[0].date) : ""}</span>
                  <span className="inline-flex items-center text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100">
                    Baca <ArrowRight size={12} className="ml-1" />
                  </span>
                </div>
              </Link>
            </div>
          </SectionReveal>

          {/* Rest of posts */}
          <div className="space-y-3">
            {rest.map((post, i) => (
              <SectionReveal key={post.slug} delay={0.1 + i * 0.06}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-border-strong)]"
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                      {categoryMeta[post.category].label}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      {post.readingTime}
                    </span>
                  </div>
                  <h4 className="mb-1 text-[14px] font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    {post.title}
                  </h4>
                  <span className="text-[11px] text-[var(--color-text-muted)]">{formatDate(post.date)}</span>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>

        <SectionReveal delay={0.3}>
          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              Semua artikel
              <ArrowRight size={13} />
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
