import type { Metadata } from "next";
import { SkillsSection } from "@/components/sections/skills-section";

export const metadata: Metadata = {
  title: "Keahlian",
  description: "Keahlian cybersecurity dan teknis — security tools, Linux, web security, dan development.",
};

export default function SkillsPage() {
  return (
    <div className="pt-16">
      <SkillsSection />
    </div>
  );
}
