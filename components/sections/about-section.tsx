"use client";

import { SectionReveal } from "@/components/motion/section-reveal";

export function AboutSection() {
  return (
    <section id="about" className="relative px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionReveal>
          <div className="mb-12">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Tentang
            </span>
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-tight text-[var(--color-text-primary)]">
              Saya membongkar celah
              <br />
              agar orang lain tidak bisa.
            </h2>
          </div>
        </SectionReveal>

        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <SectionReveal delay={0.1}>
            <div className="space-y-4 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                Saya Riko Ardianto — cybersecurity enthusiast yang berbasis di Indonesia. Saya
                menghabiskan waktu memahami bagaimana sistem bisa diretas, bagaimana aplikasi web
                dikompromikan, dan bagaimana membangun pertahanan yang benar-benar kokoh.
              </p>
              <p>
                Saya bekerja dengan Linux setiap hari, mendalami web security, dan menggunakan
                tools seperti Nmap, Burp Suite, dan Wireshark untuk memahami attack surface. Saya
                percaya security bukan tentang checklist — tapi tentang berpikir seperti adversary
                dan membangun dengan mindset itu sejak awal.
              </p>
              <p>
                Ketika tidak sedang mendalami packet capture atau vulnerability analysis, saya
                menulis tentang apa yang saya pelajari. Tanpa basa-basi — hanya hal-hal yang
                berhasil, yang gagal, dan alasannya.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="space-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              {[
                { label: "Fokus", value: "Cyber Security" },
                { label: "OS", value: "Linux / Kali" },
                { label: "Bahasa", value: "Bash, Python" },
                { label: "Tools", value: "Nmap, Burp Suite, Wireshark" },
                { label: "Lokasi", value: "Indonesia" },
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
