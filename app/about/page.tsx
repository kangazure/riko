import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/about-section";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Riko Ardianto — cybersecurity enthusiast yang fokus pada riset keamanan, web security, dan Linux.",
};

export default function AboutPage() {
  return (
    <div className="pt-16">
      <AboutSection />
    </div>
  );
}
