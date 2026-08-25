import type { LucideIcon } from "lucide-react";
import {
  Bug,
  Cable,
  Container,
  Network,
  Router,
  Shield,
  Terminal,
  Wrench,
} from "lucide-react";
import type { BlogCategory } from "@/data/blog";
import { categoryMeta } from "@/data/blog";

const categoryIcons: Record<BlogCategory, LucideIcon> = {
  cybersecurity: Shield,
  networking: Network,
  mikrotik: Router,
  "olt-fiber": Cable,
  linux: Terminal,
  "web-security": Bug,
  devops: Container,
  tech: Wrench,
};

function seed(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

function patternFor(slug: string): string {
  const variant = seed(slug) % 3;
  if (variant === 0) {
    // dots grid
    return `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1.5px)`;
  }
  if (variant === 1) {
    // diagonal wiring
    return `repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 14px), radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1.5px)`;
  }
  // scan lines
  return `repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 10px)`;
}

interface PostThumbnailProps {
  category: BlogCategory;
  slug: string;
  /** Show a small label chip (used on list cards). */
  showLabel?: boolean;
  className?: string;
}

/** Procedural, kategori-aware thumbnail — no image assets needed. */
export function PostThumbnail({
  category,
  slug,
  showLabel = false,
  className = "",
}: PostThumbnailProps) {
  const meta = categoryMeta[category];
  const Icon = categoryIcons[category];

  return (
    <div
      className={`relative aspect-[16/9] overflow-hidden bg-[var(--color-surface-elevated)] ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{ background: `linear-gradient(135deg, ${meta.accent} 0%, transparent 70%)` }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: patternFor(slug) }}
      />
      <div
        className="absolute -right-10 -top-10 h-44 w-44 rounded-full blur-3xl"
        style={{ background: meta.accent, opacity: 0.22 }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className="h-14 w-14 text-white/90" strokeWidth={1.25} />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: meta.accent, opacity: 0.5 }} />
      {showLabel && (
        <span
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.55)", color: meta.accent }}
        >
          <span className="h-1 w-1 rounded-full" style={{ background: meta.accent }} />
          {meta.label}
        </span>
      )}
    </div>
  );
}
