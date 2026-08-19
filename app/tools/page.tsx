import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Globe, Terminal, Search, Wrench, Radio } from "lucide-react";

export const metadata: Metadata = {
  title: "Tools",
  description: "Kumpulan cybersecurity tools yang biasa digunakan Riko Ardianto.",
};

const tools = [
  {
    category: "Network Scanning",
    icon: Search,
    items: [
      { name: "Nmap", desc: "Network discovery & security auditing" },
      { name: "Wireshark", desc: "Network protocol analyzer & packet capture" },
      { name: "tcpdump", desc: "Command-line packet analyzer" },
      { name: "netcat", desc: "Swiss army knife networking tool" },
    ],
  },
  {
    category: "Web Security",
    icon: Globe,
    items: [
      { name: "Burp Suite", desc: "Web application security testing platform" },
      { name: "SQLmap", desc: "Automatic SQL injection tool" },
      { name: "Gobuster", desc: "Directory & DNS enumeration" },
      { name: "ffuf", desc: "Fast web fuzzer" },
    ],
  },
  {
    category: "Exploitation",
    icon: Shield,
    items: [
      { name: "Metasploit", desc: "Penetration testing framework" },
      { name: "searchsploit", desc: "Exploit-DB command line search" },
      { name: "John the Ripper", desc: "Password cracking tool" },
      { name: "Hashcat", desc: "Advanced password recovery" },
    ],
  },
  {
    category: "System & Utility",
    icon: Terminal,
    items: [
      { name: "Linux / Kali", desc: "OS utama untuk security work" },
      { name: "Docker", desc: "Container untuk lab environment" },
      { name: "Git", desc: "Version control" },
      { name: "tmux", desc: "Terminal multiplexer" },
    ],
  },
];

export default function ToolsPage() {
  return (
    <div className="pt-24">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
          Tools
        </h1>
        <p className="mb-12 text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          Tools yang biasa saya gunakan untuk cybersecurity, network analysis, dan security testing.
        </p>

        <div className="space-y-6">
          {tools.map((group) => (
            <div
              key={group.category}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-soft)]">
                  <group.icon size={16} className="text-[var(--color-accent)]" />
                </div>
                <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
                  {group.category}
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map((tool) => (
                  <div
                    key={tool.name}
                    className="rounded-lg bg-[var(--color-surface-hover)] px-4 py-3"
                  >
                    <h3 className="text-[13px] font-medium text-[var(--color-text-primary)]">
                      {tool.name}
                    </h3>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--color-text-muted)]">
                      {tool.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
