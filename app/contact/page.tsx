import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact-section";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi Riko Ardianto — cybersecurity enthusiast yang terbuka untuk kolaborasi dan diskusi.",
};

export default function ContactPage() {
  return (
    <div className="pt-16">
      <ContactSection />
    </div>
  );
}
