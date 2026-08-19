export interface SkillItem {
  category: string;
  items: string[];
}

export const skillsData: SkillItem[] = [
  {
    category: "Security",
    items: ["Nmap", "Burp Suite", "Metasploit", "SQLmap", "Gobuster", "Wireshark"],
  },
  {
    category: "System",
    items: ["Linux", "Kali Linux", "Bash", "Git", "Docker"],
  },
  {
    category: "Web Security",
    items: [
      "HTTP / HTTPS",
      "OWASP Top 10",
      "Authentication",
      "Authorization",
      "Vulnerability Analysis",
      "Security Testing",
    ],
  },
  {
    category: "Development",
    items: ["Python", "JavaScript", "TypeScript", "Next.js", "Tailwind CSS"],
  },
];
