import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectDetail } from "@/components/projects/ProjectDetail";

export const metadata: Metadata = { title: "Project" };

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="mx-auto max-w-6xl px-5 py-16 text-muted">Loading project…</p>}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectDetail id={id} />;
}
