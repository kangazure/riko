"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, Instagram } from "lucide-react";
import { TypingText } from "./rotating-text";
import { motion } from "motion/react";

/* Inline SVG icons for platforms not in lucide */
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Zm0 0a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
      <path d="M9.5 13.5c.8.8 1.9 1.2 3 1.2" />
    </svg>
  );
}

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/rikoardianto",
    icon: Instagram,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/6281234567890",
    icon: WhatsAppIcon,
  },
  {
    label: "GitHub",
    href: "https://github.com/kangazure",
    icon: Github,
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@rikoardianto",
    icon: TikTokIcon,
  },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 pt-16 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-16 xl:px-24">
      {/* Background grid lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] opacity-[0.03] blur-[120px]" />
      </div>

      {/* === LEFT SIDE — TEXT === */}
      <div className="relative z-10 flex flex-col items-center text-center lg:flex-1 lg:items-start lg:text-left">
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          </span>
          <span className="text-[12px] tracking-wide text-[var(--color-text-secondary)]">
            Tersedia untuk proyek
          </span>
        </motion.div>

        {/* Rotating title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <TypingText
            texts={["I'm Riko Ardianto", "Cyber Security"]}
            textColors={["", "#ef4444"]}
            className="text-[clamp(2.5rem,8vw,5rem)] font-semibold tracking-tight text-[var(--color-text-primary)]"
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 max-w-lg text-[15px] leading-relaxed text-[var(--color-text-secondary)]"
        >
          Cybersecurity enthusiast yang fokus pada riset keamanan, web security,
          dan membangun hal-hal yang benar-benar berfungsi.
        </motion.p>

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex items-center gap-4"
        >
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <social.icon size={20} />
            </a>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-text-primary)] px-5 py-2.5 text-[13px] font-medium text-[var(--color-background)] transition-all hover:bg-[var(--color-text-primary)]/90 active:scale-[0.98]"
          >
            Lihat Proyek
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-[13px] font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)] active:scale-[0.98]"
          >
            Baca Blog
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>

      {/* === RIGHT SIDE — PROFILE PHOTO === */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-16 flex items-center justify-center lg:mt-10 lg:flex-1"
      >
        {/* Outer blur aura — besar & soft */}
        <div className="absolute h-[360px] w-[360px] rounded-full bg-[var(--color-accent)] opacity-[0.06] blur-[100px]" />

        {/* Medium glow ring */}
        <div className="absolute h-[340px] w-[340px] rounded-full bg-gradient-to-br from-[rgba(59,130,246,0.08)] to-transparent blur-[60px]" />

        {/* Profile image container */}
        <div className="group relative h-[280px] w-[280px] overflow-hidden rounded-full sm:h-[320px] sm:w-[320px]">
          {/* Photo with subtle blur at edges via overlay */}
          <Image
            src="/images/profile-placeholder.svg"
            alt="Riko Ardianto — Cyber Security"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 280px, 320px"
            unoptimized
          />

          {/* Blend layers — nyatuin foto ke background */}
          {/* Layer 1: radial fade dari transparan ke background */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, transparent 55%, var(--color-background) 100%)",
            }}
          />
          {/* Layer 2: subtle blur overlay di pinggir */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full backdrop-blur-[2px]"
            style={{
              WebkitMaskImage:
                "radial-gradient(circle at center, transparent 65%, black 100%)",
              maskImage:
                "radial-gradient(circle at center, transparent 65%, black 100%)",
            }}
          />
          {/* Layer 3: soft inner shadow */}
          <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/[0.03]" />
        </div>
      </motion.div>

      {/* Bottom fade gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--color-background)] to-transparent" />
    </section>
  );
}
