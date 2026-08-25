import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Star } from "lucide-react";
import type { BlogPost } from "@/data/blog";
import { categoryMeta, formatDate } from "@/data/blog";
import { PostThumbnail } from "@/components/blog/post-thumbnail";

interface BlogCardProps {
  post: BlogPost;
  showDescription?: boolean;
}

export function BlogCard({ post, showDescription = true }: BlogCardProps) {
  const meta = categoryMeta[post.category];

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-colors hover:border-[var(--color-border-strong)]"
    >
      <div className="overflow-hidden">
        <div className="transition-transform duration-300 group-hover:scale-[1.03]">
          <PostThumbnail category={post.category} slug={post.slug} showLabel />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span
            className="text-[10px] font-medium uppercase tracking-[0.15em]"
            style={{ color: meta.accent }}
          >
            {meta.label}
          </span>
          {post.featured && (
            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
              <Star size={10} className="fill-[var(--color-accent)] text-[var(--color-accent)]" />
              Unggulan
            </span>
          )}
        </div>

        <h3 className="mb-2 text-[16px] font-semibold leading-snug tracking-tight text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent)] line-clamp-2">
          {post.title}
        </h3>

        {showDescription && (
          <p className="mb-4 text-[13px] leading-relaxed text-[var(--color-text-secondary)] line-clamp-3">
            {post.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-[var(--color-border)] pt-3.5">
          <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={11} />
              {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={11} />
              {post.readingTime}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100">
            Baca <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </Link>
  );
}
