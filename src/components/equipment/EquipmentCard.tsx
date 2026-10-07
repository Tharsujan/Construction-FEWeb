import Link from "next/link";
import { money } from "@/lib/format";
import type { Equipment } from "@/lib/types";
import { StatusBadge, buttonClass } from "@/components/ui";

export function EquipmentCard({ equipment }: { equipment: Equipment }) {
  return (
    <article className="flex h-full flex-col border border-line bg-card">
      <div className="h-1.5 bg-hoarding" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{equipment.code}</p>
          <StatusBadge status={equipment.status} />
        </div>
        <h2 className="mt-3 font-display text-3xl leading-none">
          <Link href={`/equipment/${equipment.id}`} className="hover:text-clay">
            {equipment.name}
          </Link>
        </h2>
        <p className="mt-6 font-display text-3xl tabular-nums">{money(equipment.dailyRate)}</p>
        <p className="text-sm text-muted">per day</p>
        <Link href={`/equipment/${equipment.id}`} className={`${buttonClass("quiet")} mt-6 self-start`}>
          View machine
        </Link>
      </div>
    </article>
  );
}
