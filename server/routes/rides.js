import { Router } from 'express';
import { randomUUID } from 'crypto';
import PDFDocument from 'pdfkit';
import { pool } from '../db.js';
import { requireAuth } from '../auth.js';
import { ah } from '../lib/asyncHandler.js';
import { getVehicleType } from '../lib/vehicleTypes.js';
import { routeDistanceKm, tripAnimationFraction } from '../lib/geo.js';
import { ensureOffered } from '../lib/dispatch.js';

export const ridesRouter = Router();
ridesRouter.use(requireAuth);

function isFiniteNum(n) {
  return typeof n === 'number' && Number.isFinite(n);
}

const STATUS_TO_PHASE = {
  requested: 'searching',
  matched: 'driver_assigned',
  arrived: 'arrived_pickup',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
};

function computeDriverPosition(ride, driver) {
  // Once the trip is under way, animate a simulated position from pickup to
  // dropoff instead of the driver's real (usually stationary, in a demo)
  // GPS — see tripAnimationFraction for the 5-second step cadence.
  if (ride.status === 'in_progress' && ride.started_at) {
    const fraction = tripAnimationFraction(ride.started_at, Number(ride.distance_km));
    return {
      lat: ride.pickup_lat + (ride.dropoff_lat - ride.pickup_lat) * fraction,
      lng: ride.pickup_lng + (ride.dropoff_lng - ride.pickup_lng) * fraction,
    };
  }
  return driver.lat != null && driver.lng != null ? { lat: driver.lat, lng: driver.lng } : null;
}

function serializeRide(ride, driver) {
  return {
    id: ride.id,
    status: ride.status,
    phase: STATUS_TO_PHASE[ride.status] || ride.status,
    vehicleType: ride.vehicle_type,
    pickup: { address: ride.pickup_address, lat: ride.pickup_lat, lng: ride.pickup_lng },
    dropoff: { address: ride.dropoff_address, lat: ride.dropoff_lat, lng: ride.dropoff_lng },
    distanceKm: Number(ride.distance_km),
    estimatedFare: Number(ride.estimated_fare),
    paymentMethod: ride.payment_method,
    rating: ride.rating,
    ratingComment: ride.rating_comment,
    requestedAt: ride.requested_at,
    matchedAt: ride.matched_at,
    arrivedAt: ride.arrived_at,
    startedAt: ride.started_at,
    completedAt: ride.completed_at,
    cancelledAt: ride.cancelled_at,
    offerExpiresAt: ride.offer_expires_at,
    driver: driver
      ? {
          id: driver.id,
          name: driver.name,
          rating: Number(driver.rating),
          vehicleMake: driver.vehicle_make,
          vehicleModel: driver.vehicle_model,
          vehiclePlate: driver.vehicle_plate,
          vehicleColor: driver.vehicle_color,
          phone: driver.phone,
          position: computeDriverPosition(ride, driver),
        }
      : null,
  };
}

const RIDE_WITH_DRIVER_SELECT = `
  SELECT r.*, d.id AS d_id, u.name AS d_name, d.rating AS d_rating, d.vehicle_make AS d_vehicle_make,
         d.vehicle_model AS d_vehicle_model, d.vehicle_plate AS d_vehicle_plate, d.vehicle_color AS d_vehicle_color,
         u.phone AS d_phone, d.lat AS d_lat, d.lng AS d_lng
  FROM rides r
  LEFT JOIN drivers d ON d.id = r.driver_id
  LEFT JOIN "user" u ON u.id = d.id
`;

function splitDriver(row) {
  const driver = row.d_id
    ? {
        id: row.d_id, name: row.d_name, rating: row.d_rating, vehicle_make: row.d_vehicle_make,
        vehicle_model: row.d_vehicle_model, vehicle_plate: row.d_vehicle_plate, vehicle_color: row.d_vehicle_color,
        phone: row.d_phone, lat: row.d_lat, lng: row.d_lng,
      }
    : null;
  return { ride: row, driver };
}

async function fetchRideAndDriver(rideId, userId) {
  const { rows } = await pool.query(`${RIDE_WITH_DRIVER_SELECT} WHERE r.id = $1 AND r.user_id = $2`, [rideId, userId]);
  if (rows.length === 0) return null;
  return splitDriver(rows[0]);
}

ridesRouter.post('/', ah(async (req, res) => {
  const { vehicleType, pickup, dropoff, paymentMethod } = req.body || {};
  const vt = getVehicleType(vehicleType);
  if (!vt) return res.status(400).json({ error: 'Unknown vehicle type' });
  if (!pickup || !dropoff || !isFiniteNum(pickup.lat) || !isFiniteNum(pickup.lng) ||
      !isFiniteNum(dropoff.lat) || !isFiniteNum(dropoff.lng) || !pickup.address || !dropoff.address) {
    return res.status(400).json({ error: 'Valid pickup and dropoff locations are required' });
  }
  if (!['cash', 'card', 'wallet'].includes(paymentMethod)) {
    return res.status(400).json({ error: 'Invalid payment method' });
  }

  const distanceKm = routeDistanceKm(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
  const estimatedFare = Math.round(vt.baseFare + vt.perKmRate * distanceKm);
  const rideId = randomUUID();

  await pool.query(
    `INSERT INTO rides
      (id, user_id, vehicle_type, pickup_address, pickup_lat, pickup_lng,
       dropoff_address, dropoff_lat, dropoff_lng, distance_km, estimated_fare, payment_method, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'requested')`,
    [
      rideId, req.user.id, vehicleType,
      pickup.address, pickup.lat, pickup.lng,
      dropoff.address, dropoff.lat, dropoff.lng,
      distanceKm, estimatedFare, paymentMethod,
    ]
  );

  // Make the first driver offer immediately so the rider isn't stuck on
  // "searching" for a full poll cycle before anything happens.
  await ensureOffered(rideId);

  const found = await fetchRideAndDriver(rideId, req.user.id);
  res.status(201).json(serializeRide(found.ride, found.driver));
}));

ridesRouter.get('/', ah(async (req, res) => {
  const filter = req.query.status;
  let where = 'WHERE r.user_id = $1';
  if (filter === 'upcoming') where += ` AND r.status IN ('requested','matched','arrived','in_progress')`;
  else if (filter === 'completed') where += ` AND r.status = 'completed'`;
  else if (filter === 'cancelled') where += ` AND r.status = 'cancelled'`;

  const { rows } = await pool.query(
    `${RIDE_WITH_DRIVER_SELECT} ${where} ORDER BY r.requested_at DESC LIMIT 100`,
    [req.user.id]
  );
  res.json(rows.map((row) => { const { ride, driver } = splitDriver(row); return serializeRide(ride, driver); }));
}));

ridesRouter.get('/:id', ah(async (req, res) => {
  await ensureOffered(req.params.id).catch(() => {}); // no-op if not this user's or not 'requested'
  const found = await fetchRideAndDriver(req.params.id, req.user.id);
  if (!found) return res.status(404).json({ error: 'Ride not found' });
  res.json(serializeRide(found.ride, found.driver));
}));

ridesRouter.post('/:id/cancel', ah(async (req, res) => {
  const found = await fetchRideAndDriver(req.params.id, req.user.id);
  if (!found) return res.status(404).json({ error: 'Ride not found' });
  if (!['requested', 'matched', 'arrived'].includes(found.ride.status)) {
    return res.status(409).json({ error: 'This ride can no longer be cancelled' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `UPDATE rides SET status = 'cancelled', cancelled_at = now()
       WHERE id = $1 AND status IN ('requested','matched','arrived') RETURNING *`,
      [req.params.id]
    );
    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'This ride can no longer be cancelled' });
    }
    if (found.ride.driver_id) {
      await client.query(`UPDATE drivers SET status = 'available' WHERE id = $1`, [found.ride.driver_id]);
    }
    await client.query('COMMIT');
    res.json(serializeRide(rows[0], found.driver));
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}));

ridesRouter.post('/:id/rate', ah(async (req, res) => {
  const { rating, comment } = req.body || {};
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be an integer from 1 to 5' });
  }
  const found = await fetchRideAndDriver(req.params.id, req.user.id);
  if (!found) return res.status(404).json({ error: 'Ride not found' });
  if (found.ride.status !== 'completed') {
    return res.status(409).json({ error: 'Only completed rides can be rated' });
  }

  const { rows } = await pool.query(
    `UPDATE rides SET rating = $1, rating_comment = $2 WHERE id = $3 RETURNING *`,
    [rating, comment || null, req.params.id]
  );
  res.json(serializeRide(rows[0], found.driver));
}));

ridesRouter.get('/:id/receipt', ah(async (req, res) => {
  const found = await fetchRideAndDriver(req.params.id, req.user.id);
  if (!found) return res.status(404).json({ error: 'Ride not found' });
  if (found.ride.status !== 'completed') {
    return res.status(409).json({ error: 'A receipt is only available once the trip is completed' });
  }

  const { ride, driver } = found;
  const vt = getVehicleType(ride.vehicle_type);
  const baseFare = vt?.baseFare ?? 0;
  const distanceFare = Math.max(0, Number(ride.estimated_fare) - baseFare);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="easyride-receipt-${ride.id.slice(0, 8)}.pdf"`);

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(res);

  const ink = '#1A1A1A';
  const soft = '#6B6B6B';
  const primary = '#FEC400';

  doc.rect(0, 0, doc.page.width, 90).fill(primary);
  doc.fillColor(ink).fontSize(24).font('Helvetica-Bold').text('Easy Ride', 50, 32);
  doc.fontSize(11).font('Helvetica').text('Trip Receipt', 50, 60);

  doc.fillColor(ink).fontSize(10).font('Helvetica').text(
    `Receipt #${ride.id.slice(0, 8).toUpperCase()}`,
    50, 110
  );
  doc.fillColor(soft).text(
    `${new Date(ride.completed_at).toLocaleString()}`,
    50, 126
  );

  let y = 165;
  doc.fillColor(ink).font('Helvetica-Bold').fontSize(12).text('Trip Details', 50, y);
  y += 22;

  const row = (label, value) => {
    doc.font('Helvetica').fontSize(10).fillColor(soft).text(label, 50, y);
    doc.font('Helvetica').fontSize(10).fillColor(ink).text(value, 220, y, { width: 325, align: 'left' });
    y += 20;
  };

  row('Rider', req.user.name || req.user.email);
  row('Driver', driver ? `${driver.name} · ${driver.vehicleColor} ${driver.vehicleMake} ${driver.vehicleModel}` : '—');
  row('Vehicle plate', driver?.vehiclePlate || '—');
  row('Pickup', ride.pickup_address);
  row('Drop-off', ride.dropoff_address);
  row('Distance', `${Number(ride.distance_km).toFixed(1)} km`);
  row('Payment method', ride.payment_method.charAt(0).toUpperCase() + ride.payment_method.slice(1));
  if (ride.rating) row('Your rating', `${ride.rating} / 5`);

  y += 10;
  doc.moveTo(50, y).lineTo(495, y).strokeColor('#ECECEE').stroke();
  y += 20;

  doc.font('Helvetica-Bold').fontSize(12).fillColor(ink).text('Fare Breakdown', 50, y);
  y += 22;
  row('Base fare', `$${baseFare.toFixed(2)}`);
  row('Distance fare', `$${distanceFare.toFixed(2)}`);

  y += 6;
  doc.moveTo(50, y).lineTo(495, y).strokeColor('#ECECEE').stroke();
  y += 16;
  doc.font('Helvetica-Bold').fontSize(14).fillColor(ink).text('Total Paid', 50, y);
  doc.font('Helvetica-Bold').fontSize(14).fillColor(ink).text(`$${Number(ride.estimated_fare).toFixed(2)}`, 220, y, { width: 325 });

  doc.fontSize(9).fillColor(soft).text(
    'Thanks for riding with Easy Ride. This receipt was generated automatically.',
    50, doc.page.height - 80, { width: 445, align: 'center' }
  );

  doc.end();
}));
