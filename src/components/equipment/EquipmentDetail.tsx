"use client";

import Link from "next/link";
import { Missing, Page, StatusBadge, buttonClass } from "@/components/ui";
import { money } from "@/lib/format";
import { useResource } from "@/lib/use-resource";
import type { Equipment } from "@/lib/types";

export function EquipmentDetail({ id }: { id: string }) {
  const { data, error, status, loading, reload } = useResource<Equipment>(`/api/equipment/${id}`, false);

  if (loading) {
    return (
      <Page>
        <p className="text-muted" role="status">
          Loading machine…
        </p>
      </Page>
    );
  }

  if (status === 404) {
    return (
      <Missing
        title="This machine is not listed"
        body="It may be in maintenance, or the link is out of date."
        href="/equipment"
        action="Back to equipment"
      />
    );
  }

  if (error || !data) {
    return (
      <Page>
        <p className="font-semibold text-danger" role="alert">
          {error ?? "Could not load this machine."}
        </p>
        <button type="button" onClick={() => void reload()} className={`${buttonClass("secondary")} mt-4`}>
          Try again
        </button>
      </Page>
    );
  }

  const available = data.status === "Available";

  return (
    <Page>
      <Link href="/equipment" className="text-sm font-semibold text-clay hover:underline">
        All equipment
      </Link>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{data.code}</p>
        <StatusBadge status={data.status} />
      </div>
      <h1 className="mt-3 font-display text-6xl leading-[0.95]">{data.name}</h1>
      <p className="mt-6 font-display text-5xl tabular-nums">{money(data.dailyRate)}</p>
      <p className="text-muted">per day</p>

      <div className="mt-8 max-w-xl border border-line bg-card p-5">
        {available ? (
          <>
            <h2 className="font-display text-3xl">Request this machine</h2>
            <p className="mt-2 text-sm text-muted">
              You choose the dates, the site, and a deposit. The hire total stays at zero until the yard marks the machine returned.
            </p>
            <Link href={`/equipment/${data.id}/rent`} className={`${buttonClass()} mt-5`}>
              Request rental
            </Link>
          </>
        ) : (
          <>
            <h2 className="font-display text-3xl">Out on hire</h2>
            <p className="mt-2 text-sm text-muted">A rental request is only open while the status is available.</p>
          </>
        )}
      </div>
    </Page>
  );
}
