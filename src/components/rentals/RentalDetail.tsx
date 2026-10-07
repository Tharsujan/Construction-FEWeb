"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/RequireAuth";
import { Missing, Page, StatusBadge, buttonClass } from "@/components/ui";
import { formatDate, formatDateTime, money } from "@/lib/format";
import { useResource } from "@/lib/use-resource";
import type { Rental } from "@/lib/types";

export function RentalDetail({ id }: { id: string }) {
  return (
    <RequireAuth>
      <RentalBody id={id} />
    </RequireAuth>
  );
}

function RentalBody({ id }: { id: string }) {
  const { data, error, status, loading, reload } = useResource<Rental>(`/api/rentals/${id}`, true);

  if (loading) {
    return (
      <Page>
        <p className="text-muted" role="status">
          Loading rental…
        </p>
      </Page>
    );
  }

  if (status === 404) {
    return (
      <Missing
        title="This rental is not on your account"
        body="It may belong to someone else, or the link is wrong."
        href="/rentals"
        action="Back to my rentals"
      />
    );
  }

  if (error || !data) {
    return (
      <Page>
        <p className="font-semibold text-danger" role="alert">
          {error ?? "Could not load this rental."}
        </p>
        <button type="button" onClick={() => void reload()} className={`${buttonClass("secondary")} mt-4`}>
          Try again
        </button>
      </Page>
    );
  }

  const totalPending = data.total === 0 && (data.status === "Requested" || data.status === "Active");

  return (
    <Page>
      <Link href="/rentals" className="text-sm font-semibold text-clay hover:underline">
        All rentals
      </Link>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <StatusBadge status={data.status} />
        <StatusBadge status={data.paymentStatus} />
      </div>
      <h1 className="mt-4 font-display text-5xl leading-[0.95] sm:text-6xl">{data.equipmentName}</h1>
      <p className="mt-3 text-muted">Requested {formatDateTime(data.createdAt)}. Status is set by the yard.</p>

      <dl className="mt-8 grid gap-5 border-y border-line py-5 sm:grid-cols-2">
        <Fact label="Start" value={formatDate(data.startDate)} />
        <Fact label="Expected return" value={formatDate(data.expectedReturn)} />
        <Fact label="Actual return" value={data.actualReturn ? formatDate(data.actualReturn) : "Not returned"} />
        <Fact label="Site" value={data.siteAddress} />
        <Fact label="Daily rate" value={money(data.dailyRate)} />
        <Fact label="Deposit" value={money(data.deposit)} />
        <Fact label="Total" value={totalPending ? `${money(data.total)} until return` : money(data.total)} />
        <div>
          <dt className="text-sm text-muted">Project</dt>
          <dd className="mt-1 font-semibold">
            {data.projectId && data.projectName ? (
              <Link href={`/projects/${data.projectId}`} className="hover:text-clay">
                {data.projectName}
              </Link>
            ) : (
              "Not attached"
            )}
          </dd>
        </div>
      </dl>
      <Link href={`/equipment/${data.equipmentId}`} className={`${buttonClass("secondary")} mt-8`}>
        View machine
      </Link>
    </Page>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
