"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CementCard } from "@/components/cement/CementCard";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { buttonClass } from "@/components/ui";
import { api } from "@/lib/api";
import type { CementProduct, Equipment, Project } from "@/lib/types";

type HomeData = {
  products: CementProduct[];
  equipment: Equipment[];
  upcoming: Project[];
  ongoing: Project[];
};

export function HomeScreen() {
  const [data, setData] = useState<HomeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api<CementProduct[]>("/api/cement/products", { auth: false }),
      api<Equipment[]>("/api/equipment", { auth: false }),
      api<Project[]>("/api/projects?status=upcoming", { auth: false }),
      api<Project[]>("/api/projects?status=ongoing", { auth: false }),
    ])
      .then(([products, equipment, upcoming, ongoing]) => {
        if (!cancelled) setData({ products, equipment, upcoming, ongoing });
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load the yard.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const available = data?.equipment.filter((item) => item.status === "Available").length;

  return (
    <>
      <section className="border-b border-line sheet-grid">
        <div className="mx-auto grid max-w-6xl items-end gap-10 px-5 py-16 lg:grid-cols-[1.4fr_0.8fr] lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">Sheet 01 — Customer yard</p>
            <h1 className="mt-4 max-w-3xl font-display text-6xl leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
              Cement for the job. Plant by the day.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink/80">
              Order cement for delivery, request mixers and scaffolding, and follow the jobs that are coming up or already on site.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cement" className={buttonClass()}>
                Browse cement
              </Link>
              <Link href="/equipment" className={buttonClass("secondary")}>
                Hire equipment
              </Link>
            </div>
          </div>
          <aside className="bg-hoarding p-6 text-paper">
            <p className="text-xs uppercase tracking-[0.18em] text-paper/60">Yard board</p>
            <dl className="mt-6 space-y-5">
              <BoardStat label="Cement lines" value={data ? String(data.products.length) : "—"} />
              <BoardStat label="Machines ready" value={data ? String(available ?? 0) : "—"} />
              <BoardStat
                label="Jobs on the board"
                value={data ? String(data.upcoming.length + data.ongoing.length) : "—"}
              />
            </dl>
            {error ? <p className="mt-6 text-sm text-[#f3c2b2]">{error}</p> : null}
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-px border-b border-line bg-line px-5 py-0 sm:grid-cols-3">
        {[
          ["01", "Pick the cement", "Each line shows its photo, unit, and the yard price."],
          ["02", "Send the order", "Delivery starts as pending. The yard confirms it."],
          ["03", "Hire the plant", "Request a machine by the day. The total is set when it comes back."],
        ].map(([index, title, body]) => (
          <div key={index} className="bg-paper px-0 py-8 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{index}</p>
            <h2 className="mt-2 font-display text-3xl">{title}</h2>
            <p className="mt-2 text-sm text-muted">{body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <SectionHead index="02" title="Cement in the yard" href="/cement" action="All cement" />
        {data ? (
          data.products.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {data.products.map((product) => (
                <CementCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-muted">No cement is listed right now.</p>
          )
        ) : (
          <p className="text-muted" role="status">
            {error ? "Cement could not be loaded." : "Loading cement…"}
          </p>
        )}
      </section>

      <section className="border-y border-line bg-sand/50">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <SectionHead index="03" title="Plant for hire" href="/equipment" action="All equipment" />
          {data ? (
            data.equipment.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3">
                {data.equipment.map((item) => (
                  <EquipmentCard key={item.id} equipment={item} />
                ))}
              </div>
            ) : (
              <p className="text-muted">No machines are listed right now.</p>
            )
          ) : (
            <p className="text-muted" role="status">
              {error ? "Equipment could not be loaded." : "Loading equipment…"}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <SectionHead index="04" title="Jobs on the board" href="/projects" action="All projects" />
        {data ? (
          <div className="grid gap-8 lg:grid-cols-2">
            <ProjectColumn title="Upcoming" projects={data.upcoming} empty="No upcoming jobs are public yet." />
            <ProjectColumn title="Ongoing" projects={data.ongoing} empty="No ongoing jobs are public yet." />
          </div>
        ) : (
          <p className="text-muted" role="status">
            {error ? "Projects could not be loaded." : "Loading projects…"}
          </p>
        )}
      </section>
    </>
  );
}

function BoardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-white/15 pb-3">
      <dt className="text-sm text-paper/70">{label}</dt>
      <dd className="font-display text-4xl leading-none tabular-nums">{value}</dd>
    </div>
  );
}

function SectionHead({ index, title, href, action }: { index: string; title: string; href: string; action: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{index}</p>
        <h2 className="font-display text-4xl sm:text-5xl">{title}</h2>
      </div>
      <Link href={href} className="text-sm font-semibold text-clay hover:underline">
        {action}
      </Link>
    </div>
  );
}

function ProjectColumn({ title, projects, empty }: { title: string; projects: Project[]; empty: string }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{title}</h3>
      {projects.length === 0 ? (
        <p className="text-muted">{empty}</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
