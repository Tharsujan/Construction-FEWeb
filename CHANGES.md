# Changes

The `construction-feweb` folder was empty. This change adds the public customer site for the construction yard API.

Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 4.

The browser calls same-origin `/api/...`. Next.js proxies those calls to `http://localhost:5205` (override with `API_PROXY_TARGET`). Signed-in calls send `Authorization: Bearer <token>`. The token is stored in the browser as `siteworks.token`.

## Run

1. Start the API on port `5205`.
2. In this folder, run `npm run dev`.
3. Open `http://localhost:3000`.

Local customer account:

- Email: `client@construction.local`
- Password: `Client@12345`

## Pages added

| Route | Who can open it | What it does |
| --- | --- | --- |
| `/` | Public | Home: cement, equipment, upcoming jobs, ongoing jobs |
| `/cement` | Public | Active cement products. Photo, unit name, and price. Search by name |
| `/cement/[id]` | Public | Product photo, `unitName`, and price. Add to cart is hidden when stock is 0 |
| `/cart` | Public | Local cart. Quantity cannot go above current yard stock |
| `/checkout` | Signed in | Delivery address. Posts the order. The API sets the total |
| `/orders` | Signed in | This customer's orders. Filter by status |
| `/orders/[id]` | Signed in | One order and its lines. Another customer's order is not shown |
| `/equipment` | Public | Machines that are not in maintenance |
| `/equipment/[id]` | Public | Daily rate and status. Rental request only when status is `Available` |
| `/equipment/[id]/rent` | Signed in | Rental request: dates, site address, deposit |
| `/rentals` | Signed in | This customer's rentals. Filter by status |
| `/rentals/[id]` | Signed in | One rental. Total stays `Rs 0.00` until the yard marks it returned |
| `/projects` | Public | Two sections: upcoming (`Planned`) and ongoing (`InProgress`) |
| `/projects/[id]` | Public | Description, location, status, and dates |
| `/login` | Public | Sign in. Returns to the page that asked for an account |
| `/register` | Public | Name, email, phone, password (at least 6 characters) |
| `/account` | Signed in | Name, email, phone, role. Sign out |

## API used

Base shape of every response: `{ success, message, data }`.

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` on load when a token exists. A `401` clears the token and opens login
- `GET /api/cement/products`
- `GET /api/cement/products/{id}`
- `POST /api/cement/orders`
- `GET /api/cement/orders` and `?status=`
- `GET /api/cement/orders/{id}`
- `GET /api/equipment`
- `GET /api/equipment/{id}`
- `POST /api/rentals`
- `GET /api/rentals` and `?status=`
- `GET /api/rentals/{id}`
- `GET /api/projects?status=upcoming`
- `GET /api/projects?status=ongoing`
- `GET /api/projects/{id}`

Dates sent to the API are `YYYY-MM-DD`. Money is shown as `Rs`.

## Rules kept

- The customer does not change order or rental status.
- The customer does not send a price. The API calculates the cement total.
- A rental `expectedReturn` must be on or after `startDate`. Deposit may be `0`.
- Project pages do not show workers, wages, cement orders, or rentals.
- Order and rental lists are only the signed-in customer's records.

## Files

- `src/app` — routes
- `src/components` — screens, header, footer
- `src/lib` — API client, auth, cart, types
- `next.config.ts` — `/api` proxy to the yard API
- `.env.example` — `API_PROXY_TARGET`
