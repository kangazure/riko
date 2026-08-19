"use client";

import { Mail, Github, Send } from "lucide-react";
import Link from "next/link";
import { SectionReveal } from "@/components/motion/section-reveal";

export function ContactSection() {
  return (
    <section id="contact" className="relative px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <SectionReveal>
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Contact
          </span>
          <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-tight text-[var(--color-text-primary)]">
            Get in touch.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            Open to collaboration, security discussions, or just a conversation about tech. Reach
            out anytime.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="mailto:riko@rikoardianto.web.id"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] px-5 py-3 text-[13px] font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)] sm:w-auto"
            >
              <Mail size={15} />
              riko@rikoardianto.web.id
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] px-5 py-3 text-[13px] font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)] sm:w-auto"
            >
              <Github size={15} />
              GitHub
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
