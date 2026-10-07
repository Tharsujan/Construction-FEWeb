"use client";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { EmptyState, LoadState, Page, PageHeader } from "@/components/ui";
import { useResource } from "@/lib/use-resource";
import type { Project } from "@/lib/types";

export function ProjectsScreen() {
  const upcoming = useResource<Project[]>("/api/projects?status=upcoming", false);
  const ongoing = useResource<Project[]>("/api/projects?status=ongoing", false);
  const loading = upcoming.loading || ongoing.loading;
  const error = upcoming.error ?? ongoing.error;

  return (
    <Page>
      <PageHeader
        kicker="Projects"
        title="Upcoming and ongoing"
        lede="Public jobs only. This page shows the work, the place, and the dates."
      />
      <div className="mt-10">
        <LoadState
          loading={loading}
          error={error}
          onRetry={() => {
            void upcoming.reload();
            void ongoing.reload();
          }}
          label="Loading projects…"
        >
          <div className="grid gap-10 lg:grid-cols-2">
            <Column title="Upcoming" projects={upcoming.data ?? []} empty="No upcoming jobs are public yet." />
            <Column title="Ongoing" projects={ongoing.data ?? []} empty="No ongoing jobs are public yet." />
          </div>
        </LoadState>
      </div>
    </Page>
  );
}

function Column({ title, projects, empty }: { title: string; projects: Project[]; empty: string }) {
  return (
    <section>
      <h2 className="font-display text-4xl">{title}</h2>
      {projects.length === 0 ? (
        <div className="mt-4">
          <EmptyState title={empty} body="When the yard marks a job public, it will appear in this column." />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
