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
      "A personal lab environment for learning security testing and vulnerability analysis in isolated, controlled settings.",
    tags: ["Linux", "Docker", "Kali Linux", "Security Testing"],
  },
  {
    title: "Web Security Testing",
    description:
      "Experiments with web application security on authorized test environments, covering OWASP vulnerabilities and remediation.",
    tags: ["OWASP", "Burp Suite", "SQL Injection", "XSS"],
  },
  {
    title: "Security Automation",
    description:
      "Scripts and lightweight automation tools for streamlining common security analysis workflows and repetitive reconnaissance tasks.",
    tags: ["Python", "Bash", "Nmap", "Automation"],
  },
  {
    title: "Personal Security Tools",
    description:
      "Collection of experimental tools and scripts built for learning purposes — network scanners, log analyzers, and basic IDS rules.",
    tags: ["Python", "Wireshark", "Snort", "Networking"],
  },
];
