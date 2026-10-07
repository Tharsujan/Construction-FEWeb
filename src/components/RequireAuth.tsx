"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonClass, Page, PageHeader } from "./ui";
import { useAuth } from "@/lib/auth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, ready, profileError, refresh } = useAuth();
  const pathname = usePathname();

  if (!ready) {
    return (
      <Page>
        <p className="text-muted" role="status">
          Checking your account…
        </p>
      </Page>
    );
  }

  if (profileError && !user) {
    return (
      <Page>
        <PageHeader kicker="Account" title="Could not confirm your sign-in" lede={profileError} />
        <button type="button" onClick={() => void refresh()} className={`${buttonClass()} mt-8`}>
          Try again
        </button>
      </Page>
    );
  }

  if (!user) {
    const next = encodeURIComponent(pathname);
    return (
      <Page>
        <PageHeader
          kicker="Account"
          title="Sign in to continue"
          lede="Orders, rental requests, and your account stay with the signed-in customer."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/login?next=${next}`} className={buttonClass()}>
            Sign in
          </Link>
          <Link href={`/register?next=${next}`} className={buttonClass("secondary")}>
            Create an account
          </Link>
        </div>
      </Page>
    );
  }

  return children;
}
