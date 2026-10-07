"use client";

import { useState } from "react";

export function ProductImage({ imageUrl, name }: { imageUrl: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const src = imageUrl.trim();

  if (!src || failed) {
    return (
      <div
        className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 bg-sand text-muted"
        role="img"
        aria-label={`${name}, no photo`}
      >
        <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true">
          <rect x="18" y="16" width="28" height="36" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M18 24h28M24 16v-4h16v4" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="text-xs font-semibold uppercase tracking-[0.16em]">No photo</span>
      </div>
    );
  }

  return (
    // Product photos come from whatever URL the yard stores, so they stay as a plain image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      className="aspect-[4/3] w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}
