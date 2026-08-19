import type { ReactNode } from "react";

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
}

export const projects: Project[] = [
  {
    title: "Cybersecurity Lab",
    description:
      "Lab pribadi untuk mempelajari security testing dan vulnerability analysis di environment yang terisolasi dan terkontrol.",
    tags: ["Linux", "Docker", "Kali Linux", "Security Testing"],
  },
  {
    title: "Web Security Testing",
    description:
      "Eksperimen keamanan aplikasi web di lingkungan uji yang sah, mencakup kerentanan OWASP dan remediasinya.",
    tags: ["OWASP", "Burp Suite", "SQL Injection", "XSS"],
  },
  {
    title: "Security Automation",
    description:
      "Skrip dan alat otomatisasi ringan untuk mempercepat workflow security analysis dan tugas reconnaissance yang repetitif.",
    tags: ["Python", "Bash", "Nmap", "Automation"],
  },
  {
    title: "Personal Security Tools",
    description:
      "Kumpulan alat dan skrip eksperimental yang dibuat untuk pembelajaran — network scanner, log analyzer, dan aturan IDS dasar.",
    tags: ["Python", "Wireshark", "Snort", "Networking"],
  },
];
