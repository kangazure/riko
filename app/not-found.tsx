import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Not Found",
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 pt-16 text-center">
      <span className="mb-4 text-[10rem] font-bold leading-none tracking-tighter text-[var(--color-border)]">
        404
      </span>
      <h1 className="mb-3 text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
        Halaman tidak ditemukan
      </h1>
      <p className="mb-8 max-w-sm text-[14px] leading-relaxed text-[var(--color-text-secondary)]">
        Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2 text-[13px] font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]"
      >
        <ArrowLeft size={14} />
        Kembali ke beranda
      </Link>
    </div>
  );
}
