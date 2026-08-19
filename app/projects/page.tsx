import type { Metadata } from "next";
import { ProjectsSection } from "@/components/projects/projects-section";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Proyek",
  description:
    "Proyek cybersecurity dan development — lab environment, security testing, automation tools.",
};

export default function ProjectsPage() {
  return (
    <div className="pt-16">
      <ProjectsSection projects={projects} showAll />
    </div>
  );
}
