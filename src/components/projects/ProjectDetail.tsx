"use client";

import Link from "next/link";
import { Missing, Page, StatusBadge, buttonClass } from "@/components/ui";
import { formatDate, label } from "@/lib/format";
import { useResource } from "@/lib/use-resource";
import type { Project } from "@/lib/types";

export function ProjectDetail({ id }: { id: string }) {
  const { data, error, status, loading, reload } = useResource<Project>(`/api/projects/${id}`, false);

  if (loading) {
    return (
      <Page>
        <p className="text-muted" role="status">
          Loading project…
        </p>
      </Page>
    );
  }

  if (status === 404) {
    return (
      <Missing
        title="This project is not public"
        body="It may be private, finished off the board, or the link is wrong."
        href="/projects"
        action="Back to projects"
      />
    );
  }

  if (error || !data) {
    return (
      <Page>
        <p className="font-semibold text-danger" role="alert">
          {error ?? "Could not load this project."}
        </p>
        <button type="button" onClick={() => void reload()} className={`${buttonClass("secondary")} mt-4`}>
          Try again
        </button>
      </Page>
    );
  }

  return (
    <Page>
      <Link href="/projects" className="text-sm font-semibold text-clay hover:underline">
        All projects
      </Link>
      <div className="mt-6">
        <StatusBadge status={data.status} />
      </div>
      <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[0.95] sm:text-6xl">{data.name}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">{data.summary}</p>

      <dl className="mt-8 grid gap-4 border-y border-line py-5 sm:grid-cols-3">
        <div>
          <dt className="text-sm text-muted">Location</dt>
          <dd className="mt-1 font-semibold">{data.location}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Status</dt>
          <dd className="mt-1 font-semibold">{label(data.status)}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Dates</dt>
          <dd className="mt-1 font-semibold">
            {formatDate(data.startDate)} – {formatDate(data.endDate)}
          </dd>
        </div>
      </dl>

      <h2 className="mt-8 font-display text-3xl">Description</h2>
      <p className="mt-3 max-w-3xl whitespace-pre-wrap text-lg leading-relaxed">{data.description}</p>
    </Page>
  );
}
