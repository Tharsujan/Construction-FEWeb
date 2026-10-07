import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-hoarding text-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-3xl tracking-wide">SITEWORKS</p>
          <p className="mt-3 max-w-xs text-sm text-paper/75">
            Customer site for cement delivery, equipment hire, and the jobs that are upcoming or already on site.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/60">Yard</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/cement" className="hover:text-white">
                Cement
              </Link>
            </li>
            <li>
              <Link href="/equipment" className="hover:text-white">
                Equipment
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-white">
                Projects
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/60">Account</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/login" className="hover:text-white">
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-white">
                My orders
              </Link>
            </li>
            <li>
              <Link href="/rentals" className="hover:text-white">
                My rentals
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-4 text-xs text-paper/60">
          The yard sets prices, order status, and hire totals. This site shows only your own orders and rentals.
        </p>
      </div>
    </footer>
  );
}
