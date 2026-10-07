"use client";

import { useState } from "react";
import { CementCard } from "@/components/cement/CementCard";
import { EmptyState, LoadState, Page, PageHeader, inputClass } from "@/components/ui";
import { useResource } from "@/lib/use-resource";
import type { CementProduct } from "@/lib/types";

export function CementCatalog() {
  const { data, error, loading, reload } = useResource<CementProduct[]>("/api/cement/products", false);
  const [query, setQuery] = useState("");
  const products = data ?? [];

  const visible = products.filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <Page>
      <PageHeader
        kicker="Cement"
        title="What is in the yard"
        lede="Active products only. The card shows the photo, the unit name, and the price the yard charges. Out-of-stock lines stay visible, without an add button."
      />
      <LoadState loading={loading} error={error} onRetry={reload} label="Loading cement…">
        <div className="mt-8 flex justify-end">
          <label className="block w-full sm:max-w-xs">
            <span className="sr-only">Search cement</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name"
              className={inputClass}
            />
          </label>
        </div>

        {products.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="The yard is empty" body="No active cement products are listed right now." />
          </div>
        ) : visible.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="No match" body="Clear the search to see the full list." />
          </div>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((product) => (
              <CementCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </LoadState>
    </Page>
  );
}
