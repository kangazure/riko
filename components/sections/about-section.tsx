"use client";

import { SectionReveal } from "@/components/motion/section-reveal";

export function AboutSection() {
  return (
    <section id="about" className="relative px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionReveal>
          <div className="mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent)]">
              About
            </span>
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-tight text-[var(--color-text-primary)]">
              I break into things
              <br />
              so others can&apos;t.
            </h2>
          </div>
        </SectionReveal>

        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <SectionReveal delay={0.1}>
            <div className="space-y-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                I&apos;m Riko Ardianto — a cybersecurity enthusiast based in Indonesia. I spend my
                time understanding how systems break, how web applications get compromised, and how
                to build defenses that actually hold up.
              </p>
              <p>
                I work with Linux daily, dig into web security internals, and use tools like Nmap,
                Burp Suite, and Wireshark to understand attack surfaces. I believe security
                isn&apos;t about checklists — it&apos;s about thinking like an adversary and
                building with that mindset from day one.
              </p>
              <p>
                When I&apos;m not knee-deep in packet captures or vulnerability analysis, I write
                about what I learn. No fluff, no buzzwords — just things that worked, things that
                didn&apos;t, and why.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="space-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              {[
                { label: "Focus", value: "Cyber Security" },
                { label: "OS", value: "Linux / Kali" },
                { label: "Languages", value: "Bash, Python" },
                { label: "Tools", value: "Nmap, Burp Suite, Wireshark" },
                { label: "Location", value: "Indonesia" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-[13px] text-[var(--color-text-muted)]">{item.label}</span>
                  <span className="text-[13px] font-medium text-[var(--color-text-primary)]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
