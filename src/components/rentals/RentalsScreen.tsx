"use client";

import Link from "next/link";
import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { EmptyState, FilterBar, LoadState, Page, PageHeader, StatusBadge } from "@/components/ui";
import { formatDate, money } from "@/lib/format";
import { useResource } from "@/lib/use-resource";
import type { Rental } from "@/lib/types";

const FILTERS = [
  { value: "", label: "All" },
  { value: "Requested", label: "Requested" },
  { value: "Active", label: "Active" },
  { value: "Returned", label: "Returned" },
  { value: "Cancelled", label: "Cancelled" },
];

export function RentalsScreen() {
  return (
    <RequireAuth>
      <RentalsList />
    </RequireAuth>
  );
}

function RentalsList() {
  const [status, setStatus] = useState("");
  const path = status ? `/api/rentals?status=${status}` : "/api/rentals";
  const { data, error, loading, reload } = useResource<Rental[]>(path, true);

  return (
    <Page>
      <PageHeader
        kicker="Rentals"
        title="Your hire requests"
        lede="Only rentals on this account. The yard moves them from requested to active, returned, or cancelled."
      />
      <div className="mt-8">
        <FilterBar label="Rental status" value={status} onChange={setStatus} options={FILTERS} />
      </div>
      <div className="mt-8">
        <LoadState loading={loading} error={error} onRetry={reload} label="Loading rentals…">
          {data && data.length === 0 ? (
            <EmptyState
              title={status ? "Nothing in this status" : "No rentals yet"}
              body="Request a machine from the equipment list."
              href="/equipment"
              action="Browse equipment"
            />
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {data?.map((rental) => (
                <li key={rental.id}>
                  <Link href={`/rentals/${rental.id}`} className="block py-5 hover:bg-sand/40">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={rental.status} />
                      <StatusBadge status={rental.paymentStatus} />
                    </div>
                    <h2 className="mt-3 font-display text-3xl leading-none">{rental.equipmentName}</h2>
                    <p className="mt-2 text-sm text-muted">
                      {formatDate(rental.startDate)} – {formatDate(rental.expectedReturn)}
                    </p>
                    <p className="mt-1 text-sm">{rental.siteAddress}</p>
                    <p className="mt-2 text-sm tabular-nums text-muted">
                      Deposit {money(rental.deposit)} · Total {money(rental.total)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </LoadState>
      </div>
    </Page>
  );
}
