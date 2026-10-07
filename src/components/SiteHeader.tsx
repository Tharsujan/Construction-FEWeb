"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";

const LINKS = [
  { href: "/cement", label: "Cement" },
  { href: "/equipment", label: "Equipment" },
  { href: "/projects", label: "Projects" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderFallback() {
  return (
    <div className="border-b border-line bg-paper">
      <div className="bg-hoarding px-5 py-2 text-xs uppercase tracking-[0.18em] text-paper/80">Siteworks customer yard</div>
      <div className="hazard-bar" />
      <div className="mx-auto flex h-16 max-w-6xl items-center px-5">
        <span className="font-display text-3xl tracking-wide">SITEWORKS</span>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const cart = useCart();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [accountPath, setAccountPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  const accountOpen = accountPath === pathname;

  useEffect(() => {
    if (!open && !accountOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuPath(null);
        setAccountPath(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, accountOpen]);

  function signOut() {
    logout();
    setAccountPath(null);
    setMenuPath(null);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="bg-hoarding">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2 text-[11px] uppercase tracking-[0.18em] text-paper/80">
          <span>Customer yard</span>
          <span className="hidden sm:inline">Cement · Plant hire · Public jobs</span>
        </div>
      </div>
      <div className="hazard-bar" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="font-display text-3xl tracking-wide text-ink">
          SITEWORKS
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={`text-sm font-semibold tracking-wide ${isActive(pathname, link.href) ? "text-clay" : "text-ink hover:text-clay"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative text-sm font-semibold tracking-wide hover:text-clay" aria-label="Cart">
            Cart
            {cart.ready && cart.count > 0 ? (
              <span className="ml-1 inline-flex min-w-5 items-center justify-center bg-clay px-1.5 text-xs text-card">
                {cart.count}
              </span>
            ) : null}
          </Link>

          <div className="relative hidden md:block">
            {!ready ? (
              <span className="text-sm text-muted">Account</span>
            ) : user ? (
              <>
                <button
                  type="button"
                  className="text-sm font-semibold tracking-wide hover:text-clay"
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  onClick={() => setAccountPath(accountOpen ? null : pathname)}
                >
                  {user.name}
                </button>
                {accountOpen ? (
                  <div role="menu" className="absolute right-0 mt-3 w-52 border border-line bg-card p-2">
                    <AccountLink href="/orders">My orders</AccountLink>
                    <AccountLink href="/rentals">My rentals</AccountLink>
                    <AccountLink href="/account">Account</AccountLink>
                    <button type="button" role="menuitem" onClick={signOut} className="block w-full px-3 py-2 text-left text-sm hover:bg-sand">
                      Sign out
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <Link href="/login" className="text-sm font-semibold tracking-wide hover:text-clay">
                Sign in
              </Link>
            )}
          </div>

          <button
            type="button"
            className="border border-line px-3 py-1.5 text-sm font-semibold md:hidden"
            aria-expanded={open}
            onClick={() => setMenuPath(open ? null : pathname)}
          >
            Menu
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-line bg-card px-5 py-4 md:hidden" aria-label="Mobile">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="py-2 text-lg font-semibold">
                {link.label}
              </Link>
            ))}
            <Link href="/cart" className="py-2 text-lg font-semibold">
              Cart{cart.ready && cart.count > 0 ? ` (${cart.count})` : ""}
            </Link>
            {user ? (
              <>
                <Link href="/orders" className="py-2 text-lg font-semibold">
                  My orders
                </Link>
                <Link href="/rentals" className="py-2 text-lg font-semibold">
                  My rentals
                </Link>
                <Link href="/account" className="py-2 text-lg font-semibold">
                  Account
                </Link>
                <button type="button" onClick={signOut} className="py-2 text-left text-lg font-semibold">
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" className="py-2 text-lg font-semibold">
                Sign in
              </Link>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function AccountLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} role="menuitem" className="block px-3 py-2 text-sm hover:bg-sand">
      {children}
    </Link>
  );
}
