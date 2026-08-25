import type { Metadata } from "next";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { blogPosts, type BlogCategory } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artikel teknis seputar cybersecurity, networking, MikroTik, OLT & fiber optic, Linux, web security, DevOps, dan tutorial teknologi — ditulis dari pengalaman praktisi.",
  keywords: [
    "blog cybersecurity",
    "tutorial mikrotik",
    "GPON",
    "web security",
    "networking",
    "devops",
    "linux",
    "Riko Ardianto",
  ],
  openGraph: {
    title: "Blog — Riko Ardianto",
    description:
      "Artikel teknis seputar cybersecurity, networking, MikroTik, OLT & fiber optic, Linux, web security, dan DevOps.",
    type: "website",
  },
};

const VALID_CATEGORIES = new Set<BlogCategory>([
  "cybersecurity",
  "networking",
  "mikrotik",
  "olt-fiber",
  "linux",
  "web-security",
  "devops",
  "tech",
]);

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const sp = await searchParams;

  const rawCat = typeof sp.cat === "string" ? sp.cat : undefined;
  const category = rawCat && VALID_CATEGORIES.has(rawCat as BlogCategory)
    ? (rawCat as BlogCategory)
    : undefined;

  const rawQ = typeof sp.q === "string" ? sp.q : undefined;
  const query = rawQ ? rawQ.slice(0, 80) : undefined;

  const rawPage = typeof sp.page === "string" ? parseInt(sp.page, 10) : NaN;
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <header className="mb-12 py-8">
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Blog
          </span>
          <h1 className="mt-4 max-w-2xl text-[clamp(1.9rem,4.5vw,2.75rem)] font-semibold leading-[1.1] tracking-tight text-[var(--color-text-primary)]">
            Catatan dari lapangan, bukan dari buku teori.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            Tulisan seputar cybersecurity, networking, MikroTik, OLT & fiber optic, Linux, web
            security, dan DevOps — sesuai yang saya temui saat bekerja, lengkap dengan konfigurasi
            dan angka-angka yang bisa langsung dipakai.
          </p>
        </header>

        <div className="pb-20">
          <BlogExplorer
            posts={blogPosts}
            initialCategory={category}
            initialQuery={query}
            initialPage={page}
          />
        </div>
      </div>
    </div>
  );
}
