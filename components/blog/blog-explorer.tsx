"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, SearchX, X } from "lucide-react";
import type { BlogCategory, BlogPost } from "@/data/blog";
import { allCategories, categoryMeta } from "@/data/blog";
import { BlogCard } from "@/components/blog/blog-card";

const POSTS_PER_PAGE = 6;

interface BlogExplorerProps {
  posts: BlogPost[];
  initialCategory?: BlogCategory;
  initialQuery?: string;
  initialPage?: number;
}

function pageItems(total: number, current: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("…");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("…");
  items.push(total);
  return items;
}

export function BlogExplorer({
  posts,
  initialCategory,
  initialQuery,
  initialPage,
}: BlogExplorerProps) {
  const router = useRouter();
  const [category, setCategory] = useState<BlogCategory | "all">(initialCategory ?? "all");
  const [query, setQuery] = useState(initialQuery ?? "");
  const [page, setPage] = useState(initialPage ?? 1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (category !== "all" && post.category !== category) return false;
      if (!q) return true;
      const haystack = `${post.title} ${post.description} ${post.tags.join(" ")} ${categoryMeta[post.category].label}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * POSTS_PER_PAGE;
  const visible = filtered.slice(start, start + POSTS_PER_PAGE);
  const totalPosts = posts.length;

  // Sync filter state to the URL (shareable, back/forward friendly).
  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("cat", category);
    if (query.trim()) params.set("q", query.trim());
    if (safePage > 1) params.set("page", String(safePage));
    const qs = params.toString();
    const target = qs ? `/blog?${qs}` : "/blog";
    const current = `${window.location.pathname}${window.location.search}`;
    if (current !== target) {
      router.replace(target, { scroll: false });
    }
  }, [category, query, safePage, router]);

  const resetFilters = useCallback(() => {
    setCategory("all");
    setQuery("");
    setPage(1);
  }, []);

  const selectCategory = useCallback((next: BlogCategory | "all") => {
    setCategory(next);
    setPage(1);
  }, []);

  return (
    <div>
      {/* Toolbar: search + categories */}
      <div className="mb-10">
        <div className="relative mb-5">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Cari artikel… (mis. VPN, GPON, Docker)"
            aria-label="Cari artikel"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-10 pr-10 text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors focus:border-[var(--color-border-strong)] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
              aria-label="Hapus pencarian"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => selectCategory("all")}
            className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
              category === "all"
                ? "border-transparent bg-[var(--color-accent)] text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            Semua
          </button>
          {allCategories.map((cat) => {
            const meta = categoryMeta[cat];
            const active = category === cat;
            return (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  active
                    ? "border-transparent bg-[var(--color-accent)] text-white"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: active ? "currentColor" : meta.accent }}
                />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result meta */}
      <div className="mb-6 flex items-center justify-between text-[12px] text-[var(--color-text-muted)]">
        <span>
          Menampilkan{" "}
          <span className="text-[var(--color-text-secondary)]">
            {filtered.length === 0 ? 0 : start + 1}–{Math.min(start + POSTS_PER_PAGE, filtered.length)}
          </span>{" "}
          dari <span className="text-[var(--color-text-secondary)]">{filtered.length}</span> artikel
          {query.trim() && (
            <>
              {" "}untuk “<span className="text-[var(--color-text-secondary)]">{query.trim()}</span>”
            </>
          )}
        </span>
      </div>

      {/* Empty state */}
      {visible.length === 0 && (
        <div className="rounded-xl border border-dashed border-[var(--color-border-strong)] py-20 text-center">
          <SearchX size={28} className="mx-auto mb-4 text-[var(--color-text-muted)]" />
          <p className="mb-1 text-[15px] font-medium text-[var(--color-text-primary)]">
            Artikel tidak ditemukan
          </p>
          <p className="mb-5 text-[13px] text-[var(--color-text-secondary)]">
            Coba kata kunci lain atau reset filter.
          </p>
          <button
            onClick={resetFilters}
            className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Reset filter
          </button>
        </div>
      )}

      {/* Grid */}
      {visible.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          {visible.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && visible.length > 0 && (
        <nav className="mt-12 flex items-center justify-center gap-1.5" aria-label="Paginasi blog">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] px-3 py-2 text-[12px] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft size={14} />
            Sebelumnya
          </button>
          {pageItems(totalPages, safePage).map((item, idx) =>
            item === "…" ? (
              <span key={`e-${idx}`} className="px-1 text-[12px] text-[var(--color-text-muted)]">
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setPage(item)}
                aria-current={item === safePage ? "page" : undefined}
                className={`h-9 min-w-9 rounded-md px-2 text-[12px] font-medium transition-colors ${
                  item === safePage
                    ? "bg-[var(--color-accent)] text-white"
                    : "border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {item}
              </button>
            )
          )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border)] px-3 py-2 text-[12px] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Halaman berikutnya"
          >
            Berikutnya
            <ChevronRight size={14} />
          </button>
        </nav>
      )}

      <p className="mt-10 text-center text-[12px] text-[var(--color-text-muted)]">
        Total {totalPosts} artikel di blog ini.
      </p>
    </div>
  );
}
