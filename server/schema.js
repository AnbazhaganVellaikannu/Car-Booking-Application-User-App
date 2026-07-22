import { getMigrations } from 'better-auth/db/migration';
import { auth } from './auth.js';
import { pool } from './db.js';

export async function ensureSchema() {
  const { runMigrations } = await getMigrations(auth.options);
  await runMigrations();

  // One-time transition away from the old mock-seeded drivers table (free-
  // standing fake rows) to real driver profiles linked 1:1 to a user
  // account, registered from the separate driver app. Detected by the old
  // table's now-removed `name` column; safe to run repeatedly.
  const { rows: oldShape } = await pool.query(`
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'name'
  `);
  if (oldShape.length > 0) {
    await pool.query('DROP TABLE IF EXISTS rides CASCADE');
    await pool.query('DROP TABLE IF EXISTS drivers CASCADE');
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS drivers (
      id               TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
      vehicle_type     TEXT NOT NULL,
      vehicle_make     TEXT NOT NULL,
      vehicle_model    TEXT NOT NULL,
      vehicle_plate    TEXT NOT NULL,
      vehicle_color    TEXT NOT NULL,
      rating           NUMERIC NOT NULL DEFAULT 5.0,
      lat              DOUBLE PRECISION,
      lng              DOUBLE PRECISION,
      status           TEXT NOT NULL DEFAULT 'offline',
      created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id               TEXT PRIMARY KEY,
      user_id          TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      label            TEXT NOT NULL,
      address          TEXT NOT NULL,
      lat              DOUBLE PRECISION NOT NULL,
      lng              DOUBLE PRECISION NOT NULL,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS rides (
      id                   TEXT PRIMARY KEY,
      user_id              TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      driver_id            TEXT REFERENCES drivers(id),
      offered_driver_id    TEXT REFERENCES drivers(id),
      offer_expires_at     TIMESTAMPTZ,
      declined_driver_ids  TEXT[] NOT NULL DEFAULT '{}',
      vehicle_type         TEXT NOT NULL,
      pickup_address       TEXT NOT NULL,
      pickup_lat           DOUBLE PRECISION NOT NULL,
      pickup_lng           DOUBLE PRECISION NOT NULL,
      dropoff_address      TEXT NOT NULL,
      dropoff_lat          DOUBLE PRECISION NOT NULL,
      dropoff_lng          DOUBLE PRECISION NOT NULL,
      distance_km          NUMERIC NOT NULL,
      estimated_fare       NUMERIC NOT NULL,
      payment_method       TEXT NOT NULL DEFAULT 'cash',
      status               TEXT NOT NULL DEFAULT 'requested',
      rating               INTEGER,
      rating_comment       TEXT,
      requested_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
      matched_at           TIMESTAMPTZ,
      arrived_at           TIMESTAMPTZ,
      started_at           TIMESTAMPTZ,
      completed_at         TIMESTAMPTZ,
      cancelled_at         TIMESTAMPTZ
    );

    CREATE INDEX IF NOT EXISTS idx_rides_user ON rides (user_id, requested_at DESC);
    CREATE INDEX IF NOT EXISTS idx_rides_driver ON rides (driver_id, requested_at DESC);
    CREATE INDEX IF NOT EXISTS idx_rides_offered_driver ON rides (offered_driver_id) WHERE status = 'requested';
  `);
}
