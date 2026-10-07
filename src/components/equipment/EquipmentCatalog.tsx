"use client";

import { useState } from "react";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { EmptyState, FilterBar, LoadState, Page, PageHeader } from "@/components/ui";
import { useResource } from "@/lib/use-resource";
import type { Equipment } from "@/lib/types";

export function EquipmentCatalog() {
  const { data, error, loading, reload } = useResource<Equipment[]>("/api/equipment", false);
  const [status, setStatus] = useState("All");
  const machines = data ?? [];
  const visible = machines.filter((item) => status === "All" || item.status === status);

  return (
    <Page>
      <PageHeader
        kicker="Equipment"
        title="Plant that is not in maintenance"
        lede="Request a rental only when the machine is available. Daily rate is set by the yard."
      />
      <LoadState loading={loading} error={error} onRetry={reload} label="Loading equipment…">
        <div className="mt-8">
          <FilterBar
            label="Equipment status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "All", label: "All" },
              { value: "Available", label: "Available" },
              { value: "Rented", label: "On hire" },
            ]}
          />
        </div>
        {machines.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="No machines listed" body="Everything may be in maintenance, or the yard has not added plant yet." />
          </div>
        ) : visible.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="Nothing in this status" body="Switch the filter to see the other machines." />
          </div>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((item) => (
              <EquipmentCard key={item.id} equipment={item} />
            ))}
          </div>
        )}
      </LoadState>
    </Page>
  );
}
