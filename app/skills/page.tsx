import type { Metadata } from "next";
import { SkillsSection } from "@/components/sections/skills-section";

export const metadata: Metadata = {
  title: "Skills",
  description: "Cybersecurity and technical skills — security tools, Linux, web security, and development.",
};

export default function SkillsPage() {
  return (
    <div className="pt-16">
      <SkillsSection />
    </div>
  );
}
