"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";
import type { Project } from "@/data/projects";

interface ProjectsSectionProps {
  projects: Project[];
  showAll?: boolean;
}

export function ProjectsSection({ projects, showAll = false }: ProjectsSectionProps) {
  const displayed = showAll ? projects : projects.slice(0, 4);

  return (
    <section id="projects" className="relative px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionReveal>
          <div className="mb-14">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Projects
            </span>
            <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-tight text-[var(--color-text-primary)]">
              Things I&apos;ve worked on.
            </h2>
          </div>
        </SectionReveal>

        <div className="grid gap-px overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-border)]">
          {displayed.map((project, i) => (
            <SectionReveal key={project.title} delay={i * 0.06}>
              <div className="group flex flex-col justify-between gap-4 bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-hover)] sm:flex-row sm:items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
                      {project.title}
                    </h3>
                    {project.link && (
                      <ArrowUpRight
                        size={14}
                        className="text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-text-primary)]"
                      />
                    )}
                  </div>
                  <p className="max-w-lg text-[13px] leading-relaxed text-[var(--color-text-secondary)]">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-[var(--color-surface-elevated)] px-2 py-0.5 text-[11px] text-[var(--color-text-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>

        {!showAll && (
          <SectionReveal delay={0.3}>
            <div className="mt-8 text-center">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              >
                View all projects
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </SectionReveal>
        )}
      </div>
    </section>
  );
}
