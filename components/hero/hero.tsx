"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { TypingText } from "./rotating-text";
import { motion, useScroll, useTransform } from "motion/react";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Blur increases + fade out as user scrolls past the hero
  const filterBlur = useTransform(scrollYProgress, [0, 0.5], ["blur(0px)", "blur(10px)"]);
  const photoOpacity = useTransform(scrollYProgress, [0.2, 0.6], [1, 0.25]);
  const photoScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 pt-16 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-16 xl:px-24"
    >
      {/* Background grid lines — subtle */}
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
            className="text-[clamp(2.5rem,8vw,5rem)] font-semibold tracking-tight text-[var(--color-text-primary)]"
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 max-w-lg text-[15px] leading-relaxed text-[var(--color-text-secondary)]"
        >
          Cybersecurity enthusiast yang fokus pada riset keamanan, web security,
          dan membangun hal-hal yang benar-benar berfungsi.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
        style={{
          filter: filterBlur,
          opacity: photoOpacity,
          scale: photoScale,
        }}
        className="relative z-10 mt-16 flex items-center justify-center lg:mt-10 lg:flex-1"
      >
        {/* Glow aura behind photo */}
        <div className="absolute h-[320px] w-[320px] rounded-full bg-[var(--color-accent)] opacity-[0.05] blur-[80px]" />

        {/* Profile image — no hard border, uses mask for blend */}
        <div className="group relative h-[280px] w-[280px] overflow-hidden rounded-full sm:h-[320px] sm:w-[320px]">
          {/* DON'T CHANGE THE PHOTO — user's actual image */}
          <Image
            src="/images/profile-placeholder.svg"
            alt="Riko Ardianto — Cyber Security"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 280px, 320px"
            unoptimized
          />

          {/* Blend mask — fades edges into background */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, transparent 60%, var(--color-background) 100%)",
            }}
          />

          {/* Subtle inner highlight ring */}
          <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/[0.04]" />
        </div>
      </motion.div>

      {/* Bottom fade gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--color-background)] to-transparent" />
    </section>
  );
}
