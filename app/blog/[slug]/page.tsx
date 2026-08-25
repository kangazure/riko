import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, Clock, Tag } from "lucide-react";
import { blogPosts, categoryMeta, formatDate } from "@/data/blog";
import { Markdown, getHeadings } from "@/components/blog/markdown";
import { PostThumbnail } from "@/components/blog/post-thumbnail";
import { BlogCard } from "@/components/blog/blog-card";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rikoardianto.web.id";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  const meta = categoryMeta[post.category];
  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [siteUrl],
      tags: post.tags,
      images: [{ url: `/blog/${post.slug}/og-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`/blog/${post.slug}/og-image`],
    },
    category: meta.label,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const meta = categoryMeta[post.category];
  const headings = getHeadings(post.content);
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  // Related: prefer same category, fill with latest posts otherwise.
  const related = blogPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const sameA = a.category === post.category ? 0 : 1;
      const sameB = b.category === post.category ? 0 : 1;
      if (sameA !== sameB) return sameA - sameB;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "id-ID",
    author: { "@type": "Person", name: "Riko Ardianto", url: siteUrl },
    publisher: { "@type": "Person", name: "Riko Ardianto", url: siteUrl },
    image: `${siteUrl}/blog/${post.slug}/og-image`,
    mainEntityOfPage: postUrl,
    keywords: post.tags.join(", "),
  };

  return (
    <div className="pt-24">
      <article className="mx-auto max-w-6xl px-6 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-[13px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
        >
          <ArrowLeft size={14} />
          Semua artikel
        </Link>

        {/* Header */}
        <header className="max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Link
              href={`/blog?cat=${post.category}`}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.15em] transition-opacity hover:opacity-80"
              style={{ background: `${meta.accent}1a`, color: meta.accent }}
            >
              <span className="h-1 w-1 rounded-full" style={{ background: meta.accent }} />
              {meta.label}
            </Link>
            <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)]">
              <CalendarDays size={12} />
              {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)]">
              <Clock size={12} />
              {post.readingTime} baca
            </span>
          </div>

          <h1 className="text-[clamp(1.75rem,4vw,2.4rem)] font-semibold leading-[1.15] tracking-tight text-[var(--color-text-primary)]">
            {post.title}
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-[var(--color-text-secondary)]">
            {post.description}
          </p>
        </header>

        {/* Thumbnail */}
        <div className="mt-8 overflow-hidden rounded-xl border border-[var(--color-border)]">
          <PostThumbnail category={post.category} slug={post.slug} />
        </div>

        {/* Mobile TOC */}
        {headings.length > 0 && (
          <details className="mb-10 mt-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden">
            <summary className="cursor-pointer list-none px-4 py-3 text-[13px] font-medium text-[var(--color-text-primary)]">
              Daftar isi
              <span className="ml-2 text-[11px] text-[var(--color-text-muted)]">
                ({headings.length} bagian)
              </span>
            </summary>
            <div className="border-t border-[var(--color-border)] px-4 py-3">
              <DaftarIsi headings={headings} />
            </div>
          </details>
        )}

        {/* Content + desktop TOC */}
        <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0">
            <Markdown content={post.content} />

            {/* Tags */}
            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] pt-6">
              <Tag size={13} className="text-[var(--color-text-muted)]" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[var(--color-surface)] px-2.5 py-1 text-[11px] text-[var(--color-text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Author */}
            <div className="mt-8 flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <Image
                src="/images/profile-placeholder.svg"
                alt="Foto Riko Ardianto"
                width={48}
                height={48}
                unoptimized
                className="h-12 w-12 rounded-full border border-[var(--color-border)]"
              />
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">
                  Riko Ardianto
                </p>
                <p className="text-[12px] leading-relaxed text-[var(--color-text-muted)]">
                  Praktisi cybersecurity & networking — menulis soal yang sudah dipegang langsung
                  di lapangan, bukan teori saja.
                </p>
              </div>
            </div>
          </div>

          {/* Desktop TOC sidebar */}
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24 border-l border-[var(--color-border)] pl-5">
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Daftar isi
                </p>
                <DaftarIsi headings={headings} />
              </div>
            </aside>
          )}
        </div>

        {/* Related */}
        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Lanjut baca
              </span>
              <h2 className="mt-2 text-[20px] font-semibold tracking-tight text-[var(--color-text-primary)]">
                Artikel terkait
              </h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
            >
              Lihat semua <ArrowLeft size={12} className="rotate-180" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} showDescription={false} />
            ))}
          </div>
        </section>

        {/* Bottom back */}
        <div className="mt-16 border-t border-[var(--color-border)] pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[13px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
          >
            <ArrowLeft size={14} />
            Kembali ke semua artikel
          </Link>
        </div>
      </article>
    </div>
  );
}

function DaftarIsi({ headings }: { headings: ReturnType<typeof getHeadings> }) {
  return (
    <ul className="space-y-2">
      {headings.map((heading) => (
        <li
          key={heading.id}
          className={heading.level === 3 ? "pl-3" : heading.level === 4 ? "pl-5" : ""}
        >
          <a
            href={`#${heading.id}`}
            className="text-[12px] leading-snug text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
