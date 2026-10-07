"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/RequireAuth";
import { Page, PageHeader, buttonClass } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { label } from "@/lib/format";

export function AccountScreen() {
  return (
    <RequireAuth>
      <AccountBody />
    </RequireAuth>
  );
}

function AccountBody() {
  const { user, logout } = useAuth();
  const router = useRouter();
  if (!user) return null;

  return (
    <Page>
      <PageHeader kicker="Account" title={user.name} lede="This is the customer profile stored with the yard." />
      <dl className="mt-8 grid max-w-xl gap-4 border-y border-line py-5 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted">Email</dt>
          <dd className="mt-1 font-semibold">{user.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Phone</dt>
          <dd className="mt-1 font-semibold">{user.phone || "—"}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted">Role</dt>
          <dd className="mt-1 font-semibold">{label(user.role)}</dd>
        </div>
      </dl>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/orders" className={buttonClass()}>
          My orders
        </Link>
        <Link href="/rentals" className={buttonClass("secondary")}>
          My rentals
        </Link>
        <button
          type="button"
          className={buttonClass("quiet")}
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          Sign out
        </button>
      </div>
    </Page>
  );
}
