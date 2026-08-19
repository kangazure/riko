"use client";

import { Mail, Github, Send } from "lucide-react";
import Link from "next/link";
import { SectionReveal } from "@/components/motion/section-reveal";

const socials = [
  {
    label: "Email",
    href: "mailto:riko@rikoardianto.web.id",
    icon: <Mail size={15} />,
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: <Github size={15} />,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/6287781974170",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Zm0 0a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
      </svg>
    ),
  },
  {
    label: "Telegram",
    href: "https://t.me/nonamee",
    icon: <Send size={15} />,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/skuyyy_y7",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="relative px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <SectionReveal>
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Kontak
          </span>
          <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-tight text-[var(--color-text-primary)]">
            Hubungi saya.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
            Terbuka untuk kolaborasi, diskusi keamanan, atau sekadar obrolan seputar teknologi.
            Jangan ragu untuk menghubungi.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {socials.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target={social.label !== "Email" ? "_blank" : undefined}
                rel={social.label !== "Email" ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-[12px] font-medium text-[var(--color-text-primary)] transition-all hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]"
              >
                {social.icon}
                {social.label}
              </Link>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
