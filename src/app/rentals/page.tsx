import type { Metadata } from "next";
import { Suspense } from "react";
import { RentalsScreen } from "@/components/rentals/RentalsScreen";

export const metadata: Metadata = { title: "My rentals" };

export default function RentalsPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-6xl px-5 py-16 text-muted">Loading rentals…</p>}>
      <RentalsScreen />
    </Suspense>
  );
}
