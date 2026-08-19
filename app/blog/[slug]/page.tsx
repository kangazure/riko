import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

const categoryColors: Record<string, string> = {
  cybersecurity: "text-emerald-400",
  networking: "text-blue-400",
  linux: "text-orange-400",
  tech: "text-purple-400",
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = "";
    let codeLanguage = "";
    let key = 0;

    for (const line of lines) {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre key={key++} className="my-5 overflow-x-auto rounded-lg bg-[var(--color-surface-elevated)] p-4">
              <code className="text-[13px] leading-relaxed text-[var(--color-text-secondary)] font-mono">
                {codeContent.trim()}
              </code>
            </pre>
          );
          codeContent = "";
          inCodeBlock = false;
        } else {
          codeLanguage = line.slice(3).trim();
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent += line + "\n";
        continue;
      }

      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={key++} className="mt-10 mb-3 text-[20px] font-semibold tracking-tight text-[var(--color-text-primary)]">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={key++} className="mt-8 mb-2 text-[16px] font-semibold text-[var(--color-text-primary)]">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith("- **")) {
        const match = line.match(/- \*\*(.+?)\*\*(.*)/);
        if (match) {
          elements.push(
            <li key={key++} className="ml-4 list-disc text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
              <strong className="text-[var(--color-text-primary)]">{match[1]}</strong>
              {match[2]}
            </li>
          );
        }
      } else if (line.startsWith("- ")) {
        elements.push(
          <li key={key++} className="ml-4 list-disc text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            {line.slice(2)}
          </li>
        );
      } else if (line.startsWith("1. ") || line.match(/^\d+\. /)) {
        elements.push(
          <li key={key++} className="ml-4 list-decimal text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            {line.replace(/^\d+\. /, "")}
          </li>
        );
      } else if (line.trim() === "") {
        elements.push(<div key={key++} className="h-4" />);
      } else {
        elements.push(
          <p key={key++} className="text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            {line}
          </p>
        );
      }
    }

    return elements;
  };

  return (
    <div className="pt-24">
      <article className="mx-auto max-w-2xl px-6 py-12">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-[13px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
        >
          <ArrowLeft size={14} />
          All articles
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <span
              className={`text-[11px] font-medium uppercase tracking-[0.15em] ${categoryColors[post.category] || "text-[var(--color-text-muted)]"
                }`}
            >
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)]">
              <Calendar size={12} />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)]">
              <Clock size={12} />
              {post.readingTime}
            </span>
          </div>
          <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-[1.15] tracking-tight text-[var(--color-text-primary)]">
            {post.title}
          </h1>
        </div>

        {/* Divider */}
        <div className="mb-10 border-t border-[var(--color-border)]" />

        {/* Content */}
        <div className="prose-custom">{renderContent(post.content)}</div>

        {/* Bottom divider and back */}
        <div className="mt-16 border-t border-[var(--color-border)] pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[13px] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-secondary)]"
          >
            <ArrowLeft size={14} />
            Back to all articles
          </Link>
        </div>
      </article>
    </div>
  );
}
