# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Easy Ride" — a ride-hailing demo app (Uber-style), **rider side only**. The driver app is a separate sibling project at `../uber-driver-app` (not in this repo) that shares the same Postgres database and `user`/`drivers`/`rides` tables. Driver accounts are created there, and a real driver in that app is what accepts/declines ride offers and updates ride status — this repo's server-side dispatch simulation (`server/lib/dispatch.js`) only handles the offer/matching step, not trip progression once a driver has accepted.

## Commands

- `npm run dev` — start the app in development (Express + Vite middleware mode, single process, port 3000). Loads env vars from `.env` via `--env-file`.
- `npm run build` — Vite production build of `src/` to `dist/`.
- `npm start` — run the production server (serves `dist/` as static files). Requires `npm run build` first.

There is no test suite, lint command, or type checker configured in `package.json`.

Required env vars (see `.env.example`): `DATABASE_URL` (Postgres, e.g. Neon), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `PORT`.

## Architecture

**Single Express process for both API and frontend.** `server/index.js` mounts Better Auth at `/api/auth/*` (before `express.json()` — Better Auth reads the raw body itself), then the API routers under `/api/*`, then either Vite in middleware mode (dev) or the built `dist/` as static files with an SPA catch-all (prod).

**Auth is Better Auth (`server/auth.js`)**, backed directly by the `pg` pool — no separate ORM/session store. `requireAuth` middleware in the same file resolves the session from cookies and attaches `req.user`. The `user` table and its migrations come from Better Auth itself (`getMigrations` in `server/schema.js`); app-specific tables (`drivers`, `favorites`, `rides`) are created with raw `CREATE TABLE IF NOT EXISTS` in `ensureSchema()`, run once at server startup. `drivers.id` is a 1:1 FK to `user.id` — driver profile data joins onto the shared user table (see `RIDE_WITH_DRIVER_SELECT` in `server/routes/rides.js`).

**Frontend auth signup flow is partially cosmetic**: the OTP verification step (`src/pages/auth/VerifyOtp.jsx`) accepts any 4 digits and does not call the server — it exists purely for UI flow. The actual account is created in one shot at the end of the flow (`CompleteProfile.jsx`, calling `signUp.email(...)`), after which the shared `useSession()` store must be manually refetched via `authClient.getSession()` before navigating, since `PrivateRoute` reads that same cached session.

**Ride dispatch is polling-driven, not push-based.** `server/lib/dispatch.js`'s `ensureOffered(rideId)` is the *only* place that assigns/advances a driver offer, and it's called both on ride creation and on every `GET /api/rides/:id`. This means the rider's own polling (`RideTracking.jsx`, every 2s) is what drives the matching state machine forward — there is no background job. `ensureOffered` locks the ride row `FOR UPDATE` and selects candidate drivers with `FOR UPDATE SKIP LOCKED` so concurrent calls never double-assign a driver. An offer expires after `OFFER_WINDOW_SECONDS` (15s); expiry is treated as an implicit decline and the driver is added to `declined_driver_ids` so they aren't re-offered the same ride.

**Ride status vs. UI phase are different vocabularies.** DB/API `status` values (`requested`, `matched`, `arrived`, `in_progress`, `completed`, `cancelled`) are mapped to rider-facing `phase` values (`searching`, `driver_assigned`, `arrived_pickup`, `in_progress`, `completed`, `cancelled`) via `STATUS_TO_PHASE` in `server/routes/rides.js`. Frontend code should generally branch on `phase`.

**In-trip driver position is simulated, not real GPS.** Once a ride is `in_progress`, `computeDriverPosition` (in `rides.js`) ignores the driver's stored lat/lng and instead animates a straight-line interpolation from pickup to dropoff using `tripAnimationFraction` (`server/lib/geo.js`), quantized to 5-second steps so it "hops" in sync with the rider's poll cadence rather than gliding continuously. Trip duration is derived from a fixed demo speed (25 km/h), capped between 10s and 120s regardless of actual distance.

**Distance/fare** are computed with a haversine great-circle distance multiplied by a fixed road-winding factor (`routeDistanceKm` in `server/lib/geo.js`) — there's no real routing/mapping API involved. Vehicle types and their fare formulas (`baseFare + perKmRate * distanceKm`) live in `server/lib/vehicleTypes.js` and are also served as-is via `GET /api/vehicle-types` for the frontend vehicle picker.

**Geocoding proxies LocationIQ** (`server/routes/geocode.js`, requires `LOCATIONIQ_API_KEY`) rather than calling it from the browser, to keep the key server-side. It was originally a direct proxy to OpenStreetMap Nominatim, but Nominatim's public instance rate-limits/blocks shared hosting IPs (confirmed in production: 429s from Render's IP despite low request volume) — LocationIQ is OSM-data-based with the same `display_name`/`lat`/`lon` response shape, just on infrastructure meant for production traffic.

**Route protection**: almost every screen after onboarding is wrapped in `<PrivateRoute>` (`src/components/PrivateRoute.jsx`), which redirects to `/signin` unless `useSession()` has a user. All routes are declared centrally in `src/App.jsx`.

**Ride draft state** (pickup/dropoff/vehicle/payment method, mid-booking before a ride is created) lives in React context (`src/context/RideContext.jsx`), separate from the in-progress signup form state (`src/context/SignupContext.jsx`). Neither persists across reloads.

**Styling**: Tailwind with a custom design-token palette (`primary` yellow, `ink` text scale, `surface` backgrounds, semantic `success`/`warning`/`danger`) defined in `tailwind.config.js` — prefer these tokens over raw colors/hex values in new UI code.

**Receipts** are generated server-side as PDFs on demand (`GET /api/rides/:id/receipt`, in `server/routes/rides.js`) using `pdfkit`, not pre-rendered or stored.
