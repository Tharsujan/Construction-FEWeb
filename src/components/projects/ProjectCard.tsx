import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Project } from "@/lib/types";
import { StatusBadge } from "@/components/ui";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="border border-line bg-card p-5">
      <StatusBadge status={project.status} />
      <h2 className="mt-3 font-display text-3xl leading-none">
        <Link href={`/projects/${project.id}`} className="hover:text-clay">
          {project.name}
        </Link>
      </h2>
      <p className="mt-3 text-muted">{project.summary}</p>
      <p className="mt-4 text-sm font-semibold">{project.location}</p>
      <p className="text-sm text-muted">
        {formatDate(project.startDate)} – {formatDate(project.endDate)}
      </p>
    </article>
  );
}
