import { pool } from '../db.js';

export const OFFER_WINDOW_SECONDS = 15;

// Advances a 'requested' ride's driver offer: if there's no current offer,
// or the current one expired without a response, picks the next eligible
// available driver (excluding anyone who already declined or timed out)
// and offers it to them. Safe to call repeatedly and concurrently — the
// ride row is locked FOR UPDATE for the duration, and SKIP LOCKED on the
// driver candidate query means two rides never race for the same driver.
//
// This is intentionally the *only* place dispatch decisions are made, so
// rider polling (GET /api/rides/:id) is what actually drives the offer
// cycle forward; the driver app only reads/accepts/declines what it's
// offered.
export async function ensureOffered(rideId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query('SELECT * FROM rides WHERE id = $1 FOR UPDATE', [rideId]);
    const ride = rows[0];
    if (!ride || ride.status !== 'requested') {
      await client.query('COMMIT');
      return ride;
    }

    const offerStillLive = ride.offered_driver_id && new Date(ride.offer_expires_at).getTime() > Date.now();
    if (offerStillLive) {
      await client.query('COMMIT');
      return ride;
    }

    // The previous offer (if any) expired without a response — treat that
    // as an implicit decline so we don't re-offer the same driver forever.
    const declined = ride.offered_driver_id
      ? [...ride.declined_driver_ids, ride.offered_driver_id]
      : ride.declined_driver_ids;

    const { rows: candidates } = await client.query(
      `SELECT id FROM drivers
       WHERE vehicle_type = $1 AND status = 'available' AND NOT (id = ANY($2::text[]))
       ORDER BY random() LIMIT 1 FOR UPDATE SKIP LOCKED`,
      [ride.vehicle_type, declined]
    );

    const nextDriverId = candidates[0]?.id || null;
    const { rows: updated } = await client.query(
      `UPDATE rides SET
         declined_driver_ids = $2,
         offered_driver_id = $3,
         offer_expires_at = $4
       WHERE id = $1 RETURNING *`,
      [
        rideId,
        declined,
        nextDriverId,
        nextDriverId ? new Date(Date.now() + OFFER_WINDOW_SECONDS * 1000) : null,
      ]
    );

    await client.query('COMMIT');
    return updated[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
