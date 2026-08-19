"use client";

import { SectionReveal } from "@/components/motion/section-reveal";
import { Shield, Monitor, Globe, Terminal } from "lucide-react";

const skillGroups = [
  {
    icon: Shield,
    title: "Keamanan",
    skills: ["Nmap", "Burp Suite", "Metasploit", "SQLmap", "Gobuster", "Wireshark"],
  },
  {
    icon: Terminal,
    title: "Sistem",
    skills: ["Linux", "Kali Linux", "Bash", "Git", "Docker"],
  },
  {
    icon: Globe,
    title: "Keamanan Web",
    skills: [
      "HTTP / HTTPS",
      "OWASP Top 10",
      "Authentication",
      "Authorization",
      "Vulnerability Analysis",
      "Security Testing",
    ],
  },
  {
    icon: Monitor,
    title: "Pengembangan",
    skills: ["Python", "JavaScript", "TypeScript", "Next.js", "Tailwind CSS"],
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="relative px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionReveal>
          <div className="mb-14">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Keahlian
            </span>
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-tight text-[var(--color-text-primary)]">
              Tools yang dipakai.
            </h2>
          </div>
        </SectionReveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {skillGroups.map((group, i) => (
            <SectionReveal key={group.title} delay={i * 0.08} className="h-full">
              <div className="group flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:border-[var(--color-border-strong)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-soft)]">
                    <group.icon size={16} className="text-[var(--color-accent)]" />
                  </div>
                  <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">
                    {group.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-md bg-[var(--color-surface-hover)] px-2.5 py-1 text-[12px] text-[var(--color-text-secondary)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
