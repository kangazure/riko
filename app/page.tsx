import { Hero } from "@/components/hero/hero";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ProjectsSection } from "@/components/projects/projects-section";
import { BlogSection } from "@/components/blog/blog-section";
import { ContactSection } from "@/components/sections/contact-section";
import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blog";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection projects={projects} />
      <BlogSection posts={blogPosts} />
      <ContactSection />
    </>
  );
}
